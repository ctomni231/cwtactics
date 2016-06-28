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

/** @signature (Int ?= 0, Int ?= 10) -> Int */
cwt.random = (from = 0, to = 10) => {
  const randomValue = from + parseInt(Math.random() * to, 10);
  return {

    /** @signature (Int -> b) -> maybe b */
    map: f => cwt.maybe(f(randomValue)),

    /** @signature (a -> M b) -> M b */
    bind: f => f(randomValue),

    /** @signature -> Int */
    get: () => randomValue
  };
};

cwt.either = {

  // (a) -> left String | right a (same as either String, a)
  fromNullable: value => value === null || value === undefined ?
    cwt.left("ValueIsNotDefined") : cwt.right(value),

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
    bind: f => this,
    fold: (leftHandle, rightHandle) => leftHandle(value)
  };
};

cwt.right = function(value) {
  return {
    map: f => cwt.right(f(value)),
    bind: f => f(value),
    fold: (leftHandle, rightHandle) => rightHandle(value)
  };
};

// () -> Int
cwt.random = (from, to) => cwt.just(from + parseInt(Math.random() * (to - from), 10));

// a -> just a | nothing
cwt.maybe = (value) => value == null || value == undefined ? nothing : cwt.just(value);

// a -> just a
cwt.just = (value) => ({
  map: (f) => cwt.just(f(value)),
  elseMap(f) {
    return this;
  },
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

const tileTypeBase = cwt.immutable({
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
});

// () -> MapModel
cwt.mapModelFactory = (width, height) => ({
  tiles: cwt.intRange(1, width).map(columnId =>
    cwt.intRange(1, height).map(rowId =>
      cwt.tileModelFactory("PLIN")))
});

// (String) -> TileModel
cwt.tileModelFactory = (type) => ({
  type
});

// (Map) -> TileTypeModel
cwt.tileTypeModelFactory = (data) => cwt.flyweight(tileTypeBase, data);

// (MapModel, Int, Int) -> TileModel
cwt.getMapTile = (mapModel, x, y) => mapModel.tiles[x][y];

// () -> PlayerModel
cwt.playerFactory = () => ({
  name: "Player",
  team: -1,
  money: 0
});

// (playerModel, playerModel) -> Boolean
cwt.areOnSameTeam = (playerA, playerB) => playerA.team === playerB.team;

// ([PlayerModel]) -> Boolean
cwt.thereAreAtLeastTwoOppositeTeams = (players) => players.reduce((result, player) => result =
  (player.team == -1 ? result :
    (result == -1 ? player.team :
      (result != player.team ? -2 : result))), -1) == -2;

// (Int, Int) -> PropertyModel
cwt.propertyModelFactory = (type, points = 20, owner = -1) => ({
  type,
  points,
  owner
});

// (String) -> UnitModel
cwt.unitFactory = (type) => ({
  hp: 99,
  x: 0,
  y: 0,
  type
});

// weather
cwt.baseWeather = cwt.immutable({
  defaultWeather: false,
  minDuration: 1,
  maxDuration: 4
});

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
cwt.weatherModelFactory = (weather, day = 0) => {
  return {
    day,
    weather
  };
};

cwt.getRandomWeatherModel = () =>
  cwt.random(0, weathers.length)
  .map(value => just(weatherModelFactory({}, weathers[value])))
  .get();

/*
let duration = active.minDuration;
    duration += parseInt(Math.random() * (active.maxDuration - duration), 10);
    leftDays = duration;
    */

// (PropertyModel, UnitModel) -> PropertyModel
cwt.captureProperty = (propertyModel, capturerUnitModel) => {
  const points = propertyModel.points - parseInt(capturerUnitModel.hp / 10, 10);
  const captured = points <= 0;
  const owner = captured ? capturerUnitModel.owner : propertyModel.owner;
  // TODO change type
  return cwt.propertyModelFactory(captured ? 20 : points, owner);
};

const baseMoveType = cwt.immutable({});

// (Map String:Int, String) -> Int
cwt.getMoveCosts = (costs, tileType) => cwt
  .maybe(costs[tileType])
  .elseMap(() => costs["*"])
  .elseMap(() => 0)
  .get()

// (Int ?= 0, Int ?= 0) -> turnModel
cwt.turnModelFactory = (day = 0, owner = 0) => ({
  day,
  owner
});

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
  .map(nextOwner => {
    const nextDay = turn.day + (cwt.isDayChangeBetweenOwners(turn.owner, nextOwner) ? 1 : 0);
    return cwt.turnModelFactory(nextDay, nextOwner);
  })
  .get();

// () -> PropertyModel
cwt.propertyFactory = (owner = -1, points = 20) => ({
  owner,
  points
});

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
  turn: cwt.turnModelFactory(data.day, cwt.maybe(data.turnOwner).orElse(0), cwt.maybe(data.gameTime).orElse(0)),
  players: cwt.intRange(1, cwt.MAX_PLAYERS).map(i => cwt.playerFactory()),
  properties: cwt.intRange(1, cwt.MAX_PROPERTIES).map(i => cwt.propertyFactory("CITY")),
  units: cwt.intRange(1, cwt.MAX_UNITS * cwt.MAX_PLAYERS).map(i => cwt.unitFactory("INFT")),
  weather: cwt.weatherModelFactory("WSUN", cwt.maybe(data.weatherLeftDays).orElse(0)),
  limits: cwt.gameLimitFactory(0, data.day)
});

