(function(exports) {
  "use strict";

  const compose = cwtCore.compose;
  const immutable = cwtCore.immutable;
  const flyweight = cwtCore.flyweight;
  const createCopy = cwtCore.createCopy;
  const intRange = cwtCore.intRange;
  const isInteger = cwtCore.isInteger;
  const isNumber = cwtCore.isNumber;
  const isString = cwtCore.isString;
  const isFunction = cwtCore.isFunction;
  const isBoolean = cwtCore.isBoolean;
  const isSomething = cwtCore.isSomething;
  const isListOf = cwtCore.isListOf;
  const isMapOf = cwtCore.isMapOf;
  const nTimes = cwtCore.nTimes;
  const listSumUp = cwtCore.listSumUp;
  const rotate = cwtCore.rotate;
  const random = cwtCore.random;
  const either = cwtCore.either;
  const eitherLeft = cwtCore.eitherLeft;
  const eitherRight = cwtCore.eitherRight;
  const validation = cwtCore.validation;
  const randomInt = cwtCore.randomInt;
  const maybe = cwtCore.maybe;
  const just = cwtCore.just;
  const nothing = cwtCore.nothing;
  const identity = cwtCore.identity;


  // propertyPath:: [a] -> Lens
  const propertyPath = R.pipe(
    R.map(R.ifElse(R.is(Number), R.lensIndex, R.lensProp)),
    R.apply(R.compose));


  const containsId = (data) => isString(data.id) && data.id.length === 4;

  const tileTypeBase = {
    defense: 0,
    blocksVision: false,

    capture_loose_after_captured: false,
    capture_change_to: "",

    notTransferable: false,
    funds: 0,
    vision: 0,
    supply: [],
    repairs: [],
    produces: [],
    builds: [],

    rocket_range: -1,
    rocket_change_to: "",

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

  const postionFactory = (x, y) => ({ x: x, y: y });

  // (String) => TileModel
  const tileModelFactory = (type) => ({ type });

  // (Map) => TileTypeModel
  const tileTypeModelFactory = (data) => flyweight(tileTypeBase, data);

  // (Int, Int, Int, Int) => Int
  const distanceBetweenPositions = (sx, sy, tx, ty) => Math.abs(sx - tx) + Math.abs(sy - ty);

  // ({x,y}, {x,y}) => Int
  const distanceBetweenObjects = (a, b) => distanceBetweenPositions(a.x, a.y, b.x, b.y);

  // ({x,y}, {x,y}) => Boolean
  const areOnSamePosition = (a, b) => distanceBetweenObjects(a, b) === 0;

  const INACTIVE_POWER = 1;
  const ACTIVE_POWER = 2;
  const ACTIVE_SUPER_POWER = 3;

  // () => PlayerModel
  const playerFactory = (team = -1, money = 0, name = "Player") => ({
    name,
    team,
    money,
    power: 0,
    activePowerLevel: INACTIVE_POWER
  });

  // (playerModel, playerModel) => Boolean
  const areInSameTeam = (playerA, playerB) => playerA.team === playerB.team;

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
    costs: 0,
    supplies: [],
    attackMap: {}
  };

  const unitTypeFactory = data => flyweight(baseUnitType, data);

  const getValueOrWildCardOrZero = (map, id) => maybe(map[id]).elseMap(() => map["*"]).orElse(0);

  const getAttackDamage = (attackerTypeModel, defenderType) =>
    getValueOrWildCardOrZero(attackerTypeModel.attackMap, defenderType);

  // isConsumingFuelOnTurnStart:: (UnitModel, {UnitType}) => Boolean
  const isConsumingFuelOnTurnStart = (unit, types) => types[unit.type].turnStartFuelConsumption > 0;

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

  // resupplyTurnOwnerUnitsBySupplierUnits:: (GameModel) => GameModel'
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

  // ([Boolean], PlayersUnitId) => [Boolean]
  const setUnitIntoWaitingMode = (actableModel, unitId) =>
    actableModel.map((el, index) => index == unitId ? false : el);

  // (Int) => Boolean [when result is true, then v is a PlayersUnitId]
  const isPlayersUnitId = (v) => isInteger(v) && v >= 0 && v <= 49;

  const canUnitAct = R.curry((unitId, model) => R.view(R.lensPath(["actables", unitId]), model));

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
      eitherLeftDays = duration;
      */

  /** @signature PropertyTypeModel */
  const basePropertyType = {
    capturable: false,
    capture_change_to: null,
    funds: 0,
    builds: [],
    repairs: [],
    supplies: []
  };

  /** @signature Map => Boolean */
  const isPropertyType = (data) => maybe(data)
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

  // resupplyTurnOwnerUnitsOnProperties:: (GameModel) => GameModel'
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

  // (Int, [PropertyModel]) => Boolean
  const hasHeadquarter = (owner, properties) => properties.any(el => el.owner === owner && el.type === "HQTR");

  // MoveType
  const baseMoveType = {
    range: 0,
    costs: { "*": -1 }
  };

  const getMoveCostsOfType = (moveType, tileType) =>
    getValueOrWildCardOrZero(moveType.costs, tileType);

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

  // (GameModel) => GameModel'
  const tickTurn = (model) => {
    const nextOwner = predictNextTurnOwner(model.players, model.turn).get();
    // TODO: HANDLE NOTHING

    const changedDay = isDayChangeBetweenOwners(model.turn.owner, nextOwner);

    const turn = turnModelFactory(model.turn.day + (changedDay ? 1 : 0), nextOwner);
    const limits = createCopy(model.limits, {
      eitherLeftDays: model.limits.eitherLeftDays + (changedDay ? -1 : 0)
    });
    const weathereitherLeftDays = model.weather.day + (changedDay ? -1 : 0);
    const weather = createCopy(model.weather, {
      day: weathereitherLeftDays,
      type: weathereitherLeftDays > 0 ? model.weather.type : getRandomWeatherModel(model.weatherTypes)
    });

    return createCopy(model, { turn, limits, weather });
  };

  const infinity = Number.POSITIVE_INFINITY;

  // () => GameLimitsModel
  const gameLimitFactory = (leftTurnTime = infinity, leftGameTime = infinity) => ({
    leftDays: Number.POSITIVE_INFINITY,
    leftTurnTime,
    leftGameTime,
    minimumProperties: 0
  });

  // (GameModel) => Boolean
  const isTurnTimeLimitReached = (model) => model.limits.eitherLeftTurnTime <= 0;

  // (GameModel) => Boolean
  const isGameTimeLimitReached = (model) => model.limits.eitherLeftGameTime <= 0;

  // (GameModel) => Boolean
  const isTurnLimitReached = (model) => model.limits.eitherLeftDays <= 0;

  const isValidGameData = (data) => just(data)
    .filter(data => isInteger(data.width) && data.width >= 10 && data.width <= 50)
    .filter(data => isInteger(data.height) && data.height >= 10 && data.height <= 50)
    .isPresent()

  // (GameData) => either Error, GameModel
  const gameModelFactory = data => eitherRight(data)
    .bind(data => isValidGameData(data) ? eitherRight(data) : eitherLeft("IAE: illegal data"))
    .map(data => {
      const MAX_PLAYERS = 4;
      const MAX_UNITS = 50;
      const MAX_MAP_WIDTH = 100;
      const MAX_MAP_HEIGHT = 100;
      const MAX_PROPERTIES = 300;

      const dataUnits = maybe(data.units).orElse([]);
      const defaultUnits = R.times(i => unitFactory(""), MAX_PROPERTIES);
      const dataProperties = maybe(data.properties).orElse([]);
      const defaultProperties = R.times(i => propertyModelFactory(""), MAX_PROPERTIES);

      return {
        fog: intRange(1, data.width).map(columnId => intRange(1, data.height).map(identity(false).get)),
        map: mapModelFactory(data.width, data.height),
        tileTypes: {},
        turn: turnModelFactory(data.day, maybe(data.turnOwner).orElse(0)),
        players: intRange(1, MAX_PLAYERS).map(i => playerFactory(i)),
        properties: R.flatten(
          R.append(
            R.takeLast((MAX_PROPERTIES) - dataProperties.length, defaultProperties),
            R.zipWith(
              (custom, source) => R.merge(source, custom),
              dataProperties,
              defaultProperties))),
        units: R.flatten(
          R.append(
            R.takeLast((MAX_UNITS * MAX_PLAYERS) - dataUnits.length, defaultUnits),
            R.zipWith(
              (dataUnit, sourceUnit) => R.merge(sourceUnit, dataUnit),
              dataUnits,
              defaultUnits))),
        weather: weatherModelFactory("", maybe(data.changesWeatherInDays).orElse(0)),
        actables: intRange(1, MAX_UNITS).map(identity(false).get),
        limits: gameLimitFactory(),
        unitTypes: R.mapObjIndexed(
          (data, id) => unitTypeFactory(data),
          maybe(data.unitTypes).orElse({})),
        moveTypes: R.mapObjIndexed(
          (data, id) => flyweight(baseMoveType, data),
          maybe(data.moveTypes).orElse({})),
        propertyTypes: R.mapObjIndexed(
          (data, id) => propertyTypeFactory(data).get(),
          maybe(data.propertyTypes).orElse({})),
        weatherTypes: R.mapObjIndexed(
          (data, id) => flyweight(baseWeather, data),
          maybe(data.weatherTypes).orElse({}))
      }
    });


  const lensUnitList = R.lensProp("units");
  const evolveUnit = R.curry((id, evolveDesc, model) => R.over(lensUnitList, R.over(R.lensIndex(id), R.evolve(evolveDesc))));
  const readUnit = (id, model) => R.view(R.lensIndex(id), R.view(lensUnitList, model));
  const ownerWipeEvolve = { owner: R.identity(-1) };
  const evolvePutLoadCounter = { loadedIn: R.dec };
  const evolvePopLoadCounter = { loadedIn: R.inc };

  //
  // ({}) => either Error, GameModel
  exports.createGame = gameModelFactory;

  exports.yieldGame = (model, playerId) => eitherRight(model)
    .bind(model => createCopy(model, {
      players: fjs.map((player, id) => playerId != id ?
        player :
        createCopy(player, { team: -1 }),
        model.players)
    }));

  const moveUnitByCode = (data, code) => {
    const newX = data.unit.x + (code == 1 ? +1 : code == 3 ? -1 : 0);
    const newY = data.unit.y + (code == 0 ? -1 : code == 2 ? +1 : 0);

    return ({
      model: data.model,
      unit: createCopy(unit, {
        fuel: data.unit.fuel - getMoveCostsOfType(
          model.moveTypes[model.unitTypes[data.unit.type].moveType],
          model.map.tiles[newX][newY]),
        x: newX,
        y: newY
      })
    })
  };

  exports.moveUnit = (model, unitId, way) => eitherRight(model)
    .bind(model => {
      const movingUnit = model.units[unitId];
      const newMovingUnit = fjs.fold(moveUnitByCode, {
        model: model,
        unit: movingUnit
      }, fjs.while(() => true, way));

      // TODO: fog

      return createCopy(model, {
        units: fjs.map(unit => unit == movingUnit ? newMovingUnit : unit, model.units)
      })
    });

  exports.produceUnit = (model, factoryId, type) => eitherRight(model)
    .bind(model => {

      const producedType = model.unitTypes[type];
      const factory = model.properties[factoryId];
      const possibleNewUnit = fjs.fold((selected, unit) => !selected && unit.owner == -1 ?
        unit : selected, null, model.units);

      return createCopy(model, {

        players: fjs.map((player, id) => id === factory.owner ?
          createCopy(player, {
            money: player.money - producedType.costs
          }) : player, model.players),

        units: fjs.map(unit => possibleNewUnit == unit ?
          createCopy(unit, {
            x: factory.x,
            y: factory.y,
            owner: factory.owner,
            type: type
          }) : unit,
          model.units)
      })
    });

  exports.destroyUnit = (model, unitId) => eitherRight(model)
    .map(envolveUnit(unitId, ownerWipeEvolve));

  const numberToInt = x => parseInt(x, 10);

  exports.attackUnit = (model, attackerId, defenderId) => eitherRight(model)
    .bind(model => {
      const attacker = model.units[attackerId];
      const defender = model.units[defenderId];

      const attackDamage = 0;
      const counterDamage = 0;

      const defenderNewHP = Math.max(0, defender.hp - attackDamage);
      const defenderHpDiff = defender.hp - defenderNewHP;

      const attackerNewHp = defenderNewHP > 0 ? Math.max(0, attacker.hp - counterDamage) : attacker.hp;
      const attackerHpDiff = attackerNewHp - attacker.hp;

      const attackerPowerResult = numberToInt(
        numberToInt(defenderHpDiff) * 0.1 * model.unitTypes[defender.type].costs);

      const defenderPowerResult = numberToInt(
        numberToInt(attackerHpDiff) * 0.1 * model.unitTypes[attacker.type].costs);

      const attackerPowerGain = defenderPowerResult + numberToInt(attackerPowerResult * 0.5);
      const defenderPowerGain = attackerPowerResult + numberToInt(defenderPowerResult * 0.5);

      const newAttacker = createCopy(attacker, {
        hp: attackerNewHp,
        owner: attackerNewHp > 0 ? -1 : attacker.owner
      });

      const newDefender = createCopy(defender, {
        hp: defenderNewHP,
        owner: defenderNewHP > 0 ? -1 : defender.owner
      });

      const attackerOwner = model.players[attacker.owner];
      const newAttackerOwner = createCopy(attackerOwner, {
        power: attackerOwner.power + attackerPowerGain
      });

      const defenderOwner = model.players[defender.owner];
      const newDefenderOwner = createCopy(defenderOwner, {
        power: defenderOwner.power + defenderPowerGain
      });

      return createCopy(model, {
        units: fjs.map(unit =>
          unit == attacker ? newAttacker :
          unit == defender ? newDefender :
          unit, model.units),

        players: fjs.map(player =>
          player == attackerOwner ? newAttackerOwner :
          player == defenderOwner ? newDefenderOwner :
          player, model.players)
      });
    });

  exports.resupplyNeightbours = model => eitherRight(model);

  exports.loadUnit = (model, loadId, transporterId) => eitherRight(model)
    .map(evolveUnit(transporterId, evolvePutLoadCounter))
    .map(evolveUnit(loadId, { loadedIn: R.identity(transporterId) }));

  exports.unloadUnit = (model, loadId, transporterId, unloadDir) => Either.of(model)
    .bind(model => Either.cond(lt(-1, readUnit(transporterId, model).loadedIn), "transporter is loaded", model))
    .map(evolveUnit(transporterId, evolvePopLoadCounter))
    .map(model => evolveUnit(loadId, {
      loadedIn: R.identity(-1),
      x: R.identity(readUnit(transporterId, model).x),
      y: R.identity(readUnit(transporterId, model).y)
    }))
    .map(model => moveUnit(model, loadId, [unloadDir]));

  const activateCoPower = (model, playerId, power) => eitherRight(model)
    .bind(model => {
      return createCopy(model, {
        players: fjs.map((player, index) => index != playerId ? player : createCopy(player, {
          power: 0,
          activePowerLevel: power
        }), model.plaers)
      });
    });

  exports.activatePower = (model, playerId) => activateCoPower(model, playerId, ACTIVE_POWER);

  exports.activateSuperPower = (model, playerId) => activateCoPower(model, playerId, ACTIVE_SUPER_POWER);

  exports.fireRocket = (model, rocketId, firerId, tx, ty) => eitherRight(model)
    .bind(model => {
      const oldRocket = model.properties[rocketId];
      const rocketType = model.propertyTypes[oldRocket.type];
      const rocketRange = rocketType.rocket_range;
      const newType = rocketType.rocket_change_to;
      const newRocket = createCopy(oldRocket, {
        type: newType
      });

      const target = postionFactory(tx, ty);

      return createCopy(model, {
        properties: fjs.map((prop, index) => index == rocketId ? newRocket : prop, model.properties),
        units: fjs.map((unit) => {
          if (distanceBetweenObjects(target, unit) <= rocketRange) {
            return createCopy(unit, {
              hp: Math.max(9, unit.hp - 20)
            })
          }
          return unit;
        }, model.units)
      });
    });

  // (GameModel, PlayersUnitId, PropertyId) => either Error, GameModel'
  exports.captureProperty = (unitId, propertyId, model) => eitherRight(model)
    .bind(eitherCond(() => isPlayersUnitId(unitId), R.always("IAE-IUI")))
    .bind(eitherCond(canUnitAct(unitId), R.always("IAE-UCA")))
    .bind(eitherCond(() => areOnSamePosition(
      R.view(propertyPath(["units", unitId]), model),
      R.view(propertyPath(["properties", propertyId]), model)
    ), R.always("IAE-SFE")))
    .bind(eitherCond(() => {
      const unitOwner = R.view(propertyPath(["units", unitId, "owner"]), model);
      const propOwner = R.view(propertyPath(["properties", propertyId, "owner"]), model);
      return !areInSameTeam(
        R.view(propertyPath(["players", unitOwner]), model),
        R.view(propertyPath(["players", propOwner]), model));
    }, R.always("IAE-DTE")))
    .map(model => {

      const capturer = model.units[unitId];
      const property = R.view(propertyPath(["properties", propertyId]), model);
      const propType = model.propertyTypes[property.type];
      const previousOwner = property.owner;
      const changesAfterCapturedTo = maybe(propType.capture_change_to).orElse(property.type);
      const restPoints = property.points - numberToInt(0.1 * (capturer.hp + 1));
      const captured = R.lte(restPoints, 0);

      const modelA = R.over(propertyPath(["properties", propertyId]), R.evolve({
        points: R.ifElse(
          R.always(captured),
          R.always(20),
          R.always(restPoints)),
        owner: R.ifElse(
          R.always(captured),
          R.always(capturer.owner),
          R.identity),
        type: R.ifElse(
          R.and(R.always(captured)),
          R.always(changesAfterCapturedTo),
          R.identity)
      }), model);

      const numOfProps = R.reduce((a, b) => b.owner === propertyId ? a + 1 : a, 0, modelA.properties);

      const loosesAfterCaptured = R.or(
        propType.capture_loose_after_captured, 
        R.lt(numOfProps, model.limits.minimumProperties));

      const modelB = R.over(propertyPath(["properties"]), R.ifElse(
        R.always(loosesAfterCaptured),
        R.map(R.ifElse(
          R.pipe(R.prop("owner"), R.equals(previousOwner)),
          R.evolve({ owner: R.always(-1) }),
          R.identity)),
        R.identity), modelA);

      return modelB;
    });

  const eitherCond = R.curry((ifFn, elseFn, x) => ifFn(x) ? eitherRight(x) : eitherLeft(elseFn(x)));

  // (GameModel, PlayersUnitId) => either Error, GameModel'
  exports.wait = (unitId, model) => eitherRight(model)
    .bind(eitherCond(() => isPlayersUnitId(unitId), R.always("IAE-IUI")))
    .bind(eitherCond(canUnitAct(unitId), R.always("IAE-UCA")))
    .map(R.over(R.lensProp("actables"), R.over(R.lensIndex(unitId), R.F)));

  // (GameModel, Int) => either Error, GameModel'
  exports.elapseTime = (model, time) => eitherRight(time)
    .bind(time => isInteger(time) ? eitherRight(time) : eitherLeft("IAE: time must be int"))
    .bind(time => time >= 0 ? eitherRight(time) : eitherLeft("IAE: negative time"))
    .map(time => createCopy(model, {
      limits: gameLimitFactory(
        Math.max(model.limits.leftTurnTime - time, 0),
        Math.max(model.limits.leftGameTime - time, 0))
    }));

  // most critical action (performance wise) in the game because there is so much stuff happening. 
  // this may breaks the 60FPS target (because it immutability costs a lot) but we're easily able 
  // to move this whole game logic into a new thread (because of it's immutability) and run in in new
  // threads. A different strategy is to serialize the game model and run only the actions itself 
  // in a new thread. Another different approach is to change the api of next turns actions. When they 
  // return only their sub part (like unit model, turn model etc.) then we could run some of the sub 
  // actions in parallel.
  // 
  // performance test ATOM X5 - 8300
  // 
  // v1 181ms 
  // v2 140ms
  // v3 120ms
  // v4  35ms 
  // v5  20ms
  // v6  10ms
  //
  exports.nextTurn = compose(
    tickTurn,
    payFundsToTurnOwner,
    drainFuelOnTurnOwnerUnits,
    repairTurnOwnerUnitsOnProperties,
    resupplyTurnOwnerUnitsOnProperties,
    resupplyTurnOwnerUnitsBySupplierUnits,
    // TODO: may deacctivate CO powers here
    // TODO: change weather
    eitherRight
  );

  exports.GAME_VERSION = "0.36";
  exports.GAME_AI_VERSION = "DumbBoy v. 0.1 Alpha";

})(window.cwtGame || (window.cwtGame = {}));

// freeze API
window.cwtGame = cwtCore.immutable(cwtGame);