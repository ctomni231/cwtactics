cwt.client_intialize_tester = function() {

  cwt.test_setup();

  // ===========================================

  cwt.test_group("game loading");

  cwt.test_action("wait_for_event", "client_event_entered_state", 10, ["start_game"]);
  cwt.test_action("wait_for_event", "client_event_entered_state", 10, ["loading_state"]);
  cwt.test_action("sleep", 5000);
  cwt.test_action("raise_input", "KEY_ENTER");
  cwt.test_action("wait_for_event", "client_event_entered_state", 10, ["main_menu"]);

  // ===========================================

  cwt.test_group("map loading");

  cwt.test_action("raise_input", "KEY_ENTER");
  cwt.test_action("wait_for_event", "client_event_entered_state", 10, ["load_map"]);

  // ===========================================

  cwt.test_start();
};