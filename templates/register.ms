<!DOCTYPE html>
<html>
  <head>
    <title>Register</title>
    <link rel="stylesheet" href="/css/style.css">
  </head>
  <body>
    <h1>Register</h1>
    <p class="error">{{msg}}</p>
    <form method="PUT" action="/register.html">
     <table> 
     	<tr>
     		<label>
					<td><span class="label">first name</span></td>
					<td><input name="firstname" class="control" value="{{firstname}}"><br></td>
					<td>{{#firstnameError}}<span class="error">{{firstnameError}}<br></span>{{/firstnameError}}</td>
      	</label>
      </tr>
      <tr>
      	<label>
					<td><span class="label">last name</span></td>
					<td><input name="lastname" class="control" value="{{lastname}}"><br></td>
					<td>{{#lastnameError}}<span class="error">{{lastnameError}}<br></span>{{/lastnameError}}</td>
      	</label>
      </tr>
      <tr>
      	<label>
					<td><span class="label">email</span></td>
					<td><input name="email" class="control" value="{{email}}"><br></td>
					<td>{{#emailError}}<span class="error">{{emailError}}<br></span>{{/emailError}}</td>
      	</label>
      </tr>
      <tr>
      	<label>
      		<td><span class="label">password</span></td>
					<td><input type="password" name="password" class="control" value="{{password}}"><br></td>
					<td>{{#passwordError}}<span class="error">{{passwordError}}<br></span>{{/passwordError}}</td>
      	</label>
      </tr>
      <tr>	
      	<label>
      		<td><span class="label">confirm password</span></td>
					<td><input type="password" name="confirmpassword" class="control" value="{{confirmpassword}}"><br></td>
					<td>{{#confirmpasswordError}}<span class="error">{{confirmpasswordError}}<br></span>{{/confirmpasswordError}}</td>
      	</label>
      </tr>
   	</table>
 			{{#mismatchpasswordError}}<span class="error">{{mismatchpasswordError}}<br></span>{{/mismatchpasswordError}}  
 			{{#otherError}}<span class="error">{{otherError}}<br></span>{{/otherError}}         
   		<input name="register" type="submit" value="register" class="control">
   	</form> 
    <p><a href="/login.html">Login</a></p>
    <script language="javascript" type="text/javascript">
				function removeSpaces(string) {
 				return string.split(' ').join('');
			}
</script>
  </body>
</html>
