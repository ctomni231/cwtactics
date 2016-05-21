const produceControllerInstance = function(loop) {
  cwt.produceLoggerContext("UI");

  const realInput = cwt.produceInputHandler();
  const fakeInput = cwt.produceFakeInputHandler();

  const eventHandler = cwt.produceEventHandler();

  const states = cwt.produceGamestates(eventHandler);
  const statemachine = cwt.produceStateMachine(eventHandler, states);

  const gameMsgPush = cwt.connectMessagePusher("GAME");

  const sharedEvents = [];

  eventHandler.subscribe("*", function(key) {
    // shift controller events inside model
    if (key.startsWith("game:")) {
      sharedEvents.push([].slice.call(arguments, 0));
    }
  });

  const eventLog = cwt.produceLogger("ISOLATE-MESSAGES");
  const eventPipe = cwt.produceDataBuffer(function(data) {
    eventLog.info("handle game event " + JSON.stringify(data));
    eventHandler.publish.apply(eventHandler, data);
  });

  cwt.connectMessageHandler("CONTROLLER", (data) => {
    JSON.parse(data).forEach(dataRow => eventPipe.pushData(dataRow));
  });

  cwt.clearLoggerContext();

  var blockInputTimer = 0;
  return cwt.produceGameloop(delta => {
    blockInputTimer -= delta;

    if (sharedEvents.length > 0) {
      gameMsgPush(JSON.stringify(sharedEvents.splice(0)));
    }

    cwt.nTimes(100, () => eventPipe.evaluateData());

    var nextState = statemachine.activeState.update(delta, blockInputTimer <= 0 ? realInput : fakeInput);
    statemachine.activeState.render(delta);
    cwt.optional(nextState).ifPresent(next => {
      blockInputTimer = 250;
      statemachine.setState(next);
    });
  });
};

setTimeout(() => produceControllerInstance().start(), 1000);