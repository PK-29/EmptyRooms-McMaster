<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Test</title>
    <link rel="stylesheet" type="text/css" href="/css/style.css">
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:300' rel='stylesheet' type='text/css'>
  </head>
  <body>
    <div class="container">
      <fieldset>
        <form action="/" method="post">
          <div style="float:left;width: 45%; padding-right:70px; ">
            <input name="time" type="text" class="ghost-input" placeholder="Enter a Time (ex: 11:00PM)" required>
          </div>
          <div style="float:left; width: 30%;">
          <input name="rcode" type="text" class="ghost-input" placeholder="Enter Room Code" required>
          </div>
          <input type="submit" class="ghost-button" value="List EmptyRooms">
        </form>
        <ul style="width:25%;">
          <% for(var i=0; i < roomse.length; i++){ %>
            
            <li><%= roomse[i] %></li>
            
          <% } %>
        </ul>
       
        <ul style="width:25%;">
          <% for(var i=0; i < roomse.length; i++){ %>
            
            <li><%= lt[i] %></li>
            
          <% } %>
        </ul>
        <ul style="width:25%;">
          <% for(var i=0; i < roomse.length; i++){ %>
            
            <li><%= c[i] %></li>
            
          <% } %>
        </ul>
        <% if(error !== null){ %>
          <p><%= error %></p>
        <% } %>
      </fieldset>
    </div>
  </body>
</html>
