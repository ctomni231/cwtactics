"use strict";

var request = require("../system/xmlHttpReq");
var storage = require("../storage");

var cachedMod = null;

exports.transferFromRemote = function (path, callback) {
  request.doRequest({
    path: path,
    json: true,

    success: function (response) {
      cachedMod = response;   
			storage.set("__modification__",response,callback);
    },

    error: function () {
      throw Error("failed to load mod");
    }
  });
};

exports.transferFromCache = function (callback) {
	storage.get("__modification__",function (value) {
    cachedMod = value;   
		callback();	
	});
};

exports.getMod = function () {
  return cachedMod;
};

exports.clearCachedMod = function () {
  cachedMod = null;
};