<!DOCTYPE html>
<html>
  <head>
    <title>Login</title>
    <link rel="stylesheet" href="/css/style.css">
  </head>
  <body>
    <h1>Login</h1>
    <p class="error">{{msg}}</p>
    <form method="GET" action="/login.html">
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
     				<input type="hidden" name="formdata" value="formdata">
         		<input name="submit" type="submit" value="Login" class="control">
    
    </form> 
    <from method="PUT" action="/register.html">
        		<input name="submit" type="submit" value="Register" class="control"> 	
    </from>
  </body>
</html>
