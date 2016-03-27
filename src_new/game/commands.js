var command_buffer = [];
var prio_command_buffer = [];
var command_handlers = {};

function key_to_hash(value) {
  var hash = 0;

  if (value.length === 0) {
    return hash;
  }

  for (var i = 0; i < value.length; i += 1) {
    var c = value.charCodeAt(i);
    hash = ((hash << 5) - hash) + c;
    hash = hash & hash;
  }

  return hash;
}

cwt.commands_push_command = function(command_key, p1, p2, p3, p4, p5) {
  command_buffer.push([key_to_hash(command_key), p1, p2, p3, p4, p5]);
};

cwt.commands_push_prioritized_command = function(command_key, p1, p2, p3, p4, p5) {
  prio_command_buffer.push([key_to_hash(command_key), p1, p2, p3, p4, p5]);
};

cwt.commands_evaluate_next = function() {
  var first_command, handler;

  if (prio_command_buffer.length > 0) {
    first_command = prio_command_buffer[0];
    prio_command_buffer.splice(0, 1);
  } else {
    first_command = command_buffer[0];
    command_buffer.splice(0, 1);
  }

  handler = cwt.require_something(command_handlers[first_command[0] + ""]);
  handler(first_command[1], first_command[2], first_command[3], first_command[4], first_command[5]);
};

cwt.commands_has_buffered_commands = function() {
  return prio_command_buffer.length > 0 || command_buffer.length > 0;
};

cwt.commands_register_key_handler = function(command_key, handler) {
  command_handlers["" + key_to_hash(command_key)] = handler;
};