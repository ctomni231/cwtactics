// CustomWarsTactics Source File
// Why one file? Easier for us and we have no time.. so please do not try to explain "this is an anti pattern!"

// =========================================================================================================
//                                                STUB
// =========================================================================================================

"use strict";

const cwt = {};

cwt.DEBUGMODE = true;

cwt.CANVAS_WIDTH = 320;
cwt.CANVAS_HEIGHT = 240;

cwt.INACTIVE_ID = -1;
cwt.DESELECT_ID = -2;
cwt.ACTIONS_BUFFER_SIZE = 200;
cwt.MAX_PLAYERS = 4;
cwt.MAX_UNITS = 50;
cwt.MAX_MAP_WIDTH = 100;
cwt.MAX_MAP_HEIGHT = 100;
cwt.MAX_PROPERTIES = 300;
cwt.MAX_SELECTION_RANGE = 15;
cwt.MAX_BUFFER_SIZE = 200;
cwt.TILE_LENGTH = 16;

cwt.VERSION = "0.36";
cwt.AI_VERSION = "DumbBoy v. 0.1 Alpha";

// =========================================================================================================
//                                                CORE
// =========================================================================================================

// (Map) -> Map
cwt.immutable = (obj) => Object.freeze(obj);

// (Map, Map ?= {}) -> Map
cwt.flyweight = (prototype, data = {}) => Object.assign(Object.create(prototype), data);

// (Map, Map ?= {}) -> Map
cwt.cloneMap = (source, data = null) =>
  Object.assign(
    Object.keys(source).reduce((obj, key) => {
      obj[key] = source[key];
      return obj;
    }, {}), data);

// (Int, Int) -> [Int]
cwt.intRange = (from, to) => {
  var arr = [];
  for (; from <= to; from++) {
    arr.push(from);
  }
  return arr;
};

// (any) -> boolean
cwt.isInteger = (value) => typeof value === 'number' && value % 1 === 0;

// (any) -> boolean
cwt.isNumber = (value) => typeof value === 'number';

// (any) -> boolean
cwt.isString = (value) => typeof value === 'string';

// (any) -> boolean
cwt.isFunction = (value) => typeof value === 'function';

// (any) -> boolean
cwt.isBoolean = (value) => value === true || value === false;

// (any) -> boolean
cwt.isSomething = (value) => value !== null && value !== undefined;

// (list<any>, (any) -> boolean) -> boolean
cwt.isListOf = (value, valueTypeCheck) => value.every(element => valueTypeCheck(element));

// (map<any>, (any) -> boolean) -> boolean
cwt.isMapOf = (value, valueTypeCheck) => Object.keys(value).every(key => valueTypeCheck(value[key]));

// (Int, (Int, a) -> a', a) -> nothing
cwt.nTimes = (n, fn, argument = cwt.nothing()) => n > 0 ? cwt.nTimes(n - 1, fn, fn(n, argument)) : argument;

// ([a], (a) -> Int) -> Int
cwt.listSumUp = (list, fn) => list.reduce((sum, obj) => sum + fn(obj), 0);

// ([a], Int) -> [a]
cwt.rotate = function(arr, count) {
  arr = arr.map(el => el);
  count = count % arr.length;
  if (count < 0) {
    arr.unshift.apply(arr, arr.splice(count))
  } else {
    arr.push.apply(arr, arr.splice(0, count))
  }
  return arr;
};

/** @signature (Int ?= 0, Int ?= 10) -> just Int */
cwt.random = (from = 0, to = 10) => cwt.just(from + parseInt(Math.random() * to, 10));

cwt.either = {

  // (a) -> left String | right a (same as either String, a)
  fromNullable: value => value === null || value === undefined ?
    cwt.left("ValueIsNotDefined") : cwt.right(value),

  expectTrue: value => value === true ? cwt.left(value) : cwt.right(value),

  // (() -> a) -> left Error | right a (same as either Error, a)
  tryIt: (f) => {
    try {
      return cwt.right(f(value))
    } catch (e) {
      return cwt.left(e)
    }
  }
};

