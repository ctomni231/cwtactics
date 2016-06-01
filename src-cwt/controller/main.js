const produceControllerInstance = function(loop) {
  cwt.produceLoggerContext("UI");

  const sharedEvents = [];

  const realInput = cwt.produceInputHandler();
  const fakeInput = cwt.produceFakeInputHandler();
  const eventHandler = cwt.produceEventHandler();
  const states = cwt.produceGamestates(eventHandler);
  const statemachine = cwt.produceStateMachine(eventHandler, states);
  const gameMsgPush = cwt.connectMessagePusher("GAME");
  const eventDataBuffer = cwt.produceDataBuffer(data => eventHandler.publish.apply(null, data));
  const eventLog = cwt.produceLogger("ISOLATE-MESSAGES");
  const oalLog = cwt.produceLogger("OAL");

  eventHandler.subscribe("*", (key, p1, p2, p3, p4, p5) =>
    eventLog.info("handle game event " + key + " with data " + [p1, p2, p3, p4, p5]));

  eventHandler.subscribe("*", (key, p1, p2, p3, p4, p5) => cwt.optional(key)
    .filter(key => key.startsWith("game:"))
    .ifPresent(key => sharedEvents.push([key, p1, p2, p3, p4, p5])));

  eventHandler.subscribe("client:oal:response", dataList => dataList
    .map(entry => "position {" + entry.x + "," + entry.y + "} has actions [" + entry.actions + "]")
    .forEach(entry => oalLog.info(entry)));

  cwt.connectMessageHandler("CONTROLLER", data => JSON.parse(data).forEach(eventDataBuffer.pushData));

  cwt.clearLoggerContext();
  cwt.GLOBAL_EVENT = eventHandler;

  var blockInputTimer = 0;
  return cwt.produceGameloop(delta => {
    blockInputTimer -= delta;

    //sharedEvents.filter(data => !!data).map(JSON.stringify).forEach(data => gameMsgPush(data));
    if (sharedEvents) {
      gameMsgPush(JSON.stringify(sharedEvents));
      sharedEvents.splice(0);
    }
    cwt.nTimes(100, () => eventDataBuffer.evaluateData());

    cwt.optional(statemachine.update(delta, blockInputTimer <= 0 ? realInput : fakeInput))
      .peek(next => blockInputTimer = 250)
      .peek(statemachine.setState);

    statemachine.render(delta);
  });
}

setTimeout(() => produceControllerInstance().start(), 1000);