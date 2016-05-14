cwt.test_synchron("core/logger", "active logger will be called by log_[info|warn|error]", function () {
  var call_arguments, LOG_STRING;

  LOG_STRING = "hello";

  cwt.log_active_logger = function (message, level) {
    call_arguments = [message, level];
  };

  cwt.log_info(LOG_STRING);
  cwt.assert_array_equals(call_arguments, [LOG_STRING, cwt.log_LEVEL_INFO]);

  cwt.log_warn(LOG_STRING);
  cwt.assert_array_equals(call_arguments, [LOG_STRING, cwt.log_LEVEL_WARN]);

  cwt.log_error(LOG_STRING);
  cwt.assert_array_equals(call_arguments, [LOG_STRING, cwt.log_LEVEL_ERROR]);
});
