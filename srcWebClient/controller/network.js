// Id of the game in the connected network session.
//
controller.network_gameId = null;

// Id of the client in the connected network session.
//
controller.network_clientId = -1;

// The target URL of the network server.
//
controller.network_target = null;

// @Override Interface from networkInterface.js
//
controller.network_isActive = function () {
  return controller.network_gameId !== null;
};

// @Override Interface from networkInterface.js
//
controller.network_isHost = function () {
  return !controller.network_isActive() || controller.network_clientId === 0;
};

// @Override Interface from networkInterface.js
//
controller.network_parseMessage = (function () {

  var parser = function () {
    if (xmlHttp.readyState == 4) {
      var res = xmlHttp.responseText;
      if (res !== "") {
        var data = res.split("_&_");
        for (var i = 0, e = data.length; i < e; i++) {

          if (data[i] !== undefined && data[i].length > 0) network._incomingMessage(data[i]);
        }
      }
    }
  };

  return function () {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open(
      'GET',
      controller.network_target+
      "?cmd=GRABCMD&gameId="+controller.network_gameId+
      "&userId="+controller.network_clientId, 
      true
    );
    xmlHttp.onreadystatechange = parser;
    xmlHttp.send(null);
  };
})();

// @Override Interface from networkInterface.js
//
controller.network_sendMessage = function (obj) {

};