
"use strict"; //turns on strict node
var http = require('http');
var port = 3438;
var fs= require('fs');
var stylesheet = fs.readFileSync('gallery.css');

var imageNames = ['ace.jpg', 'bubble.jpg', 'chess.jpg', 'fern.jpg'];

function getImageNames(callback){
	fs.readdir('images/', function(err, fileNames){
		if(err){
			callback(err, undefined);
		}else{
			callback(false, fileNames);
		}

	});




}

function imageNamesToTags(fileNames)
{
	console.log(fileNames);
	return fileNames.map(function(fileName)
	{
		return `<img src="${fileName}" alt="${fileName}">`
	});


}

function serveGallery(req, res){
	getImageNames(function(err, imageNames){
		if(err){

				console.error(err);
				res.statusCode = 500;
				res.statusMessage = 'Server error';
				res.end();
				return;


		}

		res.setHeader('Content-Type', 'text/html');
		res.end(buildGallery(imageNames));




	});




}

function buildGallery(imageTags){

	var html ='<!doctype html>';
			html += '<head>';
			html += '<title>Dynamic Page</title>';
			html += '<link href="gallery.css" rel="stylesheet" type="text/css">';
			html += '</head>';
			html += '<h1>Hello. </h1> Time is '+Date.now();
			html += '<body>';
			html += '<h1>Gallery</h1>';
			html += imageNamesToTags(imageTags).join(' ');
			html += '</body>';

	return html;





}

function serveImage(fileName, req, res){

	var body = fs.readFile('images/'+fileName, function(err, body){
	if(err){
		console.error(err);
		res.statusCode = 404;
		res.statusMessage = "Resource not found";
		res.end();

		return;

		}
			res.setHeader("Content-Type", "image/jpeg");
      res.end(body);



	});




}
var server = http.createServer(function(req, res){
	switch(req.url){
		case '/':
		case '/gallery':
  		serveGallery(req, res);



				break;

		case '/gallery.css':
		case '/gallery.css/':
		case '/gallery':
		case '/gallery/':
		  res.setHeader('Content-Type', 'text/css');
			res.end(stylesheet);
			break;

		default:
			serveImage(req.url, req, res);

			break;
	}
});

server.listen(port, ()=>{
	console.log("Listening on Port "+port);

});
// listen server
