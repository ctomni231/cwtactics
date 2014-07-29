var constants = require("../constants");
var loading = require("../loading");
var imageDTO = require("../dataTransfer/image");

loading.addHandler(function (loaderNext) {
   if (constants.DEBUG) console.log("loading image data");

   if (loading.hasCachedData) {
     // grab from local storage
     imageDTO.grabFromCache(loaderNext);

   } else {
     // grab from remote and save all images locally
     imageDTO.grabFromRemote(function () {
       imageDTO.transferAllToStorage(loaderNext);
     });
   }
});