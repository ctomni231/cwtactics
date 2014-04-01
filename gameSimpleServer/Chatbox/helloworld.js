//Creates an http server variable on the server side
var http = require('http');

//Creates a server that can get responses and requests
http.createServer(function(req, res){
	//Status code 200 is "okay".
	res.writeHead(200, {'content-type':'text/plain'});
	//Finishes responses and outputs Hello World
	res.end('Hello World');
	//Tell the server to listen in on a port (doesn't matter which one)
}).listen(9001);

//Write to the console
console.log('Server is listening on a port over 9000!!!');