#!/usr/bin/env nodejs

'use strict';

//nodejs dependencies
const fs = require('fs');
const process = require('process');

//external dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mustache = require('mustache');
const https = require('https');


//options dependencies
const assert = require('assert');
const path = require('path');
const minimist = require('minimist')


//local dependencies
const user = require('./user/user');

const STATIC_DIR = 'statics';
const TEMPLATES_DIR = 'templates';

const USER_COOKIE = 'user_cookie';

const OPTS = [
  ['d', 'ssl-dir' ]
];

const DEFAULT_SSL_DIR = '.';


/*************************** Route Handling ****************************/

function setupRoutes(app) {
  app.get('/', rootRedirectHandler(app));
  app.get('/login.html', loginUserHandler(app));  
  //app.get('/register.html', registerUserHandler(app));
  app.put('/register.html', registerUserHandler(app));
  app.get('/account.html', useraccountdisplayhandler(app));
  app.get('/logout.html', logoutUserHandler(app));
}

function rootRedirectHandler(app) {
  return function(req, res) {
  	const userCookie = req.cookies[USER_COOKIE];
  	if(!userCookie || userCookie.status==='invalid'){
  			res.redirect('login.html');
  	}
  	else{
  		//res.send(doMustache(app,'results', {results: userCookie}))
			  res.redirect('account.html');	
  	}
    
  };
}

function registerUserHandler(app) {
  return function(req, res) {

  	const cookie = req.cookies[USER_COOKIE];
    const isDisplay = (typeof req.body.register === 'undefined');
    
    if (isDisplay) { //simply render register page
      res.send(doMustache(app, 'register', {}));
    }
    else {
    
      const errors = {};
      var errorCount = 0;
      
      for (var key in req.body){
      	if(key !== 'password' && key !== 'confirmpassword'){
      		errors[key] = req.body[key];
      	}
      	
      	if(key === 'email' && !req.body[key].match(/^\w+@\w+$/)){
      		errors[key+'Error'] = 'Please provide valid email address';
      		errorCount++;
      	}
      	
      	if(typeof req.body[key] === 'undefined' || req.body[key].trim().length === 0){
      		errors[key+'Error'] = `Please provide ${key}`;
      		errorCount++;
      	}else{
      		if(key === 'password' && (req.body.password.length < 8 || req.body.password.match(/\s/) || 
      											!req.body.password.match(/[0-9]/))){
     			errors[key+'Error'] = 'Password should consist of atleast 8 characters, one number and no spaces';
      		errorCount++;
      		}
      	}
      }
      
			if((typeof req.body.password!=='undefined' && req.body.password.trim().length !== 0) && 
					(typeof req.body.confirmpassword!=='undefined'&& req.body.confirmpassword.trim().length !== 0) && 
						req.body.password !== req.body.confirmpassword ){
					errors['mismatchpasswordError'] = 'Password do not match';
					errorCount++;
			}
			
      if(errorCount !== 0 ){
	      		errorCount = 0;
   					res.send(doMustache(app, 'register', errors));
      }
      
      else {
      	let query= {};
        for(var key in req.body){
        	query[key] = req.body[key].trim();
        }
				app.user.search(query)
			  .then(function (json) {
		  		processRegistration(app, query, json, res, req)
	  		}
	  		)
	  .catch((err) => console.error(err));
      }
    }
  }
}


function processRegistration(app, q, json, res, req) {
  let template, view;
  //console.log('json in register:'+JSON.stringify(json.status));
  //console.log('json in register:'+json.status);

  if (json.status === '401') {
    template = 'register';
    view = { otherError: `user already exists for ${q.email}`, firstname:q.firstname, lastname:q.lastname,
    					email:q.email };
    	 const html = doMustache(app, template, view);
  		res.send(html);
  }
  else if(json.status === 'CREATED'){
    const userCookie = req.cookies[USER_COOKIE];
    if(!userCookie || userCookie.status === 'invalid'){
    	res.cookie(USER_COOKIE, {email:q.email, authToken:json.authToken, status:'valid'});
    }
    //console.log('cookie:'+JSON.stringify(userCookie));
   	res.redirect('account.html');
   }
   else{
   	const view = {otherError:'internal server error'};
   	res.send(doMustache(app,'register', view));
   }
}

function loginUserHandler(app) {
  return function(req, res) {

    const cookie = req.cookies[USER_COOKIE];  
    const isDisplay = (typeof req.query.submit === 'undefined');
    const formSubmit = req.query.formdata;
		//console.log('cookie in login handler:'+JSON.stringify(cookie.session));
    
    if(typeof cookie !=='undefined' && cookie.status==='valid'){
    	res.redirect('account.html');
    }else if(typeof cookie !=='undefined' && cookie.session === 'invalid'){
    		cookie.session = "";
    		res.cookie(USER_COOKIE, cookie);
    		
    		const result = {otherError:'session expired'};
    		const view = {results: result};
    		
    		res.send(doMustache(app,'login', result));
    }
    else
    if (isDisplay) { //simply render login page
      res.send(doMustache(app, 'login', {}));
    }
    else {
      const errors = {};
      var errorcount = 0;
      for (var key in req.query){
      	if(key !== 'password'){
      		errors[key] = req.query[key];
      	}
      	if(typeof req.query[key] === 'undefined' || req.query[key].trim().length === 0){
      		errors[key+'Error'] = `Please provide ${key}`;
      		errorcount++;
      	}
      }
      
      if (errorcount !== 0 ) {
				res.send(doMustache(app, 'login', errors));
      }
      else {
      let query= {};
        for(var key in req.query){
        	if(key === 'email'){
	        	query[key] = req.query[key].trim();
	        	}
	        	else{
	        	query[key] = req.query[key];
	        	
	        	}
        }
				app.user.searchLogin(query)
				  .then((json) => processLoginUserInfo(app, query, json, res, req))
				  .catch((err) => console.error(err));
      }
    }
  }
}