cwt.left = function(value) {
  return {
    map: f => this,
    biMap: (fLeft, fRight) => cwt.left(fLeft(value)),
    bind: f => this,
    fold: (leftHandle, rightHandle) => cwt.just(leftHandle(value))
  };
};

cwt.right = function(value) {
  return {
    map: f => cwt.right(f(value)),
    biMap: (fLeft, fRight) => cwt.right(fRight(value)),
    bind: f => f(value),
    fold: (leftHandle, rightHandle) => cwt.just(rightHandle(value))
  };
};

cwt.validation = (expression) => expression ? cwt.right("PASSED") : cwt.left("FAILED");


// () -> Int
cwt.random = (from, to) => cwt.just(from + parseInt(Math.random() * (to - from), 10));

// a -> just a | nothing
cwt.maybe = (value) => value == null || value == undefined ? nothing : cwt.just(value);

// a -> just a
cwt.just = (value) => ({
  map: (f) => cwt.maybe(f(value)),
  elseMap(f) {
    return this;
  },
  biMap: (fPresent, fNotPresent) => cwt.maybe(fPresent(value)),
  bind: (f) => f(value),
  filter(f) {
    return f(value) ? this : cwt.nothing();
  },
  isPresent: () => true,
  ifPresent: (f) => f(value),
  orElse: (v) => value,
  get: () => value,
  toString: () => "just(" + value + ")"
});

const nothing = cwt.immutable({
  map: (f) => nothing,
  elseMap: (f) => cwt.maybe(f()),
  biMap: (fPresent, fNotPresent) => cwt.maybe(fNotPresent()),
  bind: (f) => nothing,
  filter: (f) => nothing,
  isPresent: () => false,
  ifPresent: (f) => nothing,
  orElse: (v) => v,
  get() {
    throw new Error("Nothing");
  },
  toString: () => "nothing"
});

// -> nothing
cwt.nothing = () => nothing;

// String -> Promise
cwt.jsonIO = (path) => new Promise((resolve, reject) => {
  const request = new XMLHttpRequest();

  request.onreadystatechange = () => {
    if (request.readyState == 4) {
      if (request.status == 200) {
        try {
          resolve(JSON.parse(request.responseText));
        } catch (error) {
          reject("JSONException: " + error);
        }
      } else {
        reject(request.statusText);
      }
    }
  };

  request.open("get", path + (path.indexOf("?") < 0 ? "?" : "&") + (parseInt(Math.random() * 100000, 10)), true);
  request.send();
});

// (String) -> Promise
cwt.cachedJsonIO = (path) => new Promise((resolve, reject) => localforage
  .getItem(path)
  .then(value => {
    if (value == null) {
      cwt.jsonIO(path)
        .then(data => localforage.setItem(path, data))
        .then(data => resolve(data));
    } else {
      resolve(value);
    }
  })
  .catch(function(err) {
    reject(err);
  }));

const _logIO = {
  putLn: (str) => {
    console.log(str);
    return _logIO;
  },

  bind: (fn) => fn()
};

// () -> { putLn }
cwt.logIO = () => _logIO;

