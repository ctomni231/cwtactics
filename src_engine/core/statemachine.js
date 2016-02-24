function is_state(ctx, id) {
  return ctx.states.hasOwnProperty(id);
}

function get_state(ctx, id) {
  cwt.assert_true(is_state(ctx, id));
  return ctx.states[id];
}

function empty_function() {}

cwt.gamestate_create_context = function() {
  return {
    active_state: null,
    states: {}
  };
};

cwt.gamestate_get_active_state_id = function() {
  return ctx.active_state;
};

cwt.gamestate_add_state = function(ctx, id, state_object) {
  cwt.assert_true(!is_state(ctx, id));

  function function_or_empty(fn) {
    return fn ? cwt.require_function(fn) : empty_function;
  }

  ctx.states[id] = {
    update: function_or_empty(state_object.update),
    render: function_or_empty(state_object.render),
    on_enter: function_or_empty(state_object.on_enter),
    on_exit: function_or_empty(state_object.on_exit)
  };

  if (cwt.type_is_function(state_object.init)) {
    state_object.init.apply(ctx.states[id], []);
  }
};

cwt.gamestate_update_state = function(ctx, delta, input) {
  input = null; // TODO
  ctx.states[id].update(delta, input);
};

cwt.gamestate_render_state = function(ctx, delta) {
  ctx.states[id].render(delta);
};

cwt.gamestate_set_state = function(ctx, id) {
  ctx.states[ctx.active_state].on_exit();
  ctx.active_state = id;
  ctx.states[ctx.active_state].on_enter();
};