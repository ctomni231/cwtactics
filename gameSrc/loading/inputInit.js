var inpMapping = require("../dataTransfer/keyMapping");
var constants = require("../constants");
var loading = require('../loading');

loading.addHandler(function (next) {
  if (constants.DEBUG) console.log("initializing input system");
  inpMapping.load(next);
});