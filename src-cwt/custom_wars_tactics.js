// CustomWarsTactics Source File
// Why one file? Easier for us and we have no time.. so please do not explain "Hey use XYZ..."

// =========================================================================================================
//                                                STUB
// =========================================================================================================

"use strict";

const cwt = {};

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

// () -> Int
cwt.random = (from, to) => cwt.just(from + parseInt(Math.random() * (to - from), 10));

// (a) -> just a | nothing
cwt.maybe = (value) => value == null || value == undefined ? nothing : cwt.just(value);

// (a) -> just a
cwt.just = (value) => ({
  map: (f) => cwt.just(f(value)),
  bind: (f) => f(value),
  filter(f) {
    return f(value) ? this : cwt.nothing();
  },
  isPresent: () => true,
  orElse: (v) => value,
  get: () => value,
  toString: () => "just(" + value + ")"
});

const nothing = cwt.immutable({
  map(f) {
    return this;
  },
  bind(f) {
    return this;
  },
  filter(f) {
    return this;
  },
  isPresent: () => false,
  orElse: (v) => v,
  get() {
    throw new Error("Nothing");
  },
  toString: () => "nothing"
});

// () -> nothing
cwt.nothing = () => nothing;

// (String) -> Promise
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
  var lastTime = 0;

  const loop = () => {
    const now = (new Date()).getTime();
    const delta = now - lastTime;
    lastTime = now;

    var data = delta;
    for (var i = mappers.length - 1; i >= 0; i--) {
      data = mappers[i](data);
    }

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  const mappers = [];

  const stub = {
    bind: (fn) => {
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
cwt.propertyModelFactory = (points = 20, owner = -1) => ({
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

// weather -> boolean
cwt.isWeather = (weather) => cwt.just(weather)
  .filter(w => cwt.isString(w.id) && w.id.length === 4)
  .filter(w => cwt.isInteger(w.minDuration) && w.minDuration >= 1)
  .filter(w => cwt.isInteger(w.maxDuration) && w.maxDuration >= w.minDuration)
  .filter(w => cwt.isBoolean(w.defaultWeather))
  .isPresent();

// ([map]) -> (() -> [weather])
cwt.loadWeathers = (data) => data
  .map(weather => cwt.flyweight(baseWeather, weather))
  .bind(data => data.map(weather => cwt.isWeather(weather) ? cwt.just(weather) : cwt.nothing()))
  .get();

// (weatherModel, weather) -> weatherModel
cwt.weatherModelFactory = (weatherModel, nextWeather) => {
  const day = Math.max(model.day - 1, 0);
  const type = model.day === 0 ? nextWeather : weatherModel.type;
  return {
    day,
    type
  };
};

cwt.getRandomWeatherModel = () =>
  random(0, weathers.length)
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

// (MoveType, String) -> Int
cwt.getMoveCosts = (movetype, tileType) =>
  cwt.either(cwt.maybe(movetype.costs[tileType]),
    cwt.either(cwt.maybe(movetype.costs["*"]),
      cwt.just(0)));

// (Int ?= 0, Int ?= 0) -> turnModel
cwt.turnModelFactory = (day = 0, owner = 0) => ({
  day,
  owner
});

// (players, turnModel) -> maybe<int>
cwt.getNextTurnOwner = function(players, model) {
  const currentId = model.turnOwner;
  const relativeNextId = cwt
    .rotate(players, currentId + 1)
    .findIndex(el => el.team >= 0) + 1;
  const absoluteNextId = (relativeNextId + currentId) % data.players.length;

  return currentId != absoluteNextId ? cwt.something(absoluteNextId) : cwt.nothing();
};

// (Int, Int) -> boolean
cwt.isDayChangeBetweenOwners = (idA, idB) => idB < idA;

// (players, turnModel) -> turnModel
cwt.xxx = (players, turns) => cwt
  .getNextTurnOwner(players, turns)
  .map(nextOwner => {
    const day = turnModel.day + (cwt.isDayBetweenTurnOwners(data.turnOwner, nextOwner) ? 1 : 0);
    return {
      day,
      nextOwner
    };
  })
  .ifNotPresent(cwt.error("GAME: no next turn owner found"));

// (GameData) -> GameModel
cwt.gameModelFactory = (data) => ({

  map: cwt.mapModelFactory(data.width, data.height),

  turn: cwt.turnModelFactory(data.day, cwt.maybe(data.turnOwner).orElse(0)),

  players: cwt.intRange(1, cwt.MAX_PLAYERS)
    .map(i => cwt.playerFactory()),

  units: cwt.intRange(1, cwt.MAX_UNITS * cwt.MAX_PLAYERS)
    .map(i => cwt.unitFactory("INFT"))
});

// (MapData) -> GameData
cwt.gameDataByMapFactory = (map) => {

};

// (SaveData) -> GameData
cwt.gameDataBySaveFactory = (save) => {

};


// =========================================================================================================
//                                                GUI 
// =========================================================================================================


// =========================================================================================================
//                                              STARTUP
// =========================================================================================================

cwt.logIO()
  .putLn("STARTING CustomWarsTactics")
  .putLn("VERSION: " + cwt.VERSION)
  .bind(() => cwt.loop())
  .bind(delta => console.log("TICK"));