"use strict";

// CustomWarsTactics Source File
// Why one file? Easier for us and we have no time.. so please do not try to explain "this is an anti pattern!"

// =========================================================================================================
//                                                STUB
// =========================================================================================================

const DEBUGMODE = true;

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 240;

const INACTIVE_ID = -1;
const DESELECT_ID = -2;
const ACTIONS_BUFFER_SIZE = 200;
const MAX_PLAYERS = 4;
const MAX_UNITS = 50;
const MAX_MAP_WIDTH = 100;
const MAX_MAP_HEIGHT = 100;
const MAX_PROPERTIES = 300;
const MAX_SELECTION_RANGE = 15;
const MAX_BUFFER_SIZE = 200;
const TILE_LENGTH = 16;

const VERSION = "0.36";
const AI_VERSION = "DumbBoy v. 0.1 Alpha";

// =========================================================================================================
//                                                CORE
// =========================================================================================================

const compose = function() {
  switch (arguments.length) {
    case 2:
      return compose2.apply(this, arguments);
    case 3:
      return compose3.apply(this, arguments);
    case 4:
      return compose4.apply(this, arguments);
    case 5:
      return compose5.apply(this, arguments);
    case 6:
      return compose6.apply(this, arguments);
    case 7:
      return compose7.apply(this, arguments);
    case 8:
      return compose8.apply(this, arguments);
    case 9:
      return compose9.apply(this, arguments);
    default:
      throw new Error("Unsupported arity");
  }
};

const compose2 = (f, g) => (value) => f(g(value));
const compose3 = (f, g, h) => (value) => h(f(g(value)));
const compose4 = (f, g, h, i) => (value) => i(h(f(g(value))));
const compose5 = (f, g, h, i, j) => (value) => j(i(h(f(g(value)))));
const compose6 = (f, g, h, i, j, k) => (value) => k(j(i(h(f(g(value))))));
const compose7 = (f, g, h, i, j, k, l) => (value) => l(k(j(i(h(f(g(value)))))));
const compose8 = (f, g, h, i, j, k, l, m) => (value) => m(l(k(j(i(h(f(g(value))))))));
const compose9 = (f, g, h, i, j, k, l, m, n) => (value) => n(m(l(k(j(i(h(f(g(value)))))))));

// (Map) => Map
const immutable = (obj) => Object.freeze(obj);

// (Map, Map ?= {}) => Map
const flyweight = (prototype, data = {}) => Object.assign(Object.create(prototype), data);

// (Map, Map ?= {}) => Map
const createCopy = (source, data = null) =>
  Object.assign(
    Object.keys(source).reduce((obj, key) => {
      obj[key] = source[key];
      return obj;
    }, {}), data);

// (Int, Int) => [Int]
const intRange = (from, to) => {
  var arr = [];
  for (; from <= to; from++) {
    arr.push(from);
  }
  return arr;
};

// (any) => boolean
const isInteger = (value) => typeof value === 'number' && value % 1 === 0;

// (any) => boolean
const isNumber = (value) => typeof value === 'number';

// (any) => boolean
const isString = (value) => typeof value === 'string';

// (any) => boolean
const isFunction = (value) => typeof value === 'function';

// (any) => boolean
const isBoolean = (value) => value === true || value === false;

// (any) => boolean
const isSomething = (value) => value !== null && value !== undefined;

// (list<any>, (any) => boolean) => boolean
const isListOf = (value, valueTypeCheck) => value.every(element => valueTypeCheck(element));

// (map<any>, (any) => boolean) => boolean
const isMapOf = (value, valueTypeCheck) => Object.keys(value).every(key => valueTypeCheck(value[key]));

// (Int, (Int, a) => a', a) => nothing
const nTimes = (n, fn, argument = nothing()) => n > 0 ? nTimes(n - 1, fn, fn(n, argument)) : argument;

// ([a], (a) => Int) => Int
const listSumUp = (list, fn) => list.reduce((sum, obj) => sum + fn(obj), 0);

// ([a], Int) => [a]
const rotate = function(arr, count) {
  arr = arr.map(el => el);
  count = count % arr.length;
  if (count < 0) {
    arr.unshift.apply(arr, arr.splice(count))
  } else {
    arr.push.apply(arr, arr.splice(0, count))
  }
  return arr;
};

/** @signature (Int ?= 0, Int ?= 10) => just Int */
const random = (from = 0, to = 10) => just(from + parseInt(Math.random() * to, 10));

