var http = require('http');
var url  = require('url');

// --------------------------------------------------------------------------------
// PROGRAM HEADER

var PORT = 8080;
var VERSION = "0.5";
var MAX_GAMES = 1;
var GAME_ID_LENGTH = 10;

var log = (function(){
  var PRE = "Simple CWT-Server "+VERSION+": ";
  
  return function(msg){
    console.log(PRE+msg);
  };
})();

// try to grab PORT from arguments when given
if(process.argv.length > 1){
  PORT = parseInt(process.argv[2],10);
  if( isNaN(PORT) ){
    log("could not read PORT from arguments! PORT must be an integer");
    return;
  }
}

// --------------------------------------------------------------------------------
// PROGRAM STUFF

var server;
var games = (function(){
  
  var n = 0;
  var list = [];

  while( n < MAX_GAMES ){
    list.push({
      id:null,
      active:false,
      users:[
        false,
        false,
        false,
        false
      ],
      commands:[ // command stacks for every player
        [],
        [],
        [],
        []
      ]
    });
    n++;
  }
  
  return list;
})();

//
//
var server_getGame = function( game_id ){
  var n = 0;
  while( n < games.length ){
    if( games[n].active && games[n].id === id ){
      
      // found game
      return games[n];
    }
    n++;
  }
  
  // game id is unknown
  return null;
};

//
//
var server_openGame = function(){
  log("trying to open a game");
  
  var game_id = (
    // prevent 0 as game id
    1+parseInt(Math.random()*(Math.pow(10,GAME_ID_LENGTH)-1),10)
  ).toString();
  
  var n = 0;
  while( n < games.length ){
    if( !games[n].active ){
      
      log("generated new game with id "+game_id);
      return game_id;
    }
    n++;
  }
  
  log("could not generate new game (no slot is free)");
  return -1;
};

//
//
var server_closeGame = function( game_id ){
  log("trying to close the game "+game_id);
  var game = server_getGame( game_id );
  
  if( !game ){
    log("could not close game "+game_id+", because it does not exists");
    return false;
  } 
  
  // deactivate slot
  game.id = null;
  game.active = false;
  return true;
};

//
//
var server_removeUser = function( user_id ){
  
};

//
//
var server_addUser = function( user_id ){
  var game = games[ gid ];
  game.push([]);
  return game.length-1;
};

//
//
var server_writeRepsoneHeader = function( response ){
  response.writeHead(200, {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
};

//
//
var server_writeRepsoneValue = function( response, parameter, value ){
  response.write(parameter+"="+value);
};

//
//
var server_grabRequestValue = function( params, name, isInt ){
  var value = params[name];
  
  // cannot be undefined
  if( value === void 0 ){
    log("could not read "+name+" from request parameters");
    return null;
  } 
  
  // int conversion
  if( isInt ){
    value = parseInt( uId, 10 )
    log("could not convert parameter "+name+" to int (value="+ params[name] +")");
  }
  
  return value;
};

var server_trueOrThrowError = function( response ){
  
};

// --------------------------------------------------------------------------------
// SERVER 

//
//
var server_handleRequest = function( request, response ){
  log("handle request - started");
  var value;
  
  // 1. read parameters
  var params  = url.parse(request.url, true).query;
  var cmd = server_grabRequestValue(params,"cmd",false);
  var game_id = server_grabRequestValue(params,"game_id",false);
  var sender_id = server_grabRequestValue(params,"user_id",true);
  
  var game = server_getGame(game_id);
  if( !game ){
    
    // 2. call command
    switch( cmd ){
      
      case "OPENGAME": 
        value = server_openGame();
        server_trueOrThrowError( !value );
        server_writeRepsoneValue(response,"gid",value);
        break;
      
      case "CLOSEGAME": 
        server_trueOrThrowError( server_closeGame( game_id ) );
        break;
            
      case "ADDUSER": 
        break;
            
      case "REMOVEUSER": 
        break;
            
      case "PUSHCMD":
        var cmd = JSON.parse( server_grabRequestValue(params,"data",false) );
        var list = game.commands;
        var n = 0;
        while( n < list.length ){
          if( n !== sender_id ){
            list[n].push(cmd);
          }
          n++;
        }
        break;
            
      case "GRABCMD": 
        var list = game.commands;
        server_writeRepsoneValue( response, "cmd_list", list.join("_&_") );
        list.splice(0);
        break;
    } 
  } else server_trueOrThrowError( false );
  
  // 3. write response
  server_writeRepsoneHeader(response);
  
  // 4. send answer
  response.end();
  
  log("handle request - finished");
};

console.log('starting server');

server = http.createServer(server_handleRequest);
server.listen(PORT);

console.log('server started successfully');