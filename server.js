
"use strict"; //turns on strict node
var http = require('http');
var url = require('url');
var port = 3438;
var fs= require('fs');
var stylesheet = fs.readFileSync('gallery.css');
var config = JSON.parse(fs.readFileSync('config.json'));
var imageNames = ['ace.jpg', 'bubble.jpg', 'chess.jpg', 'fern.jpg'];
var title;
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
			html += '<title>'+config.title+'</title>';
			html += '<link href="gallery.css" rel="stylesheet" type="text/css">';
			html += '</head>';
			html += '<h1>Hello. </h1> Time is '+Date.now();
			html += '<body>';
			html += '<h1>'+config.title+'</h1>';
			html += '<form>';
					html += '<input type="text" name="title">'
					html += '<input type="submit" name="submit">'
			html += '</form>'
			html += imageNamesToTags(imageTags).join(' ');
			html += '<form method="POST">';
						html += '<input type="file" name="image">';
									html += '<input type="submit" value="Upload Image">';
			html += '</form>'	;
			html += '</body>';

	return html;





}

function uploadImage(req, res){
	var body;

	req.on('error', function(){
		res.statusCode = 500;
		res.end();

	});

	req.on('data', function(data){
		body += data;
	});

	req.on('end', function(){
		// process information
		// write to a fileName
		fs.writeFile('filename', data, function(err){
				if(err){
					console.error(err);
					res.statusCode = 500;
					res.end();
					return;
				}
			serveGallery(req, res)
		})

	});
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

	var urlParts = url.parse(req.url);


	if(urlParts.query){
	 	var matches =	/title=(.+)(&|$)/.exec(urlParts.query);
	 if(matches && matches[1]){
		 title = decodeURIComponent(matches[1]);
		 fs.writeFile('config.json', JSON.stringify({title: title}));

	 }
	}

	switch(urlParts.pathname){
		case '/':
		case '/gallery':
  		serveGallery(req, res);
			if(req.method == 'GET'){
				serveGallery(req, res);

			}else if(req.method == 'POST'){


			}


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
