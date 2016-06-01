const produceGameInstance = function(loop) {
  cwt.produceLoggerContext("GAME");

  const eventHandler = cwt.produceEventHandler();

  var unitTypeDB;
  var tileTypeDB;
  var moveTypeDB;
  var weatherTypeDB;

  // DOING: load data into type
  //          -> check type
  //          -> may throw invalid type event
  eventHandler.subscribe("game:loadtype:units", data => unitTypeDB = cwt.produceSheetDB(data, data => data));
  eventHandler.subscribe("game:loadtype:tiles", data => tileTypeDB = cwt.produceSheetDB(data, cwt.produceTileType));
  eventHandler.subscribe("game:loadtype:movetypes", data => moveTypeDB = cwt.produceSheetDB(data, cwt.produceMoveType));
  eventHandler.subscribe("game:loadtype:weathers", data => weatherTypeDB = cwt.produceSheetDB(data, data => data));

  eventHandler.subscribe("game:construct", () => {
    if (!unitTypeDB || !tileTypeDB || !moveTypeDB || !weatherTypeDB) {
      cwt.raiseError("CannotConstructGameWithoutDataTypes");
    }

    const turn = cwt.produceTurn(eventHandler, null /* players */ );
    const units = cwt.produceUnitData();
    const unitFactory = cwt.produceUnitFactory(eventHandler, units);
    const unitHandler = cwt.produceUnitHandler(eventHandler, units);
    const map = cwt.produceMapStruct();
    const mapChanger = cwt.produceMapChanger(map, eventHandler, tileTypeDB);
    const playerData = cwt.producePlayerData();
    const playerChanger = cwt.producePlayerChanger(playerData);

    const mapLoader = cwt.produceMapLoader(eventHandler, unitFactory, mapChanger, playerChanger, turn);

    eventHandler.subscribe("game:map:load", data => mapLoader.loadMap(data));

    const model = {
      turn
    };
    
    eventHandler.subscribe("game:oal:post", cwt.produceModelOalPusher(model));

    const grabber = cwt.produceModelOalGrabber(model);
    eventHandler.subscribe("game:oal:request", (x, y) => {
      eventHandler.publish("client:oal:response", grabber(x, y));
    });

  });

  const controllerMsgPush = cwt.connectMessagePusher("CONTROLLER");

  const eventLog = cwt.produceLogger("ISOLATE-MESSAGES");

  const sharedEvents = [];

  eventHandler.subscribe("*", function(key, p1, p2, p3, p4, p5) {
    if (!key.startsWith("game:")) {
      sharedEvents.push([key, p1, p2, p3, p4, p5]);
    }
  });

  cwt.connectMessageHandler("GAME", (data) => {
    JSON.parse(data)
      .forEach(eventData => {
        eventLog.info("handle game event " + cwt.stringWithLimitedLength(eventData, 100));
        eventHandler.publish.apply(eventHandler, eventData);
      });
  });

  cwt.clearLoggerContext();

  cwt.produceGameloop(delta => {
    if (sharedEvents.length > 0) {
      controllerMsgPush(JSON.stringify(sharedEvents.splice(0)));
    }
  }).start();
};

// starts the game isolate
produceGameInstance();