const either = {

  // (a) => left String | right a (same as either String, a)
  fromNullable: value => value === null || value === undefined ?
    left("ValueIsNotDefined") : right(value),

  expectTrue: value => value === true ? left(value) : right(value),

  // (() => a) => left Error | right a (same as either Error, a)
  tryIt: (f) => {
    try {
      return right(f())
    } catch (e) {
      return left(e)
    }
  }
};

const left = function(value) {
  return {
    map: f => left(value),
    biMap: (fLeft, fRight) => left(fLeft(value)),
    bind: f => left(value),
    fold: (leftHandle, rightHandle) => just(leftHandle(value))
  };
};

const right = function(value) {
  return {
    map: f => right(f(value)),
    biMap: (fLeft, fRight) => right(fRight(value)),
    bind: f => f(value),
    fold: (leftHandle, rightHandle) => just(rightHandle(value))
  };
};

const validation = (expression) => expression ? right("PASSED") : left("FAILED");


// () => Int
const randomInt = (from, to) => just(from + parseInt(Math.random() * (to - from), 10));

// a => just a | nothing
const maybe = (value) => value == null || value == undefined ? nothing() : just(value);

// a => just a
const just = (value) => ({
  map: (f) => maybe(f(value)),
  elseMap: f => just(value),
  biMap: (fPresent, fNotPresent) => maybe(fPresent(value)),
  bind: (f) => f(value),
  filter: (f) => f(value) ? just(value) : nothing(),
  isPresent: () => true,
  ifPresent: (f) => f(value),
  orElse: (v) => value,
  get: () => value,
  toString: () => "just(" + value + ")"
});

const _nothing = immutable({
  map: (f) => _nothing,
  elseMap: (f) => maybe(f()),
  biMap: (fPresent, fNotPresent) => maybe(fNotPresent()),
  bind: (f) => _nothing,
  filter: (f) => _nothing,
  isPresent: () => false,
  ifPresent: (f) => _nothing,
  orElse: (v) => v,
  get() {
    throw new Error("Nothing");
  },
  toString: () => "nothing"
});

// => nothing
const nothing = () => _nothing;

// =========================================================================================================
//                                                 GAME
// =========================================================================================================

const containsId = (data) => isString(data.id) && data.id.length === 4;

