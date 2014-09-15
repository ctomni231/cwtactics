//This is the server side JS code

//Gets the required express functionality
var express = require('express'),
	//Binds express module to an object
	app = express(),
	//Creates an http server from the express object
	server = require('http').createServer(app),
	//Makes a socket that listens to the server object
	io = require('socket.io').listen(server),
	//creates a place to store the user nick names
	//nicknames = []; Updated for private messages
	users = {};
	
//Sets the server which port to listen
server.listen(3000);

//This creates a route to the index.html page
app.get('/', function(req, res){
    //This creates the file on the host computer when request from server
	res.sendfile(__dirname + '/index.html');
});

//This receives the message on the server side
//When a user connects to the server, it creates this event so...
//all the code must go within this function (like in jQuery)
io.sockets.on('connection', function(socket){

	//This code gets the "send message" command from index.html
	//This is where you can get creative with the messages
	//socket.on('send message', function(data){ update below
	socket.on('send message', function(data, callback){
	
		//Trim all the extra white space off the data
		var msg = data.trim();
		//The "===" is equivalent to String.compare() in Java (validates Strings) :)
		//Checks both versions of a whisper comment
		if(msg.substr(0,3) === '/w ' || msg.substr(0,3) === 'w/ '){
			//Trims the whisper mark
			msg = msg.substr(3);
			//Finds the next index of white space...
			var ind = msg.indexOf(' ');
			//Checks to see if it exists
			if(ind !== -1){
				//Gets the user name of the message
				var name = msg.substr(0, ind);
				//Gets the actual message
				var msg = msg.substr(ind+1);
				//Such a great search function for JS! Go JS!!!
				if(name in users){
					//Sends a message to the console
					console.log('Whisper!');
					//Sends a whisper message to one user on the list
					//whisper uses different functionality
					users[name].emit('whisper', {msg: msg, nick: socket.nickname});
					
				}else{
					//Sends an error message if the user name is invalid
					callback('Error! Please enter a valid user for your whisper.');
				}
			}else{
				//Sends an error message if there is no message
				callback('Error! Please enter a valid message for your whisper.');
			}
		}else{
		
			//This sends the message to all the users that are on the server
			//This uses the command new message to send to all users (basic)
			//io.sockets.emit('new message', data);
			//This uses the command new message to send to all users (with username)
			//io.sockets.emit('new message', {msg: data, nick: socket.nickname}); Not trimmed
			io.sockets.emit('new message', {msg: msg, nick: socket.nickname});
			//This is used to send to every user except for yourself
			//io.broadcast.emit('new message', data);
		}
	});
	
	//This code gets the "new user" command from index.html
	//The callback function goes back to the client for processing
	socket.on('new user', function(data, callback){
	
		//This checks to see if the user name exists within the database
		//if(nicknames.indexOf(data) != -1){ updated code below...
		if(data in users){
			//It sends a false callback to the client
			callback(false);
			//Better and safer type of callback
			//callback(isValid: false);
		} else {
			//It sends a true callback to the client
			callback(true);
			//This stores the user nickname within the socket itself
			//Useful because the user name is stored on every client (instead of just on the server)
			socket.nickname = data;
			//Adds this nickname to the array of nicknames above
			//nicknames.push(socket.nickname); updated code below
			users[socket.nickname] = socket;
			//Used to emit the updated user join and login list
			updateUsernames();
		}
	});
	
	//This code checks to see if a user disconnected for any reason
	//Used to safely disconnect users and do any cleanup necessary
	socket.on('disconnect', function(data){
		//If the user pops in and leaves without creating a username...
		if(!socket.nickname) 
			return;
			
		//Splice is used to remove users from the database
		//First parameter is where in the list, the second is the number of elements
		//In this case, it finds and deletes the socket of that user
		//nicknames.splice(nicknames.indexOf(socket.nickname), 1); Update below
		delete users[socket.nickname];
		
		//Used to emit the updated user join and login list
		updateUsernames();
	});
	
	//Reusable functions go here :)
	
	function updateUsernames(){
		//Used to emit the updated user join and login list
		//io.sockets.emit('usernames', nicknames); updates below
		//Object: Sends only the keys instead of the entire object
		io.sockets.emit('usernames', Object.keys(users));
	}
});