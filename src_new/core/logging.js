/*global DEBUG, console*/

var HEADER_INFO = "[FINE ] ";
var HEADER_WARN = "[WARN ] ";
var HEADER_ERROR = "[ERROR] ";

cwt.log_LEVEL_INFO = 1;
cwt.log_LEVEL_WARN = 2;
cwt.log_LEVEL_ERROR = 3;

cwt.log_console_logger = function(message, log_level, arg) {
  switch (log_level || cwt.log_LEVEL_INFO) {
    case cwt.log_LEVEL_INFO:
      console.info(HEADER_INFO + message);
      break;

    case cwt.log_LEVEL_WARN:
      console.warn(HEADER_WARN + message);
      break;

    case cwt.log_LEVEL_ERROR:
      console.warn(HEADER_ERROR + message);
      console.error(arg);
      break;
  }
};

cwt.log_null_logger = function(message, log_level, arg) {
  // null logger ignores logging messages
};

cwt.log_active_logger = (DEBUG ? cwt.log_console_logger : cwt.log_null_logger);

/**
 *
 * @param {string} message message that will be logged
 */
cwt.log_info = function(message) {
  cwt.log_active_logger(message, cwt.log_LEVEL_INFO, null);
};

/**
 *
 * @param {string} message message that will be logged
 */
cwt.log_warn = function(message) {
  cwt.log_active_logger(message, cwt.log_LEVEL_WARN, null);
};

/**
 *
 * @param {string} message message that will be logged
 */
cwt.log_error = function(message, error) {
  cwt.log_active_logger(message, cwt.log_LEVEL_ERROR, error);
};