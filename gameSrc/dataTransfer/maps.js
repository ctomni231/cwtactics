var constants = require("../constants");
var storage = require("../storage");

var mapNames = [];

//
//
exports.transferAllFromRemote = function(callback) {
  var stuff = [];

  Object.keys(cwt.mapList).forEach(function(key) {
    stuff.push(function(next) {
      grabRemoteFile({
        path: constants.MOD_PATH + mapNames[key],
        json: true,

        error: function(msg) {
          throw Error("could not load map");
        },

        success: function(resp) {
          storage.set(key, resp, function() {
            next();
          });
        }
      });
    });
  });

  callAsSequence(stuff, function() {
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