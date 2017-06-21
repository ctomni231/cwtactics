const gameModelTypes = () => {

  const isEnum = (...items) => v => items.includes(v)

  const isBoolean = value => typeof value === "boolean"

  const isString = (
      minLength = 0,
      maxLength = 9999) =>
    v =>
    typeof v === "string" &&
    v.length >= minLength &&
    v.length <= maxLength

  const integer = (
      min = Number.NEGATIVE_INFINITY,
      max = Number.POSITIVE_INFINITY) =>
    v =>
    typeof v === "number" &&
    Math.trunc(v) === v &&
    v >= min && v <= max

  const map = (keyPredicate, valuePredicate) =>
    value => Object
    .keys(value)
    .map(key => [key, value[key]])
    .every([key, value] => keyPredicate(key) && valuePredicate(value))

  const maybe = predicate => value => value === undefined || value === null || predicate(value)

  const isID = (prefix = "") => v => string(4, 4)(v) && v.indexOf(prefix) === 0

  const typeIdReference = typeName =>
    (id, _, root) => root.types[typeName].some(t => t.id === id)

  const typeReference = typeName =>
    (value, _, root) => root.types[typeName].includes(value)

  const isEffectType = {
    event: isString,
    restriction: maybe(isString),
    effect: isString
  }

  const isUnitType = {
    id: isID("U"),
    costs: integer(0, 999999),
    fuel: integer(0, 99),
    range: integer(0, 15),
    movetype: typeIdReference("movetypes"),
    vision: integer(1, 15),
    supply: [typeIdReference("movetypes")],
    capturer: isBoolean,
    stealth: isBoolean,
    suicide: {
      damage: isIntBetween(1, 9),
      range: isIntBetween(1, 15)
    },
    transport: {
      canload: exports.every(exports.isString),
      maxloads: integer(1, 5)
    },
    attack: {
      ammo: isIntBetween(1, 14),
      range: {
        min: exports.somePass(exports.isUndefined, isIntBetween(1, 14)),
        max: exports.somePass(exports.isUndefined, isIntBetween(2, 15))
      },
      primary: map(any => true, integer(0, 999)),
      secondary: map(any => true, integer(0, 999))
    }
  }

  const isTileType = {
    id: isID("T"),
    defense: positiveInteger(6),
    blocksVision: isBoolean,
    notTransferable: isBoolean,
    isCriticalProperty: isBoolean,
    transformation: {
      afterCaptured: isID("T")
    },
    vision: isIntBetween(0, 15),
    funds: isIntBetween(1, 99999),
    repairs: map(T, integer(1, 9)),
    produces: [typeIdReference("units")]
  }

  const isWeatherType = {
    id: isID("W"),
    duration: {
      min: isInteger(0),
      max: isInteger(0),
    },
    effects: [isEffectType]
  }

  const isMoveType = {
    id: isID("M"),
    costs: map(isID, integer(0, 15))
  }

  const isCommanderType = {
    id: isID("C"),
    name: string(3),
    dayEffects: [isEffectType],
    superCoPower: [isEffectType],
    coPower: [isEffectType]
  }

  const GameTypes = {
    units: [isUnitType],
    tiles: [isTileType],
    weathers: [isWeatherType],
    movetypes: [isMoveType],
    commanders: [isCommanderType]
  }

  const isProperty = {
    owner: (value, _, root) => root.players.includes(value),
    points: integer(0, 20)
  }

  const isUnit = {
    position: {
      x: (value, pos, root) => integer(0, root.map.length)(value),
      y: (value, pos, root) => integer(0, root.map[0].length)(value)
    },
    hp: integer(1, 99),
    stealth: {
      hidden: isBoolean
    },
    experience: {
      points: integer(0, 999999),
      rank: isEnum(0, 1, 2, 3)
    },
    ammo: (value, unit) => integer(0, unit.type.attack.ammo),
    fuel: (value, unit) => integer(0, unit.type.fuel),
    transport: maybe({
      maxloads: integer,
      loads: [(value, _, root) => root.units.some(unit => unit.id === value)]
    }),
    owner: (value, _, root) => root.players.includes(value),
    type: typeReference("units"),
    stats: [isEnum("lowfuel", "lowammo", "loads", "hidden")]
  }

  const isGameMap = table(integer(10, 300), integer(10, 300), {
    type: typeReference("tiles"),
    property: isProperty,
    unit: isUnit
  })

  const isPlayer = {
    gold: integer(0, 999999),
    team: isEnum(1, 2, 3, 4),
    manpower: integer(0),
    name: string(4, 20),
    visionMap: table(integer(0)),
    commanders: {
      power: integer(0, 999999),
      timesPowerUsed: integer(0),
      firstCo: typeReference("commanders"),
      secondCo: typeReference("commanders")
    }
  }

  const GameConfiguration = {

    turnTime: integer(0, Number.POSITIVE_INFINITY),

    capturePerStep: integer(1, 1000),

    capturePoints: integer(1, 1000),

    unitMobilizable: isBoolean,

    funds: integer(0, 999999),

    unitsMaySurrender: isBoolean,

    // when enabled then enemy units cannot move
    // through neighbour tiles of own units
    noMovementThroughZoneOfControl: isBoolean,

    // when enabled then units will be attacked
    // by enemy units when they move directly
    // into them (0 <-> 100 percent chance)
    ambushingOnHiddenMovementBlock: integer(0, 100)
  }

  const isGameWorld = {
    types: GameTypes,
    rules: GameConfiguration,
    map: isGameMap,
    players: [isPlayer],
    turn: {
      day: integer(0, 999999),
      owner: value(isEnum(root.players)),
      leftGameTime: integer(0, Number.POSITIVE_INFINITY),
      leftTurnTime: integer(0, Number.POSITIVE_INFINITY)
    },
    actives: [isBoolean],
    effects: [{
      event: isString,
      restriction: maybe(isString),
      effect: isString
        }],
    async: {
      events: [{
        leftTicks: integer(0, 99),
        data: Array.isArray,
        command: isEnum("changetype")
          }]
    },
    weather: {
      mainWeather: (value, _, root) => isEnum(...root.types.weathers),
      leftDays: (value, weather) => value >= 1 && weather.active.duration.max < value,
      active: typeReference("weathers")
    }
  }

  return {
    isTileType,
    isUnitType,
    isGameWorld
  }
}()
