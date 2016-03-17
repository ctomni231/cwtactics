var keys = {};
var pressed_keys = {};
var pressed_actions = {};

var input_block = 0;

cwt.input_place_blocker = function(time) {
  input_block = time || 250;
};

cwt.input_decrease_block_timer = function(delta) {
  input_block = Math.max(input_block - delta, 0);
};

cwt.input_map_key_to_action = function(key, action) {
  keys[cwt.require_string(key)] = cwt.require_string(action);
};

cwt.input_press_key = function(key) {
  if (pressed_keys[key]) {
    // ignore this event because the key is already pressed
    return;
  }

  if (DEBUG) cwt.log_info("[INPUT] pressed key " + key);

  var mapping = keys[key];
  if (mapping) {
    pressed_actions[mapping] += 1;

    if (DEBUG && pressed_actions[mapping] == 1) {
      cwt.log_info("[INPUT] pressed action " + mapping);
    }
  }
  pressed_keys[key] = true;
};

cwt.input_release_key = function(key) {
  if (DEBUG) cwt.log_info("[INPUT] released key " + key);

  var mapping = keys[key];
  if (mapping) {
    pressed_actions[mapping] -= 1;
    cwt.assert_true(pressed_actions[mapping] >= 0, "negative action input counter detected");

    if (DEBUG && pressed_actions[mapping] === 0) {
      cwt.log_info("[INPUT] released action " + mapping);
    }
  }

  pressed_keys[key] = false;
};

cwt.input_is_key_pressed = function(key) {
  return input_block > 0 ? false : pressed_keys[key];
};

cwt.input_is_action_pressed = function(action) {
  return input_block > 0 ? false : pressed_actions[action] > 0;
};