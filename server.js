const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
var moment = require('moment');


const app = express()



app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
  let time = req.body.time;
  let ccode = (req.body.rcode).toUpperCase();
  let url = 'https://www.timetablegenerator.io/api/v2/school/mcmaster'

  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
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
                    if (rp[l]["day"]==2 && rp[l]["term"]==2 ){
                      
                      var start = rp[l]["start"]
                      
                      var end = rp[l]["end"]
                      var checkroom = rp[l]["room"]+"-"+ctypei[j]
                      
                     
                      if (!(start <= dt && dt <= end)&& (checkroom.indexOf(ccode) >= 0) && (/\d/.test(checkroom))){
                        if (dt <= start){
                          var nextclass = moment(start, ["HH:mm"]).format("h:mmA") + "  -  " + moment(end, ["HH:mm"]).format("h:mmA");
                          var classcode = value[courses[i]]["code"]
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
                          // r.push(checkroom )
                          // n.push(nextclass)   
                          // p.push(classcode)
                        }
                        
                      }
                      //console.log(dictionary)
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
        for (var k in dv ){
          
          r.push(dk[i])
          n.push(dv[k]["Time"])
          p.push(dv[k]["Class"])
          
        }
      }
      
    
        
        
      
    
      //console.log(r)
      if(rooms.section_types == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let roomlist = Array.from(r);
        let lectime = Array.from(n);
        let lect = Array.from(p)
        res.render('index', {roomse: roomlist, lt: lectime, c: lect, error: null});
      }
    }
  
    }  
    )
})


app.listen(8080, function () {
  console.log('Example app listening on port 3000!')
})