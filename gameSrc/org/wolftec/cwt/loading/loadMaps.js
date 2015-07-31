var constants = require("../constants");
var mapDTO = require("../dataTransfer/maps");

exports.loader = function (next, hasCachedData) {
  if (constants.DEBUG) {
    console.log("loading maps");
  }

  if (!hasCachedData) {
    mapDTO.transferAllFromRemote(next);
  } else {
    mapDTO.transferAllFromStorage(next);
  }
};