// (MapData) -> GameData
cwt.gameDataByMapFactory = (map) => {

};

// (SaveData) -> GameData
cwt.gameDataBySaveFactory = (save) => {

};

// =========================================================================================================
//                                           GAME ACTIONS 
// =========================================================================================================

/** @signature Map String:(GameModel -> GameModel) */
cwt.actions = {};

cwt.actions.nextTurn = (gameModel) => cwt
  .just(gameModel)
  .map(model => cwt.cloneMap(model, {
    turn: cwt.getNextTurn(model.players, model.turn)
  }))
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

  const testIt = (name, msg, expression) => {
    if (!expression) {
      log("TEST:: " + name + " [" + msg + "] FAILED");
      throw new Error(msg);
    } else {
      log("TEST:: " + name + " [" + msg + "] PASSED");
    }
  };

  testIt("day between", "0 is before 1 and is a day change", cwt.isDayChangeBetweenOwners(1, 0));
  testIt("day between", "0 is not before 0 and is no day change", !cwt.isDayChangeBetweenOwners(0, 0));
  testIt("day between", "1 is not before 0 and is no day change", !cwt.isDayChangeBetweenOwners(0, 1));

  testIt("same team", "active and inactive player not in same team", !cwt.areOnSameTeam({
    team: -1
  }, {
    team: 0
  }));
  testIt("same team", "diff. team numbers means not in same team", !cwt.areOnSameTeam({
    team: 1
  }, {
    team: 0
  }));
  testIt("same team", "same team numbers means in same team", cwt.areOnSameTeam({
    team: 1
  }, {
    team: 1
  }));

  testIt("get move costs", "returns value on direct mapping", cwt.getMoveCosts({
    "KNWN": 5
  }, "KNWN") === 5);
  testIt("get move costs", "returns wildcard on missing value", cwt.getMoveCosts({
    "*": 1
  }, "UKWN") === 1);
  testIt("get move costs", "fallbacks to zero", cwt.getMoveCosts({}, "UKWN") === 0);
}

// =========================================================================================================
//                                              STARTUP
// =========================================================================================================

gameState = cwt.gameModelFactory({
  day: 5,
  turnOwner: 0
});
gameState.players[0].team = 0;
gameState.players[1].team = 1;
gameState.players[2].team = 2;
gameState.players[3].team = -1;

cwt.logIO()
  .putLn("STARTING CustomWarsTactics")
  .putLn("VERSION: " + cwt.VERSION)
  .bind(() => cwt.loop())
  .then(delta => gameState = cwt.cloneMap(gameState, {
    limits: cwt.gameLimitFactory(gameState.limits.elapsedTime + delta, gameState.limits.elapsedTurns)
  }))
  .then(delta => gameState = Math.random() < 0.1 ? cwt.actions.nextTurn(gameState) : gameState)
  .then(delta => {
    gameCanvasCtx.clearRect(0, 0, cwt.CANVAS_WIDTH, cwt.CANVAS_HEIGHT);
    gameCanvasCtx.fillStyle = "white";

    gameCanvasCtx.fillText("DAY = " + gameState.turn.day, 4, 12);
    gameCanvasCtx.fillText("TURNOWNER = " + gameState.turn.owner, 4, 22);

    gameCanvasCtx.fillText("GAME TIME = " + gameState.limits.elapsedTime + "ms", 4, 222);
    gameCanvasCtx.fillText("DELTA = " + delta + "ms", 4, 232);
  });