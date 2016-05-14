var stateMachine = {
  setState(id) {
    this.activeState.exit();
    this.activeState = this.states[id];
    this.activeState.enter();
    this.logger.info("entered state " + id);
    this.events.publish("state:entered:" + id);
  }
};

cwt.produceStateMachine = function(eventHandler, states) {
  return Object.assign(Object.create(stateMachine), {
    states: states,
    events: eventHandler,
    logger: cwt.produceLogger("STATEMACHINE"),
    activeState: states[Object.keys(states)[0]]
  });
};