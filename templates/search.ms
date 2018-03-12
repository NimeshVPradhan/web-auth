<!DOCTYPE html>
<html>
  <head>
    <title>Login</title>
    <link rel="stylesheet" href="/css/style.css">
  </head>
  <body>
    <h1>Login</h1>
    <p class="error">{{msg}}</p>
    <form method="GET" action="/search.html">
    <table>
    	<tr>  
    		<label>
					<td><span class="label">email</span></td>
					<td><input name="email" class="control" value="{{email}}"><br></td>
					<td>{{#emailError}}<span class="error">{{emailError}}<br></span>{{/emailError}}</td>
      	</label>
      </tr>
    	<tr>  
    		<label>
     			<td> <span class="label">password</span></td>
					<td><input type="password" name="password" class="control" value="{{password}}"><br></td>
					<td>{{#passwordError}}<span class="error">{{passwordError}}<br></span>{{/passwordError}}</td>
      	</label>
     </tr>
    </table>
         <tr> 
     					<td>{{#otherError}}<span class="error">{{otherError}}<br></span>{{/otherError}}</td>
     			<tr>
         		<input name="submit" type="submit" value="Login" class="control">
    </form> 
    <p><a href="/register.html">Register</a></p>
  </body>
</html>
