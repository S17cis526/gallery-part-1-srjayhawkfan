
"use strict"; //turns on strict node 
var http = require('http');
var port = 3438;
var fs= require('fs');

function serveImage(filename, req, res){

	var body = fs.readFile('images/'+filename, function(err, body){
	if(err){
		console.error(err);
		res.statusCode = 500;
		res.statusMessage = "whoops";
		res.end("Silly me");
		
		return;

	}

	});
        res.setHeader("Content-Type", "image/jpeg");
        res.end(body);



} 
var server = http.createServer((req, res) => {
	switch(req.url){

		case "/chess":
			serveImage("chess.jpg", req, res);
			break;
		case "/fern":
		case "/fern/":
		case "/fern.jpg":
		case "/fern.jpg/":
			serverImage("fern.jpg", req, res);
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
