const optional = require("./optional").optional;
const log = require("./log").log;

const givenArguments = process.argv;

var parameterAnalyer = {

  flag: function(name, def, allowed) {
    return optional(givenArguments.find(value => value === "-" + name)).orElse(def);
  },

  value: function(name, def, allowed) {
    var value = optional(givenArguments.find(value => value.startsWith("-" + name))).orElse(name + "=" + def);
    if (value.indexOf("=") === -1) {
      throw new Error("IllegalPattern, must be -KEY=VALUE " + value);
    }
    value = value.split("=")[1];
    if (allowed.indexOf(value) === -1) {
      throw new Error("IllegalValue, must be one of " + JSON.stringify(allowed));
    }
    return value;
  }
};

exports.analyeParameter = function(name, type, def, allowed) {
  try {
    return parameterAnalyer[type](name, def, allowed);
  } catch (e) {
    log("illegal value for parameter " + name + " => " + e.message);
    throw e;
  }
};