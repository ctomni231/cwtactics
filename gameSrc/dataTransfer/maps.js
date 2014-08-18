var constants = require("../constants");
var request = require("../system/xmlHttpReq");
var storage = require("../storage");
var async = require("../system/async");

exports.maps = [];

exports.transferAllFromStorage = function(callback) { 
	storage.get("__mapList__",function(value) {
		exports.maps = value;
		callback();
	});
};

//
//
exports.transferAllFromRemote = function(callback) {
  var mapList = require("../dataTransfer/mod").getMod().maps;
	var maps = Object.keys(mapList);
	
  var stuff = [function (next) {
  	storage.set("__mapList__",maps,next);
  }];

  maps.forEach(function(key) {
   
    stuff.push(function(next) {
      request.doRequest({
        path: constants.MOD_PATH + mapList[key],
        json: true,

        error: function(msg) {
          require("../error").raiseError("could not load map -> "+msg,"");
        },

        success: function(resp) {
          storage.set(key, resp, function() {
            next();
          });
        }
      });
    });
    
	  stuff.push(function(next) {
	  	exports.maps.push(key);
	  	next(); 
	  });
    
  });

  async.sequence(stuff, function() {
    callback();
  });
};

//
//
exports.transferFromStorage = function(path, callback) {
  storage.get(path, function(value) {
    callback(path, value);
  });
};