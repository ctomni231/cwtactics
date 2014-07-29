require('../loading').addHandler(function (loaderNext) {
   if (cwt.DEBUG) {
     console.log("loading image data");
   }

   if (cwt.Loading.hasCachedData) {
     cwt.Image.grabFromCache(loaderNext);
   } else {
     cwt.Image.grabFromRemote(function () {
       cwt.Image.persistImages(loaderNext);
     });
   }
});