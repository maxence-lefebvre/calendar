var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var url = require('url');
var authHelper = require('./authHelper');
var fs = require('fs');
var outlook = require('node-outlook');
var Busboy = require('busboy');
var csv = require('csv-parser');
var moment = require('moment');
var ejs = require('ejs');

function getValueFromCookie(valueName, cookie) {
  if (cookie.indexOf(valueName) !== -1) {
    var start = cookie.indexOf(valueName) + valueName.length + 1;
    var end = cookie.indexOf(';', start);
    end = end === -1 ? cookie.length : end;
    return cookie.substring(start, end);
  }
}

function getUserEmail(token, callback) {
  outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');

  var queryParams = {
    '$select': 'DisplayName, EmailAddress',
  };

  outlook.base.getUser({token: token, odataParams: queryParams}, function(error, user){
    if (error) {
      callback(error, null);
    } else {
      callback(null, user.EmailAddress);
    }
  });
}

function tokenReceived(response, error, token) {
  if (error) {
    console.log('Access token error: ', error.message);
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write('<p>ERROR: ' + error + '</p>');
    response.end();
  }
  else {
    getUserEmail(token.token.access_token, function(error, email){
      if (error) {
        console.log('getUserEmail returned an error: ' + error);
        response.write('<p>ERROR: ' + error + '</p>');
        response.end();
      } else if (email) {
        var cookies = ['node-tutorial-token=' + token.token.access_token + ';Max-Age=4000',
        'node-tutorial-refresh-token=' + token.token.refresh_token + ';Max-Age=4000',
        'node-tutorial-token-expires=' + token.token.expires_at.getTime() + ';Max-Age=4000',
        'node-tutorial-email=' + email + ';Max-Age=4000'];
        response.setHeader('Set-Cookie', cookies);
        response.writeHead(302, {'Location': 'http://localhost:8000/creatCalendarEvent'});
        response.end();
      }
    });
  }
}

app.get('/', function(req,res){
  res.sendFile(__dirname + '/login.html');
  var content = fs.readFileSync('login.html', 'utf-8');
  var authUrl = authHelper.getAuthUrl(); 
  var renderedHtml = ejs.render(content, {authUrl: authUrl});  
  res.end(renderedHtml); 
});

app.get('/authorize', function(req, res){
  var url_parts = url.parse(req.url, true);
  var code = url_parts.query.code;
  authHelper.getTokenFromCode(code, tokenReceived, res);
});

app.get('/creatCalendarEvent', function(request, response){
  response.sendFile(__dirname + '/index.html');
});


app.post('/postCalendarEvent', function(req, res){
  var token = getValueFromCookie('node-tutorial-token', req.headers.cookie);
  var email = getValueFromCookie('node-tutorial-email', req.headers.cookie);
  var busboy = new Busboy({ headers: req.headers });
  
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    file.pipe(csv({
      separator: ';', 
      headers: ['Annee', 'Créneau', 'Salle', 'Activité','Description', 'Réservations']
    }))
    .on('data', function(data) {
		
		if (data.Annee != 'Date'){
			var date = data.Créneau.split(" - ");
			var dateTimeStart = moment(data.Annee+" "+date[0]).format();
			var dateTimeEnd = moment(data.Annee+" "+date[1]).format();
			var content = "<p>"+data.Description+"</p><br><br>"+"<p>"+data.Salle +"</p><br><br>"+ data.Réservations;
			
			if (token) {
				outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');
			  
				var newEvent = {
					'Subject': data.Activité,
					'Body': {
						'ContentType': 'HTML',
						'Content': content,
					},
					'Start': {
						'DateTime': dateTimeStart,
						'TimeZone': 'Central European Standard Time'
					},
					'End': {
						'DateTime': dateTimeEnd,
						'TimeZone': 'Central European Standard Time'
					},
				};
					
				outlook.calendar.createEvent({token: token, event: newEvent},
					function(error, result){
						if (error) {
							console.log('createEvent returned an error: ' + error);
						}
					}
				);	
			}
			else {
				response.writeHead(200, {'Content-Type': 'text/html'});
				response.write('<p> No token found in cookie!</p>');
				response.end();
			}
		}
    });
  });
  busboy.on('finish', function() {
    res.writeHead(303, { Connection: 'close', Location: '/' });
    res.end();
  });
  
  req.pipe(busboy);
});


  app.listen(8000, function(){
    console.log('Server started on port 8000');
  });