function processLoginUserInfo(app, q, json, res, req) {
  let template, view;
  //console.log('json in login:'+JSON.stringify(json));
  if(json.status === '401'){
  	template = 'login'	
  	view = {otherError: 'incorrect password', email: q.email };
  	const html = doMustache(app, 'login', view);
  			res.send(html);
  }
  else if(json.status === '404'){
  	template = 'login'	
  	view = {otherError: 'user not found', email: q.email };
  	const html = doMustache(app, 'login', view);
  			res.send(html);    	
  }
  else if(json.status === 'OK'){
  template = 'account';
  const userCookie = req.cookies[USER_COOKIE];
    if(!userCookie || userCookie.status==='invalid'){
    	res.cookie(USER_COOKIE, {email:q.email, authToken:json.authToken, status:'valid'});
			res.redirect('account.html');
    	}else{
  				view = {results : userCookie};
			  	res.redirect('account.html');
  		}
  	}
  else {
  	view = {otherError: 'internal server error', email: q.email };
  	const html = doMustache(app, 'login', view);
  			res.send(html);    		
  	}
  }

function useraccountdisplayhandler(app){
	return function(req,res){
		let view;
	  const userCookie = req.cookies[USER_COOKIE];
	  if(userCookie.status === 'invalid'){
	  		res.redirect('login.html');
	  }
	  else{
			app.user.getUserInfo(userCookie).then((json)=>{
				if(json.status === '401'){
  				res.cookie(USER_COOKIE,{status:'invalid',session:'invalid'});
  				res.redirect('login.html');
  			}
  			else {
  				const results = {firstname: json.firstname, lastname:json.lastname};
  				view = {results:results};				
  				const html = doMustache(app, 'account', view);
  				res.send(html);    	  				
  			}
			}).catch((err)=>{
  				const results = {otherError: 'internal server error', email: req.query.email};
  				view = {results:results};				
  				
  				const html = doMustache(app, 'login', view);
  				res.send(html);    	
			})
		}
	}
}

function logoutUserHandler(app){

	return function(req,res){
		const userCookie = req.cookies[USER_COOKIE];
		if(userCookie.status === 'valid'){
			res.cookie(USER_COOKIE, {status:'invalid'});
		}
			res.redirect('login.html');
	}
}


/************************ Utility functions ****************************/

function doMustache(app, templateId, view) {
  const templates = { footer: app.templates.footer };
  return mustache.render(app.templates[templateId], view, templates);
}

function errorPage(app, errors, res) {
  if (!Array.isArray(errors)) errors = [ errors ];
  const html = doMustache(app, 'errors', { errors: errors });
  res.send(html);
}

/************************ Options ****************************/
function usage(prg) {
  const opts = OPTS.map(function(opt) {
    const value = opt[1].replace('-', '_').toUpperCase();
    return `[ -${opt[0]}|--${opt[1]} ${value} ]`
  });
  console.error(`usage: ${path.basename(prg)} ${opts.join(' ')} PORT WS_URL`);
  process.exit(1);
}

function getOptions(argv) { 
  const opts0 = OPTS.reduce((a, b) => a.concat(b), []);
  const opts = minimist(argv.slice(2));
  if (opts._.length !== 2) usage(argv[1]);
  for (let k of Object.keys(opts)) {
    if (k === '_') continue;
    if (opts0.indexOf(k) < 0) {
      console.error(`bad option '${k}'`);
      usage(argv[1]);
    }
  }
  return {
    port: opts._[0],
 		ws_url: opts._[1],
    sslDir: opts.d || opts['ssl-dir'] || DEFAULT_SSL_DIR
  };
}

  
/*************************** Initialization ****************************/

function setupTemplates(app) {
  app.templates = {};
  for (let fname of fs.readdirSync(TEMPLATES_DIR)) {
    const m = fname.match(/^([\w\-]+)\.ms$/);
    if (!m) continue;
    try {
      app.templates[m[1]] =
	String(fs.readFileSync(`${TEMPLATES_DIR}/${fname}`));
    }
    catch (e) {
      console.error(`cannot read ${fname}: ${e}`);
      process.exit(1);
    }
  }
}

function setup() {
  process.chdir(__dirname);
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const options = getOptions(process.argv);
  const app = express();
  app.use(cookieParser());
  setupTemplates(app);
  app.user = user;
  app.user.setws_url(options.ws_url);
  app.use(express.static(STATIC_DIR));
  app.use(bodyParser.urlencoded({extended: true}));
  setupRoutes(app);
  https.createServer({
  key: fs.readFileSync(`${options.sslDir}/key.pem`),
  cert: fs.readFileSync(`${options.sslDir}/cert.pem`),
		}, app).listen(options.port);
	console.log(`listening to ${options.port}`);
}

setup();
