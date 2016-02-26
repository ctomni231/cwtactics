var active_state = null;
var states = {};

function is_state(id) {
  return states.hasOwnProperty(id);
}

function get_state(id) {
  cwt.assert_true(is_state(ctx, id));
  return states[id];
}

function empty_function() {}

cwt.game_state_get_active_state_id = function() {
  return active_state;
};

cwt.game_state_add_state = function(id, state_object) {
  cwt.assert_true(!is_state(id));

  function function_or_empty(fn) {
    return fn ? cwt.require_function(fn) : empty_function;
  }

  states[id] = {
    update: function_or_empty(state_object.update),
    render: function_or_empty(state_object.render),
    on_enter: function_or_empty(state_object.on_enter),
    on_exit: function_or_empty(state_object.on_exit)
  };

  if (cwt.type_is_function(state_object.init)) {
    state_object.init.apply(states[id], []);
  }
};

cwt.game_state_update_state = function(delta) {
  states[active_state].update(delta);
};

cwt.game_state_render_state = function(delta) {
  states[active_state].render(delta);
};

cwt.game_state_set_state = function(id) {
  cwt.assert_true(is_state(id), id + " is not a valid state");

  active_state && states[active_state].on_exit();
  active_state = id;
  states[active_state].on_enter();
};