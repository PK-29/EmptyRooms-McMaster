const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
var moment = require('moment');


const app = express()

var port = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {roomse: [], error: null});
})

app.post('/', function (req, res) {
  var days = ["Mon", "Tues", "Wed", "Thurs", "Fri"]
  var time = req.body.time;
  var ccode = (req.body.rcode).toUpperCase();
  var day = days.indexOf(req.body.day)+1;
  
  var term = req.body.term;
  if(term == 2){
    term = 5;
    
  }else{
    term=term*2
  }
  let url = 'https://www.timetablegenerator.io/api/v2/school/mcmaster'

  request(url, function (err, response, body) {
    if(err){
      res.render('index', {roomse: null, error: 'Error, please try again'});
    } else {
      let rooms = JSON.parse(body)
      var dt = moment(time, ["h:mmA"]).format("HH:mm");
      var value = rooms.timetables["2017"]["6"].courses
      var courses = Object.keys(value)
      //console.log(value)
      var i, j , k;
      var r = []
      var n = []
      var p = []
      var differ = new Set()
      var bypass = new Set()
      var dictionary = {}
      for (i in courses){
        //console.log(value[courses[i]])
        var ctype = value[courses[i]]["sections"]
        var ctypei = Object.keys(ctype)
        
          for (j in ctypei ){
            
            var core = ctype[ctypei[j]]
            var corei = Object.keys(core)
            //console.log(corei)
              for (k in corei){
                var rp = core[corei[k]]["r_periods"]
                for (var l in rp){
                  
                  try{
                    if (rp[l]["day"]==day && rp[l]["term"]==term ){
                      
                      var start = rp[l]["start"]
                      
                      var end = rp[l]["end"]
                      var checkroom = rp[l]["room"]
                      
                      if (!(dt >= start && dt <= end)&& (checkroom.indexOf(ccode) >= 0) && (/\d/.test(checkroom)) && !bypass.has(checkroom)){
                       // console.log(start+" "+end+" " + dt+ " "+ checkroom)
                        if (dt <= start){
                          var nextclass = moment(start, ["HH:mm"]).format("h:mmA") + "  -  " + moment(end, ["HH:mm"]).format("h:mmA");
                          var classcode = value[courses[i]]["code"]+"-"+ctypei[j]
                        }else{
                          var nextclass = "Empty"
                          var classcode = "NONE"
                        }
                        
                        var anychange = differ.size
                        differ.add(checkroom+nextclass+classcode)
                        if (anychange != differ.size){
                          if (checkroom in dictionary){
                            
                            var array = dictionary[checkroom]
                            
                            array.push({
                              Time : nextclass,
                              Class : classcode
                            })
                            dictionary[checkroom]=array
                          }else{
                            dictionary[checkroom]=[{
                              Time : nextclass,
                              Class : classcode
                            }]
                          }
                         
                        }
                        
                      }else{
                        if (dictionary.hasOwnProperty(checkroom)){
                          delete dictionary[checkroom]
                        }
                        bypass.add(checkroom)
                        
                      }
                    }
                      
                  }  
                  
          
                  catch (e){
                      continue
            
                  }
              }
              }
            
          }
      }
      
      var dk = Object.keys(dictionary)
      
      
      for (var i in dk){
       var dv = dictionary[dk[i]]
       r.push(dk[i])
       
       let alltime = []
       let allclass = []
        for (var k in dv ){
          
          if ((dv.length == 1 && dv[k]["Time"] == "Empty")||(dv.length >= 1 && dv[k]["Time"]!=="Empty")){
            
            alltime.push(dv[k]["Time"])
            allclass.push(dv[k]["Class"])
          }
        }
        n.push(alltime)
        p.push(allclass)
      }
      
      if(rooms.section_types == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        console.log("RENDERING")
        let roomlist = Array.from(r);
        let lectime = Array.from(n);
        let lect = Array.from(p);
       
       
        res.render('index', {roomse: roomlist, lt: lectime, c: lect, t: time, d: days[day-1], m: req.body.term, error: null});
      }
    }
  
    }  
    )
})


app.listen(port, function () {
  console.log('Example app listening on port 8080!')
})