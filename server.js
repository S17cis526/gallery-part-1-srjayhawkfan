
"use strict"; //turns on strict node
var http = require('http');
var port = 3438;
var fs= require('fs');
var stylesheet = fs.readFileSync('gallery.css');

var imageNames = ['ace.jpg', 'bubble.jpg', 'chess.jpg', 'fern.jpg'];

function serverImage(filename, req, res){

	var body = fs.readFile('images/'+filename, function(err, body){
	if(err){
		console.error(err);
		res.statusCode = 500;
		res.statusMessage = "whoops";
		res.end("Silly me");

		return;

	}
	res.setHeader("Content-Type", "image/jpeg");
        res.end(body);



	});




}
var server = http.createServer((req, res) => {
	switch(req.url){
		case "/gallery":
				var gHtml = imageNames.map(function(fileName){
					return '<image src="'+fileName+'" alt="a fishing ace at work">'

				}).join(' ');
				var html ='<!doctype html>';
						html += '<head>';
						html += '<title>Dynamic Page</title>';
						html += '<link href="gallery.css" rel="stylesheet" type="text/css">';
						html += '</head>';
						html += '<h1>Hello. </h1> Time is '+Date.now();
						html += '<body>';
						html += '<h1>Gallery</h1>';
						html += '<image src="ace.jpg" alt="a fishing ace at work">';
						html += '</body>';
						res.setHeader('Content-Type', 'text/html');
						res.end(html);
				break;
		case "/chess":
			serveImage("chess.jpg", req, res);
			break;
		case "/fern":
		case "/fern/":
		case "/fern.jpg":
		case "/fern.jpg/":
			serverImage("fern.jpg", req, res);
                        break;
		case '/ace.jpg':
			serverImage('ace.jpg', req, res);
			break;
		case '/gallery.css':
		  res.setHeader('Content-Type', 'text/css');
			res.end(stylesheet);
			break;
		default:
			res.statusCode = 404;
			res.statusMessage = "Not Found";
			res.end();
	}
});

server.listen(port, ()=>{
	console.log("Listening on Port "+port);

});
// listen server