// LoopMonad :: () -> LoopMonad Int
cwt.loop = () => {
  var lastTime = (new Date()).getTime();

  const loop = () => {
    const now = (new Date()).getTime();
    const delta = now - lastTime;
    lastTime = now;

    for (var i = mappers.length - 1; i >= 0; i--) {
      mappers[i](delta);
    }

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  const mappers = [];

  const stub = {
    then: (fn) => {
      mappers.push(fn);
      return stub;
    }
  };

  return stub;
};

// =========================================================================================================
//                                                 GAME
// =========================================================================================================

cwt.containsId = (data) => cwt.isString(data.id) && data.id.length === 4;

cwt.tileTypeBase = {
  defense: 0,
  blocksVision: false,
  capturePoints: -1,
  looseAfterCaptured: false,
  changeAfterCaptured: "",
  notTransferable: false,
  funds: 0,
  vision: 0,
  supply: [],
  repairs: [],
  produces: [],
  builds: [],
  rocketsilo: {},
  cannon: {},
  bigProperty: {},
  laser: {},
  blocker: false,
  changeTo: "",
  hp: 0,
  destroyedType: ""
};

// () -> MapModel
cwt.mapModelFactory = (width, height) => ({
  tiles: cwt.intRange(1, width).map(columnId =>
    cwt.intRange(1, height).map(rowId =>
      cwt.tileModelFactory("PLIN")))
});

// (String) -> TileModel
cwt.tileModelFactory = (type) => ({ type });

// (Map) -> TileTypeModel
cwt.tileTypeModelFactory = (data) => cwt.flyweight(tileTypeBase, data);

// (MapModel, Int, Int) -> TileModel
cwt.getMapTile = (mapModel, x, y) => mapModel.tiles[x][y];

// () -> PlayerModel
cwt.playerFactory = (team = -1, money = 0, name = "Player") => ({ name, team, money });

// (playerModel, playerModel) -> Boolean
cwt.areOnSameTeam = (playerA, playerB) => playerA.team === playerB.team;

// ([PlayerModel]) -> Boolean
cwt.thereAreAtLeastTwoOppositeTeams = (players) => players.reduce((result, player) => result =
  (player.team == -1 ? result :
    (result == -1 ? player.team :
      (result != player.team ? -2 : result))), -1) == -2;

// (String) -> UnitModel
cwt.unitFactory = (type, owner = -1) => ({ hp: 99, owner, x: 0, y: 0, type, fuel: 0 });

// weather
cwt.baseWeather = { defaultWeather: false, minDuration: 1, maxDuration: 4 };

// Weather -> Boolean
cwt.isWeather = (weather) => cwt.just(weather)
  .filter(w => cwt.isString(w.id) && w.id.length === 4)
  .filter(w => cwt.isInteger(w.minDuration) && w.minDuration >= 1)
  .filter(w => cwt.isInteger(w.maxDuration) && w.maxDuration >= w.minDuration)
  .filter(w => cwt.isBoolean(w.defaultWeather))
  .isPresent();

// ([Map]) -> (() -> [Weather])
cwt.loadWeathers = (data) => data
  .map(weather => cwt.flyweight(baseWeather, weather))
  .bind(data => data.map(weather => cwt.isWeather(weather) ? cwt.just(weather) : cwt.nothing()))
  .get();

// (Weather, Int) -> WeatherModel
cwt.weatherModelFactory = (weather, day = 0) => ({ day, weather });

cwt.getRandomWeatherModel = () =>
  cwt.random(0, weathers.length)
  .map(value => just(weatherModelFactory({}, weathers[value])))
  .get();

/*
let duration = active.minDuration;
    duration += parseInt(Math.random() * (active.maxDuration - duration), 10);
    leftDays = duration;
    */

/** @signature PropertyTypeModel */
cwt.basePropertyType = {
  capturable: false,
  funds: 0,
  builds: [],
  repairs: []
};

/** @signature Map -> Boolean */
cwt.isPropertyType = (data) => cwt
  .maybe(data)
  .filter(cwt.containsId)
  .filter(data => cwt.isBoolean(data.capturable))
  .filter(data => cwt.isInteger(data.funds) && data.funds >= 0)
  .filter(data => cwt.isListOf(data.builds, cwt.isString))
  .filter(data => cwt.isListOf(data.repairs, cwt.isString))
  .isPresent();

/** @signature (Player, [PropertyModel], {PropertyTypeModel}) -> Int */
cwt.sumUpFunds = (owner, properties, propertyTypes) =>
  cwt.listSumUp(properties, property => property.owner === owner ? propertyTypes[property.type].funds : 0);

/** @signature Map -> maybe PropertyTypeModel */
cwt.propertyTypeFactory = (data) => cwt
  .maybe(data)
  .map(data => cwt.flyweight(cwt.basePropertyType, data))
  .filter(cwt.isPropertyType);

// (Int, Int) -> PropertyModel
cwt.propertyModelFactory = (type, owner = -1, points = 20) => ({ type, points, owner });

// (PropertyModel, UnitModel) -> PropertyModel
cwt.captureProperty = (propertyModel, capturerUnitModel) => {
  const points = propertyModel.points - parseInt(capturerUnitModel.hp / 10, 10);
  const captured = points <= 0;
  const owner = captured ? capturerUnitModel.owner : propertyModel.owner;
  // TODO change type
  return cwt.propertyModelFactory(captured ? 20 : points, owner);
};

// MoveType
const baseMoveType = cwt.immutable({
  range: 0,
  costs: { "*": -1 }
});

// (Map String:Int, String) -> Int
cwt.getMoveCosts = (costs, tileType) => cwt
  .maybe(costs[tileType])
  .elseMap(() => costs["*"])
  .elseMap(() => 0)
  .get();

cwt.getMoveCostsOfType = (moveType, tileType) => cwt.getMoveCosts(moveType.costs, tileType);

// (Int ?= 0, Int ?= 0) -> turnModel
cwt.turnModelFactory = (day = 0, owner = 0) => ({ day, owner });

// ([PlayerModel], TurnModel) -> maybe<Int>
cwt.predictNextTurnOwner = function(players, model) {
  const currentId = model.owner;
  const relativeNextId = cwt.rotate(players, currentId + 1).findIndex(el => el.team >= 0) + 1;
  const absoluteNextId = (relativeNextId + currentId) % players.length;
  return currentId != absoluteNextId ? cwt.just(absoluteNextId) : cwt.nothing();
};

// (Int, Int) -> Boolean
cwt.isDayChangeBetweenOwners = (idA, idB) => idB < idA;

// ([PlayerModel], TurnModel) -> TurnModel
cwt.getNextTurn = (players, turn) => cwt
  .predictNextTurnOwner(players, turn)
  .map(nextOwner => cwt.turnModelFactory(turn.day + (cwt.isDayChangeBetweenOwners(turn.owner, nextOwner) ? 1 : 0), nextOwner))
  .get();

// () -> GameLimitsModel
cwt.gameLimitFactory = (elapsedTime = 0, elapsedTurns = 0) => ({
  elapsedTime,
  elapsedTurns,
  dayLimit: Number.POSITIVE_INFINITY,
  turnTimeLimit: Number.POSITIVE_INFINITY,
  gameTimeLimit: Number.POSITIVE_INFINITY
});

// (GameModel) -> Boolean
cwt.isTurnTimeLimitReached = (gameModel) => gameModel.turnOwner.elapsedTime >= gameModel.limits.turnTimeLimit;

// WRONG
cwt.isGameTimeLimitReached = (gameModel) => gameModel.turnOwner.elapsedTime >= gameModel.limits.gameTimeLimit;

// (GameModel) -> Boolean
cwt.isTurnLimitReached = (gameModel) => gameModel.turnOwner.day >= gameModel.limits.dayLimit;

// (GameData) -> GameModel
cwt.gameModelFactory = (data) => ({
  map: cwt.mapModelFactory(data.width, data.height),
  tileTypes: {},
  turn: cwt.turnModelFactory(data.day, cwt.maybe(data.turnOwner).orElse(0), cwt.maybe(data.gameTime).orElse(0)),
  players: cwt.intRange(1, cwt.MAX_PLAYERS).map(i => cwt.playerFactory()),
  properties: cwt.intRange(1, cwt.MAX_PROPERTIES).map(i => cwt.propertyModelFactory("PFNY", 0)),
  propertyTypes: {},
  units: cwt.intRange(1, cwt.MAX_UNITS * cwt.MAX_PLAYERS).map(i => cwt.unitFactory("INFT", 0)),
  unitTypes: {},
  weather: cwt.weatherModelFactory("WSUN", cwt.maybe(data.weatherLeftDays).orElse(0)),
  weatherTypes: {},
  limits: cwt.gameLimitFactory(0, data.day)
});

// (MapData) -> GameData
cwt.gameDataByMapFactory = (map) => {

};

// (SaveData) -> GameData
cwt.gameDataBySaveFactory = (save) => {

};

// (SaveData) -> GameData
cwt.gameDataForDemoPurposes = () => {
  var model = cwt.gameModelFactory({ width: 20, height: 20, day: 5, turnOwner: 0 });

  model.properties = model.properties.map((property, n) =>
    cwt.cloneMap(property, { x: parseInt(n / 19), y: n % 19 }));

  model.units = model.units.map((unit, n) =>
    cwt.cloneMap(unit, { x: parseInt(n / 19), y: n % 19 }));

  model.players[0].team = 0;
  model.players[1].team = 1;
  model.players[2].team = 2;
  model.players[3].team = -1;

  model.units[1].owner = 1;
  model.properties[1].owner = 1;

  // P2 - but not standing on property
  model.units[2].owner = 1;
  model.units[2].x = 19;
  model.units[2].y = 19;
  model.properties[2].owner = 1;

  // P2 - standing on property but not repairable
  model.units[3].owner = 1;
  model.units[3].type = "NORP";
  model.properties[3].owner = 1;

  model.propertyTypes.PFNY = cwt.propertyTypeFactory({
    id: "PFNY",
    funds: 1000,
    repairs: [
      "INGT", "INBT", "INBH", "INBB", "INBA", "INBC", "INFT"
    ]
  }).get();
  model.propertyTypes.PFNN = cwt.propertyTypeFactory({ id: "PFNY" }).get();

  return model;
};

// =========================================================================================================
//                                           GAME ACTIONS 
// =========================================================================================================

/** @signature Map String:(GameModel -> GameModel) */
cwt.actions = {};

cwt.actions.nextTurn = (gameModel) => cwt
  .just(gameModel)
  .map(model => {

    const turn = cwt.getNextTurn(model.players, model.turn);

    const newFunds = cwt.sumUpFunds(turn.owner, model.properties, model.propertyTypes);

    // give funds
    const players = model.players.map((player, id) =>
      id === turn.owner ? cwt.cloneMap(player, { money: player.money + newFunds }) : player);

    var units = model.units.map(unit => unit.owner != turn.owner ? unit : cwt.cloneMap(unit, { fuel: unit.fuel - 1 }));

    // repair units (!!! critical performance impact !!!)
    units = units.map(unit =>
      unit.owner != turn.owner ? unit :
      cwt.maybe(model.properties.reduce((result, prop) => (
        result == null &&
        unit.x == prop.x &&
        unit.y == prop.y &&
        unit.owner == prop.owner) ? prop : result, null))
      .map((prop) => model.propertyTypes[prop.type].repairs.indexOf(unit.type) !== -1 ? prop : null)
      .biMap(
        () => cwt.cloneMap(unit, { hp: parseInt(Math.random() * 99, 10) }),
        () => unit)
      .get());

    return cwt.cloneMap(model, { turn, players, units });
  })
  .get();

// =========================================================================================================
//                                           GUI (IMPURE)
// =========================================================================================================

const gameCanvas = document.getElementById("gamecanvas");
const gameCanvasCtx = gameCanvas.getContext("2d");

gameCanvas.width = cwt.CANVAS_WIDTH;
gameCanvas.height = cwt.CANVAS_HEIGHT;

// =========================================================================================================
//                                           DATA (IMPURE)
// =========================================================================================================

const log = str => document.getElementById("devOUT").innerHTML += "&nbsp;" + str + "</br>";

var gameState;

// =========================================================================================================
//                                               TEST
// =========================================================================================================

if (cwt.DEBUGMODE) {

  const testIt = (name, msg, expression) => cwt.either.expectTrue(expression)
    .fold(result => "PASSED", result => "FAILED")
    .map(result => "TEST:: " + name + " [" + msg + "] " + result)
    .map(log);

  testIt("day between", "0 is before 1 and is a day change", cwt.isDayChangeBetweenOwners(1, 0));
  testIt("day between", "0 is not before 0 and is no day change", !cwt.isDayChangeBetweenOwners(0, 0));
  testIt("day between", "1 is not before 0 and is no day change", !cwt.isDayChangeBetweenOwners(0, 1));

  testIt("same team", "active and inactive player not in same team", !cwt.areOnSameTeam({ team: -1 }, { team: 0 }));
  testIt("same team", "diff. team numbers means not in same team", !cwt.areOnSameTeam({ team: 1 }, { team: 0 }));
  testIt("same team", "same team numbers means in same team", cwt.areOnSameTeam({ team: 1 }, { team: 1 }));

  testIt("get move costs", "returns value on direct mapping", cwt.getMoveCosts({ "KNWN": 5 }, "KNWN") === 5);
  testIt("get move costs", "returns wildcard on missing value", cwt.getMoveCosts({ "*": 1 }, "UKWN") === 1);
  testIt("get move costs", "fallbacks to zero", cwt.getMoveCosts({}, "UKWN") === 0);

  testIt("is property type", "missing id will be declined", !cwt.propertyTypeFactory({}).isPresent());
  testIt("is property type", "base type + id is valid", cwt.propertyTypeFactory({ id: "TEST" }).isPresent());
}

// =========================================================================================================
//                                              STARTUP
// =========================================================================================================

cwt.logIO()
  .putLn("STARTING CustomWarsTactics")
  .putLn("VERSION: " + cwt.VERSION)
  .bind(() => {
    gameState = cwt.gameDataForDemoPurposes();
    return cwt.loop();
  })
  .then(delta => gameState = cwt.cloneMap(gameState, {
    limits: cwt.gameLimitFactory(gameState.limits.elapsedTime + delta, gameState.limits.elapsedTurns)
  }))
  .then(delta => gameState = Math.random() < 0.05 ? cwt.actions.nextTurn(gameState) : gameState)
  .then(delta => {
    gameCanvasCtx.clearRect(0, 0, cwt.CANVAS_WIDTH, cwt.CANVAS_HEIGHT);
    gameCanvasCtx.fillStyle = "white";
    gameCanvasCtx.font = "9px Arial";

    gameCanvasCtx.fillText("DAY = " + gameState.turn.day, 4, 12);
    gameCanvasCtx.fillText("TURNOWNER = " + gameState.turn.owner, 4, 22);

    gameCanvasCtx.fillText("PLAYER 0 MONEY = " + gameState.players[0].money, 4, 102);
    gameCanvasCtx.fillText("PLAYER 1 MONEY = " + gameState.players[1].money, 4, 112);
    gameCanvasCtx.fillText("PLAYER 2 MONEY = " + gameState.players[2].money, 4, 122);

    gameCanvasCtx.fillText("UNIT 0 (P1) HP = " + gameState.units[0].hp, 4, 172);
    gameCanvasCtx.fillText("FUEL = " + gameState.units[0].fuel, 104, 172);

    gameCanvasCtx.fillText("UNIT 1 (P2) HP = " + gameState.units[1].hp, 4, 182);
    gameCanvasCtx.fillText("UNIT 2 (P2) HP = " + gameState.units[2].hp, 4, 192);
    gameCanvasCtx.fillText("UNIT 3 (P2) HP = " + gameState.units[3].hp, 4, 202);

    gameCanvasCtx.fillText("GAME TIME = " + gameState.limits.elapsedTime + "ms", 4, 222);
    gameCanvasCtx.fillText("DELTA = " + delta + "ms", 4, 232);
  });