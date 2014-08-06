"use strict";

var request = require("../xmlHttpReq");

var cachedMod = null;

exports.transferFromRemote = function (path, callback) {
  request.doRequest({
    path: path,
    json: true,

    success: function (response) {
      callback();
    },

    error: function () {
      throw Error("failed to load mod");
    }
  });
};

exports.transferFromCache = function (callback) {
  callback();
};

exports.getMod = function () {
  return cachedMod;
};

exports.clearCachedMod = function () {
  cachedMod = null;
};