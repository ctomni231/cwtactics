cwt.produceStateMachine = function(events, states) {
  var activeState = states[Object.keys(states)[0]];
  const logger = cwt.produceLogger("STATEMACHINE");

  return {
    update(delta, input) {
      return activeState.update(delta, input);
    },

    render(delta) {
      activeState.render(delta);
    },

    setState(id) {
      activeState.exit();
      activeState = states[id];
      activeState.enter();
      logger.info("entered state " + id);
      events.publish("state:entered:" + id);
    }
  };
};