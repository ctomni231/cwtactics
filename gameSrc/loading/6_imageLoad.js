 cwt.Loading.create(function (loaderNext) {
   if (cwt.Loading.hasCachedData) {
     cwt.Image.grabFromCache(loaderNext);
   } else {
     cwt.Image.grabFromRemote(loaderNext);
   }
});