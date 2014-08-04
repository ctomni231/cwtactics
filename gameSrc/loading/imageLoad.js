var constants = require("../constants");
var imageDTO = require("../dataTransfer/image");

exports.loader = function (loaderNext, hasCachedData) {
   if (constants.DEBUG) console.log("loading image data");

   if (hasCachedData) {
     // grab from local storage
     imageDTO.grabFromCache(loaderNext);

   } else {
     // grab from remote and save all images locally
     imageDTO.grabFromRemote(function () {
       imageDTO.transferAllToStorage(loaderNext);
     });
   }
};