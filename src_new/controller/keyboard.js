var KEY_MAP = {
  "38": "KEY_UP",
  "40": "KEY_DOWN",
  "37": "KEY_LEFT",
  "39": "KEY_RIGHT",
  "13": "KEY_ENTER",
  "8": "KEY_BACKSPACE"
};

document.onkeydown = function(event) {
  var key = KEY_MAP[event.keyCode];
  if (cwt.type_is_something(key)) {
    cwt.input_press_key(key);
  }
};

document.onkeyup = function(event) {
  var key = KEY_MAP[event.keyCode];
  if (cwt.type_is_something(key)) {
    cwt.input_release_key(key);
  }
};