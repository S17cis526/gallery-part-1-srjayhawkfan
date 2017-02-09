/**
* @module multipart
*  A module for processing multipart HTTP request
**/
"use strict;"
module.exports =  processBody;


const DOUBLE_CRLF = Buffer.from([0x0D, 0x0A, 0x0D,0x0A]);

/**
* @function multipart
* takes a request and a response object.
* Takes a buffer and a boundary and
* returns a associative array of keyvalue pairs.
* key/value pairs; if content is a file, value will be an
* object with properties filename, contentType, and data.
*/

function multipart(req, res, next)
{
  req.on('error', function(err){
    console.error(err);
    res.statusCode = 500;
    res.end();

  });

  req.on('data', function(chunk){
    chunk.push(chunk);


  });

  req.on('end', function(){
    var boundary = req.headers["Content-Type"];
    var buffer = Buffer.concat(chunks);
    req.body =   processBody(buffer, boundary);
    next(req, res)
  })
}

/**
* @function processBody
* takes a request and a response object.
* Takes a buffer and a boundary and
* returns a associative array of keyvalue pairs.
* key/value pairs; if content is a file, value will be an
* object with properties filename, contentType, and data.
*/
function processBody(buffer, boundary, callback)
{
      var start = buffer.indexOf(boundary) + boundary.length + 2;
      var end = buffer.indexOf(boundary, start);

      start = end+buffer.length+2
      end = buffer.indexOf(boundary, start);

      while(end > start)
      {
        contents.push(buffer.slice(start, end));
        start = end + boundary.length + 2;
        end = buffer.indexOf(boundary, start);



      }

      // TODO: contents

      var parsedContents[] = {};
      contents.forEach(function(content){

        parseContent(contentn function(err, tuple){
            if(err) return console.error(err);
            parseContents[tuple[0]] = tuple[1];

        });

      });

      return parsedContents;


}


/**
* @function parseContent
* takes a request and a response object.
* Takes a buffer and a boundary and
* returns a associative array of keyvalue pairs.
* key/value pairs; if content is a file, value will be an
* object with properties filename, contentType, and data.
*/
function parseContent(content, callback)
{
  var index = content.indexOf(DOUBLE_CRLF);
  var head = content.slice(0, index).toString();
  var body = content.slice(index + 4);

  var name = /name="([\w\d\-_])"/.exce(head);
  var filename = /filename="([\w\d\-_\.]+)"/.exec(head);
  var contentType = /Content-Type: ([\w\d\/])/.exec(head);

  if(!name) return callback("Content without name");
  if(filename){
    // we have a file

    callback(false, [name[1], {
      filename: filename[1],
      contentType:(contentType)?contentType[1]:'application/octet-stream' ,
      data: body
    }]);

  }else{
    // we have a value
    return [name[1], body.toString()];
  }




}
