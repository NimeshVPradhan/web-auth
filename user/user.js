'use strict';

const axios = require('axios');

//const WS_URL = 'http://localhost:8081';

function Shop(WS_URL) {
  this.baseUrl = WS_URL;
}

function setws_url(WS_URL) {
  this.baseUrl = WS_URL;
}

//prototype to set WS_URL
Shop.prototype.setws_url = function(WS_URL) {
	this.baseUrl = WS_URL;
}

//All action functions return promises.

Shop.prototype.search = function(req) {
	const token = req.authToken;
  return axios.put(`${this.baseUrl}/users/${req.email}?pw=${req.password}`, {body: req, headers:{Authorization:`bearer ${token}`}})
    .then((response) => response.data)
    .catch((err) => { 
    									var error = String(err);
    									var errcode = error.substr(error.lastIndexOf(' ')+1);
    									//console.log('err:'+errcode);
    									return {status:errcode}});;
}

Shop.prototype.searchLogin = function(req) {
	const token = req.authToken;
	return axios.put(`${this.baseUrl}/users/${req.email}/auth`, {pw: req.password})
    .then((response) => response.data)
    .catch((err) => { 
    									var error = String(err);
    									var errcode = error.substr(error.lastIndexOf(' ')+1);
    									return {status:errcode}});
}

Shop.prototype.getUserInfo = function(cookie) {
	const token = cookie.authToken;
	return axios.get(`${this.baseUrl}/users/${cookie.email}`, {headers:{Authorization:`bearer ${token}`}})
    .then((response) => response.data.body)
    .catch((err) => { 
  										var error = String(err);
    									var errcode = error.substr(error.lastIndexOf(' ')+1);
    									return {status:errcode}});
}


module.exports = new Shop();

