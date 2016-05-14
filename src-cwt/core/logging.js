var consoleLog = {

  LEVEL: {
    INFO: [" FINE", "color: green;"],
    WARN: [" WARN", "color: orange;"],
    ERROR: ["ERROR", "color: red;"]
  },

  _message(level, msg) {
    return "%c[" + this.LEVEL[level][0] + "][" + this.loggerName + "] " + msg;
  },

  _style(level) {
    return this.LEVEL[level][1];
  },

  info(msg) {
    console.log(this._message("INFO", msg), this._style("INFO"));
  },

  warn(msg) {
    console.log(this._message("WARN", msg), this._style("WARN"));
  },

  error(error, msg = "Unexpected error") {
    console.log(this._message("ERROR", msg), this._style("ERROR"));
    console.error(error);
  }
};

var nullLog = {
  info() {},
  warn() {},
  error() {}
};

var loggerContext = "";

cwt.produceLoggerContext = function(name = "") {
  loggerContext = ("     " + name).slice(-5) + "][";
};

cwt.clearLoggerContext = function() {
  loggerContext = "";
};

/**
  @return {
    
    info(string) 
      logs an info message
    
    warn(string)
      logs a warning message
    
    error(string, Error)
      logs an error
  }
*/
cwt.produceLogger = function(name = "CWT") {
  return Object.assign(Object.create(consoleLog), {
    loggerName: loggerContext + (("                    " + name).slice(-20))
  });
};