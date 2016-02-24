cwt.test_synchron("state-machine", "adding states", function() {
  var state_context;

  state_context = cwt.gamestate_create_context();

  cwt.gamestate_add_state(state_context, "a", {});
  cwt.gamestate_add_state(state_context, "b", {});

  cwt.assert_fails(function() {
    cwt.gamestate_add_state(state_context, "b", {});
  }, "cannot add state b twice");

  cwt.assert_fails(function() {
    cwt.gamestate_add_state(state_context, null, {});
  }, "cannot null state");

  cwt.assert_fails(function() {
    cwt.gamestate_add_state(state_context, "d", null);
  }, "cannot state without description");
});