const tileTypeBase = {
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

// () => MapModel
const mapModelFactory = (width, height) => ({
  tiles: intRange(1, width).map(columnId =>
    intRange(1, height).map(rowId =>
      tileModelFactory("PLIN")))
});

// (String) => TileModel
const tileModelFactory = (type) => ({ type });

// (Map) => TileTypeModel
const tileTypeModelFactory = (data) => flyweight(tileTypeBase, data);

// (MapModel, Int, Int) => TileModel
const getMapTile = (mapModel, x, y) => mapModel.tiles[x][y];

// (Int, Int, Int, Int) => Int
const distanceBetweenPositions = (sx, sy, tx, ty) => Math.abs(sx - tx) + Math.abs(sy - ty);

// ({x,y}, {x,y}) => Int
const distanceBetweenObjects = (a, b) => distanceBetweenPositions(a.x, a.y, b.x, b.y);

// ({x,y}, {x,y}) => Boolean
const areOnSamePosition = (a, b) => distanceBetweenObjects(a, b) === 0;

// () => PlayerModel
const playerFactory = (team = -1, money = 0, name = "Player") => ({ name, team, money });

// (playerModel, playerModel) => Boolean
const areOwnedBySameTeam = (playerA, playerB) => playerA.team === playerB.team;

// ({owner}, {owner}) => Boolean
const areOwnedBySamePlayer = (a, b) => a.owner === b.owner;

// ([PlayerModel]) => Boolean
const thereAreAtLeastTwoOppositeTeams = (players) => players.reduce((result, player) => result =
  (player.team == -1 ? result :
    (result == -1 ? player.team :
      (result != player.team ? -2 : result))), -1) == -2;

const baseUnitType = {
  turnStartFuelConsumption: 0,
  maxAmmo: 1,
  maxFuel: 50,
  supplies: []
};

// isConsumingFuelOnTurnStart:: (UnitModel, {UnitType}) => Boolean
const isConsumingFuelOnTurnStart = (unit, types) => types[unit.type].fuelConsumption > 0;

// drainFuelOnTurnOwnerUnits:: (GameModel) => GameModel'
const drainFuelOnTurnOwnerUnits = (model) => createCopy(model, {
  units: model.units.map(unit => {
    if (areOwnedBySamePlayer(unit, model.turn)) {
      return createCopy(unit, {
        owner: unit.fuel - (isConsumingFuelOnTurnStart(unit, model.unitTypes) ? unit.owner : -1),
        fuel: unit.fuel - model.unitTypes[unit.type].turnStartFuelConsumption
      });
    }
    return unit;
  })
});

// (String) => UnitModel
const unitFactory = (type, owner = -1) => ({ hp: 99, owner, x: 0, y: 0, type, fuel: 0 });

// weather
const baseWeather = { defaultWeather: false, minDuration: 1, maxDuration: 4 };

// Weather => Boolean
const isWeather = (weather) => just(weather)
  .filter(w => isString(w.id) && w.id.length === 4)
  .filter(w => isInteger(w.minDuration) && w.minDuration >= 1)
  .filter(w => isInteger(w.maxDuration) && w.maxDuration >= w.minDuration)
  .filter(w => isBoolean(w.defaultWeather))
  .isPresent();

// ([Map]) => (() => [Weather])
const loadWeathers = (data) => data
  .map(weather => flyweight(baseWeather, weather))
  .bind(data => data.map(weather => isWeather(weather) ? just(weather) : nothing()))
  .get();

// (Weather, Int) => WeatherModel
const weatherModelFactory = (type, day = 0) => ({ day, type });

const getRandomWeatherModel = (weathers) =>
  randomInt(0, weathers.length)
  .map(value => just(weatherModelFactory(weathers[value], 4)))
  .get();

/*
let duration = active.minDuration;
    duration += parseInt(Math.random() * (active.maxDuration - duration), 10);
    leftDays = duration;
    */

/** @signature PropertyTypeModel */
const basePropertyType = {
  capturable: false,
  funds: 0,
  builds: [],
  repairs: [],
  supplies: []
};

/** @signature Map => Boolean */
const isPropertyType = (data) => maybe(data)
  .filter(containsId)
  .filter(data => isBoolean(data.capturable))
  .filter(data => isInteger(data.funds) && data.funds >= 0)
  .filter(data => isListOf(data.builds, isString))
  .filter(data => isListOf(data.repairs, isString))
  .isPresent();

// sumUpFunds:: (Player, [PropertyModel], {PropertyTypeModel}) => Int
const sumUpFunds = (owner, properties, propertyTypes) =>
  listSumUp(properties, property => property.owner === owner ? propertyTypes[property.type].funds : 0);

// payFundsToTurnOwner:: (GameModel) => GameModel'
const payFundsToTurnOwner = (model) => createCopy(model, {
  players: model.players.map((player, owner) => {
    if (areOwnedBySamePlayer({ owner }, model.turn)) {
      return createCopy(player, {
        money: player.money + sumUpFunds(model.turn.owner, model.properties, model.propertyTypes)
      });
    }
    return player;
  })
});

/** @signature Map => maybe PropertyTypeModel */
const propertyTypeFactory = (data) => maybe(data)
  .map(data => flyweight(basePropertyType, data))
  .filter(isPropertyType);

// (Int, Int) => PropertyModel
const propertyModelFactory = (type, owner = -1, points = 20) => ({ type, points, owner });

// (PropertyModel, PropertyTypeModel, UnitModel) => PropertyModel
const captureProperty = (property, propertyType, capturer) => {
  const points = property.points - parseInt(capturer.hp / 10, 10);
  const captured = points <= 0;
  const owner = captured ? capturerUnitModel.owner : propertyModel.owner;
  const type = captured && propertyType.capturedType ? propertyType.capturedType : property.type;

  return createCopy(property, { type, points: (captured ? 20 : points), owner });
};

// canPropertyRepairType:: (PropertyType, String) => Boolean
const canPropertyRepairType = (propertyType, unitType) => propertyType.repairs.indexOf(unitType) > -1;

// repairTurnOwnerUnitsOnProperties:: (GameModel) => GameModel'
const repairTurnOwnerUnitsOnProperties = (model) => createCopy(model, {
  units: model.units.map(unit => {
    if (areOwnedBySamePlayer(unit, model.turn)) {
      return maybe(model.properties.find(prop => areOnSamePosition(unit, prop) && areOwnedBySamePlayer(unit, prop)))
        .map(prop => createCopy(unit, {
          hp: canPropertyRepairType(model.propertyTypes[prop.type], unit.type) ?
            Math.min(parseInt(unit.hp + 20, 10), 99) : unit.hp
        }))
        .orElse(unit)
    }
    return unit;
  })
});

// (Int, [PropertyModel]) => Boolean
const hasHeadquarter = (owner, properties) => properties.any(el => el.owner === owner && el.type === "HQTR");

// MoveType
const baseMoveType = {
  range: 0,
  costs: { "*": -1 }
};

// (Map String:Int, String) => Int
const getMoveCosts = (costs, tileType) => maybe(costs[tileType])
  .elseMap(() => costs["*"])
  .elseMap(() => 0)
  .get();

const getMoveCostsOfType = (moveType, tileType) => getMoveCosts(moveType.costs, tileType);

// (Int ?= 0, Int ?= 0) => turnModel
const turnModelFactory = (day = 0, owner = 0) => ({ day, owner });

// ([PlayerModel], TurnModel) => maybe<Int>
const predictNextTurnOwner = function(players, model) {
  const currentId = model.owner;
  const relativeNextId = rotate(players, currentId + 1).findIndex(el => el.team >= 0) + 1;
  const absoluteNextId = (relativeNextId + currentId) % players.length;
  return currentId != absoluteNextId ? just(absoluteNextId) : nothing();
};

// (Int, Int) => Boolean
const isDayChangeBetweenOwners = (idA, idB) => idB < idA;

// ([PlayerModel], TurnModel) => TurnModel
const getNextTurn = (players, turn) => predictNextTurnOwner(players, turn)
  .map(nextOwner => turnModelFactory(turn.day + (isDayChangeBetweenOwners(turn.owner, nextOwner) ? 1 : 0), nextOwner))
  .get();

// (GameModel) => GameModel'
const tickTurn = (model) => {
  const turn = getNextTurn(model.players, model.turn);
  const changedDay = isDayChangeBetweenOwners(model.turn.owner, turn.owner);
  const limits = createCopy(model.limits, {
    leftDays: model.limits.leftDays + (changedDay ? -1 : 0)
  });
  const weatherLeftDays = model.weather.day + (changedDay ? -1 : 0);
  const weather = createCopy(model.weather, {
    day: weatherLeftDays,
    type: weatherLeftDays > 0 ? model.weather.type : getRandomWeatherModel(model.weatherTypes)
  });

  return createCopy(model, { turn, limits, weather });
};

// () => GameLimitsModel
const gameLimitFactory = () => ({
  leftDays: Number.POSITIVE_INFINITY,
  leftTurnTime: Number.POSITIVE_INFINITY,
  leftGameTime: Number.POSITIVE_INFINITY
});

// (GameModel) => Boolean
const isTurnTimeLimitReached = (gameModel) => gameModel.turnOwner.elapsedTime >= gameModel.limits.turnTimeLimit;

// WRONG
const isGameTimeLimitReached = (gameModel) => gameModel.turnOwner.elapsedTime >= gameModel.limits.gameTimeLimit;

// (GameModel) => Boolean
const isTurnLimitReached = (gameModel) => gameModel.turnOwner.day >= gameModel.limits.dayLimit;

// (GameData) => GameModel
const gameModelFactory = (data) => ({
  map: mapModelFactory(data.width, data.height),
  tileTypes: {},
  turn: turnModelFactory(data.day, maybe(data.turnOwner).orElse(0), maybe(data.gameTime).orElse(0)),
  players: intRange(1, MAX_PLAYERS).map(i => playerFactory()),
  properties: intRange(1, MAX_PROPERTIES).map(i => propertyModelFactory("PFNY", 0)),
  propertyTypes: {},
  units: intRange(1, MAX_UNITS * MAX_PLAYERS).map(i => unitFactory("INFT", 0)),
  unitTypes: {},
  weather: weatherModelFactory("WSUN", maybe(data.weatherLeftDays).orElse(0)),
  weatherTypes: {},
  limits: gameLimitFactory()
});

// (MapData) => GameData
const gameDataByMapFactory = (map) => {

};

// (SaveData) => GameData
const gameDataBySaveFactory = (save) => {

};

// (SaveData) => GameData
const gameDataForDemoPurposes = () => {
  var model = gameModelFactory({ width: 20, height: 20, day: 5, turnOwner: 0 });

  model.properties = model.properties.map((property, n) =>
    createCopy(property, {
      x: parseInt(n / 19),
      y: n % 19,
      type: "PFNY"
    }));

  model.units = model.units.map((unit, n) =>
    createCopy(unit, {
      x: parseInt(n / 19),
      y: n % 19,
      type: "INFT"
    }));

  model.players[0].team = 0;
  model.players[1].team = 1;
  model.players[2].team = 2;
  model.players[3].team = -1;

  model.units[0].fuel = 999999999999999;
  model.units[0].type = "FUEL";
  model.units[0].hp = 20;

  model.units[1].owner = 1;
  model.units[1].fuel = 999999999999999;
  model.properties[1].owner = 1;

  // P2 - but not standing on property
  model.units[2].owner = 1;
  model.units[2].x = 19;
  model.units[2].y = 19;
  model.units[2].fuel = 999999999999999;
  model.properties[2].owner = 1;

  // P2 - standing on property but not repairable
  model.units[3].owner = 1;
  model.units[3].type = "NORP";
  model.properties[3].owner = 1;

  model.units[4].hp = 90;

  model.units[5].hp = 90;
  model.units[5].owner = 0;
  model.properties[5].owner = 1;

  model.propertyTypes.PFNY = propertyTypeFactory({
    id: "PFNY",
    funds: 1000,
    repairs: [
      "INGT", "INBT", "INBH", "INBB", "INBA", "INBC", "INFT", "FUEL"
    ]
  }).get();
  model.propertyTypes.PFNN = propertyTypeFactory({ id: "PFNY" }).get();

  model.unitTypes.NORP = flyweight(baseUnitType);
  model.unitTypes.INFT = flyweight(baseUnitType);
  model.unitTypes.FUEL = flyweight(baseUnitType);
  model.unitTypes.FUEL.turnStartFuelConsumption = 5;

  return model;
};

// =========================================================================================================
//                                           GAME ACTIONS 
// =========================================================================================================

// Map String:(GameModel => { model: GameModel, changes: [?]}) 
const actions = {};

// gameModelDifference:: (GameModel, GameModel) => [{ name: String }]
const gameModelDifference = (oldModel, newModel) => {
  const events = [];

  if (isDayChangeBetweenOwners(oldModel.turn.owner, newModel.turn.owner)) {
    events.push({ name: "changedDay" });
  }
  if (newModel.limits.leftDays == 0) {
    events.push({ name: "dayLimitReached" });
  }

  return events;
};

// gameAction:: ((GameModel) => GameModel') => (GameModel => { model: GameModel', changes: [{ name: String }]})
const gameAction = (action) => (model) => {
  const newModel = action(model);
  return { model: newModel, changes: gameModelDifference(model, newModel) }
};

const resupplyTurnOwnerUnitsOnProperties = (model) => createCopy(model, {
  units: model.units.map(unit => unit.owner != model.turn.owner ?
    unit :
    maybe(model.properties.reduce((result, prop) => (
      result == null &&
      areOnSamePosition(unit, prop) &&
      areOwnedBySamePlayer(unit, prop)) ? prop : result, null))
    .biMap(
      (prop) => {
        const canSupply = model.propertyTypes[prop.type].supplies.indexOf(unit.type) !== -1;
        return createCopy(unit, {
          fuel: canSupply ? model.unitTypes[unit.type].maxFuel : unit.fuel,
          ammo: canSupply ? model.unitTypes[unit.type].maxAmmo : unit.ammo
        });
      },
      () => unit)
    .get())
});

const resupplyTurnOwnerUnitsBySupplierUnits = (model) => createCopy(model, {
  units: model.units.map(unit => unit.owner != model.turn.owner ?
    unit :
    maybe(model.units.reduce((result, tUnit) => (
      result == null &&
      distanceBetweenObjects(unit, tUnit) == 1 &&
      areOwnedBySamePlayer(unit, tUnit)) ? tUnit : result, null))
    .map((tUnit) => model.unitTypes[tUnit.type].supplies.indexOf(unit.type) !== -1 ?
      tUnit : null)
    .biMap(
      (tUnit) => {
        const canSupply = model.unitTypes[tUnit.type].supplies.indexOf(unit.type) !== -1;
        return createCopy(unit, {
          fuel: canSupply ? model.unitTypes[unit.type].maxFuel : unit.fuel,
          ammo: canSupply ? model.unitTypes[unit.type].maxAmmo : unit.ammo
        });
      },
      () => unit)
    .get())
});

// most critical action (performance wise) in the game!! -.-
// 
// performance test ATOM X5 - 8300
// 
// v1 181ms 
// v2 140ms
// v3 120ms
// v4  35ms 
// v5 ???ms
//
actions.nextTurn =
  gameAction(
    compose(
      tickTurn,
      payFundsToTurnOwner,
      drainFuelOnTurnOwnerUnits,
      repairTurnOwnerUnitsOnProperties,
      resupplyTurnOwnerUnitsOnProperties,
      resupplyTurnOwnerUnitsBySupplierUnits));