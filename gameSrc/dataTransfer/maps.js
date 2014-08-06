var constants = require("../constants");
var storage = require("../storage");
var async = require("../async");

var mapNames = [];

//
//
exports.transferAllFromRemote = function(callback) {
  var mapList = require("../dataTransfer/mod").getMod().maps;

  var stuff = [];

  Object.keys(mapList).forEach(function(key) {
    stuff.push(function(next) {
      grabRemoteFile({
        path: constants.MOD_PATH + mapNames[key],
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
  });

  async.sequence(stuff, function() {
    callback();
  });
};

//
//
exports.transferFromStorage = function(path, callback) {
  storage.get(path, function(obj) {
    callback(path, obj.value);
  });
};