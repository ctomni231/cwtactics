var CONFIRM_MSG = "Your system isn't supported by CW:T. Try to run it?";

exports.loader = function (next) {
  if (require("../constants").DEBUG) {
    console.log("checking system");
  }

  // ask question when system is not supported
  if (require("../systemFeatures").supported || confirm(CONFIRM_MSG) ) {
    next();
  }
};