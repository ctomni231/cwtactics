require('../loading').addHandler(function (next) {
  if (require("../constants").DEBUG) {
    console.log("checking system");
  }

  // ask question when system is not supported
  if (require("../systemFeatures").supported || confirm("Your system isn't supported by CW:T. Try to run it?") ) {
    next();
  }
});