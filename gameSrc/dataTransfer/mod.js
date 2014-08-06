"use strict";

var request = require("../xmlHttpReq");

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