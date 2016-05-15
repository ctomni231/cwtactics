const produceGameInstance = function(loop) {
  cwt.produceLoggerContext("GAME");

  const eventHandler = cwt.produceEventHandler();

  var unitTypeDB;
  var tileTypeDB;
  var moveTypeDB;
  var weatherTypeDB;

  eventHandler.subscribe("game:loadtype:units", data => unitTypeDB = cwt.produceSheetDB(data, () => true));
  eventHandler.subscribe("game:loadtype:tiles", data => tileTypeDB = cwt.produceSheetDB(data, cwt.produceTiletypeNormalizer()));
  eventHandler.subscribe("game:loadtype:movetypes", data => moveTypeDB = cwt.produceSheetDB(data, () => true));
  eventHandler.subscribe("game:loadtype:weathers", data => weatherTypeDB = cwt.produceSheetDB(data, () => true));

  eventHandler.subscribe("game:construct", () => {
    if (!unitTypeDB || !tileTypeDB || !moveTypeDB || !weatherTypeDB) {
      cwt.raiseError("CannotConstructGameWithoutDataTypes");
    }

    // ??? ==> OPTIONAL
    const typeDB = cwt.produceTypeDB(unitTypeDB, tileTypeDB, moveTypeDB, weatherTypeDB);
    const model = cwt.produceModel(eventHandler);
    //         OPTIONAL <== ???

    const turn = cwt.produceTurn(eventHandler, null /* players */ );
    const units = cwt.produceUnitData();
    const unitFactory = cwt.produceUnitFactory(units);
    const unitHandler = cwt.produceUnitHandler(eventHandler, units);
    const map = cwt.produceMapData();
    const mapChanger = cwt.produceMapChanger(map, eventHandler, tileTypeDB);
    const playerData = cwt.producePlayerData();
    const playerChanger = cwt.producePlayerChanger(playerData);

    const mapLoader = cwt.produceMapLoader(eventHandler, unitFactory, mapChanger, playerChanger, turn);

    eventHandler.subscribe("client:map:load", data => mapLoader.loadMap(data));
  });

  const controllerMsgPush = cwt.connectMessagePusher("CONTROLLER");

  const eventLog = cwt.produceLogger("ISOLATE-MESSAGES");

  eventHandler.subscribe("*", function(key) {
    // shift model events outside
    if (!key.startsWith("game:")) {
      controllerMsgPush(JSON.stringify([].slice.call(arguments, 0)));
    }
  });

  cwt.connectMessageHandler("GAME", (data) => {
    eventLog.info("handle game event " + cwt.stringWithLimitedLength(data, 100));
    eventHandler.publish.apply(eventHandler, JSON.parse(data));
  });

  cwt.clearLoggerContext();
};

// starts the game isolate
produceGameInstance();