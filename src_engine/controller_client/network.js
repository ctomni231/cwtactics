controller.isNetworkGame = function(){
  return false;
};

controller.isHost = function(){
  return true;
};

/*

controller._incomingMessage = function( msg ){
  network.parse( msg );
};

controller._gameId   = -1;
controller._clientId = -1;
controller._target   = null;

controller.send = function( obj ){
  var msg = JSON.stringify( obj );

  var xmlHttp = new XMLHttpRequest();

  xmlHttp.open('GET',
    network._target+"?cmd=pushCmd&gameId="+
                network._gameId+"&userId="+network._clientId+"&gamedata="+msg,
    true
  );
  xmlHttp.onreadystatechange = function () {};
  xmlHttp.send(null);
};

controller.isNetworkGame = function(){
  return network._gameId !== -1;
};

controller._testHoster = function(  ){
  network._target = "http://localhost:8080";

  var xmlHttp = new XMLHttpRequest();

  xmlHttp.open('GET',
    network._target+"?cmd=createGame",
    true
  );

  xmlHttp.onreadystatechange = function () {

    if( xmlHttp.readyState == 4 ){
      var res = xmlHttp.responseText;
      util.logInfo( "RESPONSE: "+ res );

      var params = {};
      var data = res.split("&");
      for( var i=0,e=data.length; i<e; i++ ){

        var sData = data[i].split("=");
        params[ sData[0] ] = sData[1];
      }

      network._testClient( params.gid );
    }
  };
  xmlHttp.send(null);
};

controller._testClient = function( gameId ){
  network._target = "http://localhost:8080";

  var xmlHttp = new XMLHttpRequest();

  xmlHttp.open('GET',
    network._target+"?cmd=addClient&gameId="+gameId,
    true
  );

  xmlHttp.onreadystatechange = function () {

    if( xmlHttp.readyState == 4 ){
      var res = xmlHttp.responseText;
      util.logInfo( "RESPONSE: "+ res );

      var params = {};
      var data = res.split("&");
      for( var i=0,e=data.length; i<e; i++ ){

        var sData = data[i].split("=");
        params[ sData[0] ] = sData[1];
      }

      network._gameId = gameId;
      network._clientId = params.uid;

      network._startTimer();
    }
  };
  xmlHttp.send(null);
};

controller._startTimer = function(){

  function look(){

    if( network.connected() ){

      var target = network._target+"?cmd=getCmds&gameId="+network._gameId+
        "&userId="+network._clientId;

      util.logInfo( "REQUEST ==> "+ target );

      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open('GET',
        target,
        true
      );
      //xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=encoding');
      xmlHttp.onreadystatechange = function () {

        if( xmlHttp.readyState == 4 ){
          var res = xmlHttp.responseText;

          if( res !== "" ){

            var data = res.split("_&_");
            util.logInfo( "RESPONSE COMMANDS ==> "+ data );

            for( var i=0,e=data.length; i<e; i++ ){

              if( data[i] !== undefined && data[i].length > 0 ) network._incomingMessage( data[i] );
            }

          }

          setTimeout( look, 5000 );
        }
      };
      xmlHttp.send(null);
    }
  }

  look();
};

 */
