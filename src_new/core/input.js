var keys = {};
var pressed_keys = {};
var pressed_actions = {};

cwt.input_map_key_to_action = function(key, action) {
  keys[cwt.require_string(key)] = cwt.require_string(action);
};

cwt.input_press_key = function(key) {
  DEBUG && cwt.log_info("[INPUT] pressed key " + key);

  var mapping = keys[key];
  if (mapping) {
    pressed_actions[mapping] += 1;

    DEBUG && pressed_actions[mapping] == 1 && cwt.log_info("[INPUT] pressed action " + mapping);
  }
  pressed_keys[key] = true;
};

cwt.input_release_key = function(key) {
  DEBUG && cwt.log_info("[INPUT] released key " + key);

  var mapping = keys[key];
  if (mapping) {
    pressed_actions[mapping] -= 1;
    cwt.assert_true(pressed_actions[mapping] >= 0, "negative action input counter detected");

    DEBUG && pressed_actions[mapping] == 0 && cwt.log_info("[INPUT] released action " + mapping);
  }

  pressed_keys[key] = false;
};

cwt.input_is_key_pressed = function(key) {
  return pressed_keys[key];
};

cwt.input_is_action_pressed = function(action) {
  return pressed_actions[action] > 0;
};