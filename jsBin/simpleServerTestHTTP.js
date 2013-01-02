var http = require('http');
var url = require('url');

var server;
var games = [];
var MAX_GAMES = 10;

function registerGame(){
  for( var i=0,e=MAX_GAMES; i<e; i++ ){
    if( games[i] === null || games[i] === undefined ){
      games[i] = [];
      return i;
    }
  }

  return -1;
}

function registerUser( gid ){
  var game = games[ gid ];
  game.push([]);
  return game.length-1;
}

server = http.createServer(function( request, response) {
  console.log("got request "+request.url );

  var params = url.parse(request.url, true).query;

  var cmd = params.cmd;
  var gId = params.gameId;
  var uId = params.userId;
  var cmdData = params.gamedata;

  if( gId !== undefined && gId.length > 0 ) gId = parseInt( gId, 10 );
  if( uId !== undefined && uId.length > 0 ) uId = parseInt( uId, 10 );

  response.writeHead(200, {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
});


  switch( cmd ){

    //#################################################################
    case 'createGame' :
      var id = registerGame();
      console.log("creating game with id "+id);
      response.write("gid="+id);
      break;

    //#################################################################
    case 'addClient':
      console.log("adding client to game with id "+gId);
      var uid = registerUser( gId );
      console.log("userid "+uid);
      response.write("uid="+uid);
      break;

    //#################################################################
    case 'pushCmd':
      console.log("player with id "+uId+" pushes command "+cmdData
                    +" to game with id "+gId );

      var game = games[ gId ];

      for( var i=0,e=game.length; i<e; i++ ){
        if( i !== uId ){
          console.log( "adding them for client "+i );
          game[i].push(cmdData);
        }
      }

      break;

    //#################################################################
    case 'getCmds':
      console.log("returning game commands for user "+uId+" game "+gId );
      var game = games[ gId ];
      var cmds = game[ uId ];

      var num = cmds.length;
      var msg = cmds.join("_&_");
      cmds.splice(0);
      console.log("has "+num+" commands ==> "+msg);

      response.write( msg );

      break;

    //#################################################################
    case 'closeGame':
      console.log("close game with id "+gId);
      games[gId] = null;
      break;

    //#################################################################
    default:
      console.log("got unknown command");
  }

  response.end();
});

server.listen(8080);
console.log('simple CWT server running at localhost:8080');