var constants = require("../constants");
var modDTO = require("../dataTransfer/mod");

exports.loader = function (next, hasCachedData) {
  if (constants.DEBUG) {
    console.log("loading modification");
  }

  if (!hasCachedData) {
    modDTO.transferFromRemote(constants.DEFAULT_MOD_PATH, next);
  } else {
    modDTO.transferFromCache(next);
  }
};