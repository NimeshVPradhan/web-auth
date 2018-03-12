<!DOCTYPE html>
<html>
  <head>
    <title>Account</title>
    <link rel="stylesheet" href="/css/style.css">
  </head>
  <body>
    <h1>Account</h1>
    {{^results.length}}
    <span class="user">Welcome,</span>
    {{/results.length}}
    {{#results}}
    <p>
      <span class="firstname">{{firstname}}</span>
      <span class="lastname">{{lastname}}</span>
      <br>
    </p>
    {{/results}}
    <form method="GET" action="/logout.html">
    <input name="submit" type="submit" value="Logout" class="control">
    </form> 
    
  </body>
</html>
