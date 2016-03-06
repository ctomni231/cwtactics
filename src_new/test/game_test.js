cwt.test_setup();

cwt.test_wait_for("game_event_entered_state", 10, ["start_game"]);
cwt.test_wait_for("game_event_entered_state", 10, ["loading_state"]);
cwt.test_wait(5000);
cwt.test_press_key("KEY_ENTER");
cwt.test_wait_for("game_event_entered_state", 10, ["main_menu"]);

cwt.test_start();