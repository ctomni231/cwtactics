cwt.Loading.create(function (next) {
  if (cwt.DEBUG) {
    console.log("initialize storage system");
  }

  cwt.Storage.initialize(next);
});