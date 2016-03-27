/*global DEBUG, console*/

var HEADER_INFO = "%c[FINE ] ";
var HEADER_WARN = "%c[WARN ] ";
var HEADER_ERROR = "%c[ERROR] ";
var HEADER_STYLE = "%c";

var STYLE_INFO = "color: green;";
var STYLE_WARN = "color: orange;";
var STYLE_ERROR = "color: red;";

cwt.log_LEVEL_INFO = 1;
cwt.log_LEVEL_WARN = 2;
cwt.log_LEVEL_ERROR = 3;
cwt.log_LEVEL_STYLED = 4;

cwt.log_console_logger = function(message, log_level, arg) {
  switch (log_level || cwt.log_LEVEL_INFO) {

    case cwt.log_LEVEL_STYLED:
      console.info(HEADER_STYLE + message, arg);
      break;

    case cwt.log_LEVEL_INFO:
      console.info(HEADER_INFO + message, STYLE_INFO);
      break;

    case cwt.log_LEVEL_WARN:
      console.warn(HEADER_WARN + message, STYLE_WARN);
      break;

    case cwt.log_LEVEL_ERROR:
      console.warn(HEADER_ERROR + message, STYLE_ERROR);
      console.error(arg);
      break;
  }
};

cwt.log_null_logger = function(message, log_level, arg) {
  // null logger ignores logging messages
};

cwt.log_active_logger = (DEBUG ? cwt.log_console_logger : cwt.log_null_logger);

cwt.log_styled = function(style, message) {
  cwt.log_active_logger(message, cwt.log_LEVEL_STYLED, style);
};

cwt.log_info = function(message) {
  cwt.log_active_logger(message, cwt.log_LEVEL_INFO, null);
};

cwt.log_warn = function(message) {
  cwt.log_active_logger(message, cwt.log_LEVEL_WARN, null);
};

cwt.log_error = function(message, error) {
  cwt.log_active_logger(message, cwt.log_LEVEL_ERROR, error);
};

class LoggerFactory {

  static create() {
    if (!LoggerFactory.LOG) {
      LoggerFactory.LOG = new LegacyLogger();
    }
    return LoggerFactory.LOG;
  }
}

class Logger {
  info(msg) {

  }
  warn(msg) {

  }
  error(msg, error) {

  }
}

class LegacyLogger extends Logger {
  info(msg) {
    cwt.log_info(msg);
  }
  warn(msg) {
    cwt.log_warn(msg);
  }
  error(msg, error) {
    cwt.log_error(msg);
  }
}
