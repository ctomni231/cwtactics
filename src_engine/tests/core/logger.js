cwt.test_synchron("core/logger", "active logger will be called by log_[info|warn|error]", function () {
  var call_arguments;

  cwt.log_active_logger = function (message, level) {
    call_arguments = [message, level];
  };

  cwt.log_info("Hello");
  cwt.assert_array_equals(call_arguments, ["Hello", cwt.log_LEVEL_INFO]);

  cwt.log_warn("Hello");
  cwt.assert_array_equals(call_arguments, ["Hello", cwt.log_LEVEL_WARN]);

  cwt.log_error("Hello");
  cwt.assert_array_equals(call_arguments, ["Hello", cwt.log_LEVEL_ERROR]);
});
