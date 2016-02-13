cwt.Logger = {

  info: function () {},

  warn: function () {},

  error: function () {}
};

cwt.log_LEVEL_INFO = 1;
cwt.log_LEVEL_WARN = 2;
cwt.log_LEVEL_ERROR = 3;

cwt.log_console = function (message, log_level) {
  switch (log_level || cwt.log_LEVEL_INFO) {
    case cwt.log_LEVEL_INFO:
      console.info(message);
      break;

    case cwt.log_LEVEL_WARN:
      console.warn(message);
      break;

    case cwt.log_LEVEL_ERROR:
      console.error(message);
      break;
  }
};

cwt.log_null_log = function (message, log_level) {
  // null logger ignores logging messages
};

cwt.log_active_logger = cwt.log_null_log;

cwt.log_info = function (message) {
  cwt.log_active_logger(message, cwt.log_LEVEL_INFO);
};

cwt.log_warn = function (message) {
  cwt.log_active_logger(message, cwt.log_LEVEL_WARN);
};

cwt.log_error = function (message) {
  cwt.log_active_logger(message, cwt.log_LEVEL_ERROR);
};
