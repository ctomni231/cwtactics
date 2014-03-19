cwt.Loading.create(function (next) {

  // ask question when system is not supported
  if (cwt.ClientFeatures.supported || confirm("Your system isn't supported by CW:T. Try to run it?") ) {
    next();
  }
});