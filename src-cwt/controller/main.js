cwt.produceControllerInstance = function(loop) {
  cwt.produceLoggerContext("UI");

  const realInput = cwt.produceInputHandler();
  const fakeInput = cwt.produceFakeInputHandler();

  const eventHandler = cwt.produceEventHandler();

  const states = cwt.produceGamestates(eventHandler);
  const statemachine = cwt.produceStateMachine(eventHandler, states);

  const gameMsgPush = cwt.connectMessagePusher("GAME");

  eventHandler.subscribe("*", function(key) {
    // shift controller events inside model
    if (key.startsWith("game:")) {
      gameMsgPush(JSON.stringify([].slice.call(arguments, 0)));
    }
  });

  const eventLog = cwt.produceLogger("ISOLATE-MESSAGES");
  const eventPipe = cwt.produceDataBuffer(function(data) {
    eventLog.info("handle game event " + JSON.stringify(data));
    eventHandler.publish.apply(eventHandler, data);
  });

  cwt.connectMessageHandler("CONTROLLER", (data) => eventPipe.pushData(JSON.parse(data)));
 
  cwt.clearLoggerContext();

  var blockInputTimer = 0;
  return cwt.produceGameloop(delta => {
    blockInputTimer -= delta;

    eventPipe.evaluateData();

    var nextState = statemachine.activeState.update(delta, blockInputTimer <= 0 ? realInput : fakeInput);
    statemachine.activeState.render(delta);
    cwt.optional(nextState).ifPresent(next => {
      blockInputTimer = 250;
      statemachine.setState(next);
    });
  });
};