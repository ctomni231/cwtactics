/**

  This file contains the game code.

  This is an internal version for the great CWT relaunch process. There
  will be a lot of features which will be dropped because the old engine
  will be exchanged with the jslix engine.

  Look at GameWorldType constant to get structural information of
  the game world
 */
const createCwtGameInstance = () => {
  "use-strict";

  /**
    @param {object<sring, (predicate(A)|spec)>} spec
    @param {string} namespace will be printed in front of the properties
                    which will be returned
    @return {array<string>} list of invalid properties
   */
  const createValidator = (spec, namespace = "") => (value, root = value) =>
    Object
    .keys(spec)
    .map(key => {
      switch (typeof spec[key]) {
        case "function":
          return !spec[key](value[key], value, root) ? namespace + key : null
        case "object":
          // TODO array support
          return createValidator(spec[key], namespace + key + ".")(value[key], root)
        default:
          return namespace + key + "(illegal)"
      }
    })
    .filter(v => !!v)
    .reduce((result, value) => result.concat(value), [])

  const condition = value => ({
    case(predicate, supplier) {
      return !!predicate(value) ? conditionSolved(supplier(value)) : condition(value)
    },
    default(newValue) {
      return newValue
    }
  })

  const conditionSolved = value => ({
    case() {
      return conditionSolved(value)
    },
    default() {
      return value
    }
  })

  const $ = createCoreModule()
  const exports = {}

  const niyError = () => console.error("niy")

  /**
    Client API interface.
  */
  exports.client = {

    /**
      Pushes an information into the debug channel
     */
    debug: exports.noop,

    /**
      Restarts the whole game.
    */
    restart: niyError,

    /**
      @todo client has to overwrite this
      @return Promise(void, error-message)
    */
    init: niyError,

    audio: {

      /**
        @parameter volume {integer} new volume of the channel (values: 0..100)
        @return {integer} new sfx channel volume
      */
      setSfxVolume: niyError,

      /**
        @return {integer} sfx channel volume
      */
      getSfxVolume: niyError,

      /**
        @parameter volume {integer} new volume of the channel (values: 0..100)
        @return {integer} new music channel volume
      */
      setMusicVolume: niyError,

      /**
        @return {integer} music channel volume
      */
      getMusicVolume: niyError

    },

    /**
      @return {object{x: integer, y: integer}}
     */
    getCursor: niyError,

    /**
      @todo client has to overwrite this
      @param key
      @param translated key or ???key??? if key cannot be
             translated into a human readable language
    */
    translated: niyError,

    jobs: {

      /**
        Calls the given job after the given time in
        milliseconds over and over again until jobs.remove is called.

        @todo client has to overwrite this
        @param key
        @param time {integer} in ms
        @param job {function}
      */
      add: niyError,

      /**
        Removes the given job from the job queue.

        @todo client has to overwrite this
        @param key
      */
      remove: niyError
    },

    /**
      Shows a notification message to the user. This may not
      requests any interaction from the user and fades out after
      time.

      @todo client has to overwrite this
      @param time {int} in milliseconds
      @param msg {string}
    */
    showNotification: niyError,

    events: {

      /**
        Will be called when a screen will be opened.

        @todo client has to overwrite this
        @param key {string} key of the screen
        @param layout {???} layout data of the screen
      */
      onScreenOpened: $.noop,

      /**
        @param weather {string}
       */
      onWeatherChanged: $.noop,

      /**
        @param type {string}
        @param x {integer}
        @param y {integer}
       */
      onUnitCreated: $.noop
    },

    /**
      network package contains the network access
    */
    net: {

      /**
        @todo client has to overwrite this
        @param key {string}
        @param data {?}
      */
      shareCommand: niyError,

      /**
        @todo client has to overwrite this
        @return {boolean} true if the game round is a network
                game instance, false otherwise
       */
      isActive: niyError,

      /**
        @todo client has to overwrite this
        @return {boolean} true when the game client is the host
                instance in a game instance, false otherwise
       */
      isHost: niyError
    },

    /**
      storage object holds functions to store and load persistent data
    */
    storage: {

      /**
        @todo client has to overwrite this
        @param key {string} key of the entry
        @return Promise(T, error-message)
      */
      load: niyError,

      /**
        save:: (string, A) -> Promise(A, string)

        takes a key and a value. saves the value with the unique identifier
        key and returns a promise which resolves with the saved value, or
        rejects with an error message.
      */
      save: niyError,

      /**
        @todo client has to overwrite this
        @return Promise(void, error-message)
      */
      clean: niyError
    }
  }

  exports.model = {

    /**
      @return [string]
     */
    isValidGameData(data) {

      const isEnum = (...items) => v => items.includes(v)

      const isBoolean = value => typeof value === "boolean"

      const string = (minLength = 0, maxLength = 9999) =>
        v =>
        typeof v === "string" &&
        v.length >= minLength &&
        v.length <= maxLength

      const integer = (min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY) =>
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

      const EffectType = {
        event: isString,
        restriction: maybe(isString),
        effect: isString
      }

      const GameWorldType = {
        types: {
          units: [{
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
          }],
          tiles: [{
            id: isID("T"),
            defense: positiveInteger(6),
            blocksVision: isBoolean,
            notTransferable: isBoolean,
            vision: isIntBetween(0, 15),
            funds: isIntBetween(1, 99999),
            repairs: map(T, integer(1, 9)),
            produces: [typeIdReference("units")]
          }],
          weathers: [{
            id: isID("W"),
            duration: {
              min: isInteger(0),
              max: isInteger(0),
            },
            effects: [EffectType]
          }],
          movetypes: [{
            id: isID("M"),
            costs: map(isID, integer(0, 15))
          }],
          commanders: [{
            id: isID("C"),
            name: string(3),
            dayEffects: [EffectType],
            superCoPower: [EffectType],
            coPower: [EffectType]
          }]
        },
        rules: {

          capturePerStep: integer(1, 1000),

          capturePoints: integer(1, 1000),

          funds: integer(0, 999999),

          unitsMaySurrender: isBoolean,

          // when enabled then enemy units cannot move
          // through neighbour tiles of own units
          noMovementThroughZoneOfControl: isBoolean,

          // when enabled then units will be attacked
          // by enemy units when they move directly
          // into them (0 <-> 100 percent chance)
          ambushingOnHiddenMovementBlock: integer(0, 100)
        },
        map: table(
          integer(10, 300),
          integer(10, 300), {
            type: typeReference("tiles"),
            property: {
              owner: (value, _, root) => root.players.includes(value),
              capturePoints: integer(0, 20)
            },
            unit: {
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
          }),
        players: [{
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
        }],
        turn: {
          day: integer(0, 999999),
          owner: value(isEnum(root.players)),
          leftGameTime: integer(0, Number.POSITIVE_INFINITY),
          leftTurnTime: integer(0, Number.POSITIVE_INFINITY)
        },
        usables: [isBoolean],
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

      return new Promise((resolve, reject) => {
        const errors = createValidator(GameWorldType)(data)
        return (errors.length > 0 ? reject : resolve)(errors)
      })
    },

    isValidModel(data) {

    },

    // TODO needed ?
    isValidPosition(e, t) {
      return e >= 0 && t >= 0 && e < model.map_width && t < model.map_height
    },

    position: (x, y) => {
      x,
      y
    },

    sliceRange(map, range, position) {
      const result = []

      const leftX = Math.max(0, position.x - range)
      const leftY = Math.max(0, position.y - range)
      const rightX = Math.max(map.length - 1, position.x + range)
      const rightY = Math.max(map[0].length - 1, position.y + range)

      for (let x = leftX; x <= rightX; x++) {
        for (let y = leftY; y <= rightY; y++) {
          const actualRange = Math.abs(position.x - x) + Math.abs(position.y - y)
          if (actualRange <= range) {
            result.push(map[x][y])
          }
        }
      }

      return result
    },

    mapTable: (callback, range, table, position) => {
      const leftTop = exports.model.position(position.x - range, position.y - range)
      //TODO fix OOB
      const sideLength = 2 * range + 1
      for (let x = leftTop.x, endX = Math.min(leftTop.x + sideLength, table.length); x < endX; x++) {
        for (let y = leftTop.y, endY = Math.min(leftTop.x + sideLength, table[x].length); y < endY; y++) {
          table[x][y] = callback(table[x][y], x, y)
        }
      }
    },

    toGameData(data) {
      const gamedata = {

        units: data.units.concat([{
          ID: "CANNON_UNIT_INV",
          cost: 0,
          range: 0,
          movetype: "NO_MOVE",
          vision: 1,
          fuel: 0,
          ammo: 0
        }, {
          ID: "LASER_UNIT_INV",
          cost: 0,
          range: 0,
          movetype: "NO_MOVE",
          vision: 1,
          fuel: 0,
          ammo: 0
        }]),

        tiles: data.tiles.concat([{
          ID: "PROP_INV",
          defense: 0,
          vision: 0,
          capturePoints: 1,
          blocker: !0
        }]),

        movetypes: data.movetypes.concat([{
          ID: "NO_MOVE",
          costs: {
            "*": -1
          }
        }]),

        cos: data.cos.map($.identity),

        weathers: data.weathers.map($.identity)
      }

      $.guard(exports.model.isValidGameData(gamedata))
      return gamedata
    },

    toMap(model) {
      let data = {}

      data.actr = exports.compose(
        exports.partial(exports.filter, exports.partial(exports.greaterThan, -1)),
        exports.partial(exports.map, (actable, index) => actable ? index : -1))(model.actions_leftActors)

      data.cfg = model.cfg_configuration
      data.co = exports.map((data, index) => exports.equal(-1, model.player_data[n].team) ?
        0 : [data.power, data.timesUsed, data.level, data.coA, data.coB], model.co_data
      )
      data.mp = exports.map(exports.identity, model.manpower_data)
      data.mpw = model.map_width
      data.mph = model.map_heigh
      data.gmTm = model.timer_gameTimeElapsed
      data.tnTm = model.timer_turnTimeElapsed
      data.trOw = model.round_turnOwner
      data.day = model.round_day
      data.wth = model.weather_data.ID

      data.prps = exports.map(
        (p, index) => [index, p.x, p.y, p.type.ID, p.capturePoints, p.owner],
        exports.filter(p => exports.notEqual(p.owner), model.property_data))

      data.units = exports.map(
        (u, index) => [model.unit_data.indexOf(u), u.type.ID, u.x, u.y, u.hp, u.ammo,
          u.fuel, u.loadedIn, u.owner
        ],
        exports.filter(u => exports.notEqual(u.owner), model.unit_data))

      // reduce all tiles to a list of distinct id values
      data.typeMap = exports.reduce(
        (ids, col) => exports.reduce(
          (ids, cell) => exports.includes(cell.type.ID, ids) && ids.push(cell.type.ID),
          ids, col), [], model.map_data)

      // we turn all tiles into the index of their id in the type map
      data.map = exports.map(exports.map(cell => data.typeMap.indexOf(cell.type.ID)), model
        .map_data)

      data.dyet = exports.filter(exports.notEqual(-1), exports.map(exports.identity, model.dayTick_dataTime))
      data.dyee = exports.filter(exports.isTruthy, exports.map(exports.identity, model.dayTick_dataEvent))
      data.dyea = exports.filter(exports.isTruthy, exports.map(exports.identity, model.dayTick_dataArgs))

      // e.actr = exports.compose(filter(exports.greaterThan(-1)), exports.map((actable, index) => actable ? index : -1))(model.actions_leftActors)

      return JSON.stringify(data)
    },

    fromMap(worldShape, data) {

      const model = {}

      exports.guard(exports.every(v => exports.isInteger(v) && exports.isBetween(0, 49), e.actr))

      model.actions_leftActors = exports.map(exports.always(false), exports.range(1, 50))
      exports.forEach(i => model.actions_leftActors[i] = true, e.actr)


      // PREPARE

      // controller.buildRoundConfig
      for (var t = controller.configBoundaries_, o = Object.keys(t), n = 0, a = o.length; a > n; n++) {
        var r, l = o[n];
        e && e.hasOwnProperty(l) ? (r = e[l], r < t[l].min && assert(!1, l, "is greater than it's minimum value"), r > t[l].max && assert(!1, l, "is greater than it's maximum value"), t[l].hasOwnProperty("step") && 0 !== r % t[l].step && assert(!1, l, "is does not fits one of it's possible values")) : r = t[l].defaultValue, model.cfg_configuration[l] = r
      }


      model.client_lastPid = -1

      var e, t, o;
      for (t = 0, o = 4; o > t; t++) e = model.co_data[t], e.power = 0, e.timesUsed = 0, e.level = -1, e.coA = null, e.coB = null

      model.dayTick_dataTime.resetValues(), model.dayTick_dataEvent.resetValues(), model.dayTick_dataArgs.resetValues()

      model.manpower_data.resetValues()


      model.map_width = e.mpw
      model.map_height = e.mph;
      for (var t = 0, o = model.map_width; o > t; t++)
        for (var n = 0, a = model.map_height; a > n; n++) {
          model.unit_posData[t][n] = null
          model.property_posMap[t][n] = null
          model.map_data[t][n] = model.data_tileSheets[e.typeMap[e.map[t][n]]]
        }

      assert(util.intRange(e.player, 2, 4));
      var t, o, n;
      for (o = 0, n = 4; n > o; o++) t = model.player_data[o], t.name = null, t.gold = 0, t.team = o <= e.player - 1 ? o : -2

      for (var t, o, n = 0, a = model.property_data.length; a > n; n++) model.property_data[n].owner = -1, model.property_data[n].type = null;
      for (var n = 0, a = e.prps.length; a > n; n++) o = e.prps[n], assert(util.intRange(o[0], 0, 299)), assert(util.intRange(o[1], 0, 99)), assert(util.intRange(o[2], 0, 99)), assert(util.isString(o[3]) && !util.isUndefined(model.data_tileSheets[o[3]].capturePoints) || "undefined" != typeof model.data_tileSheets[o[3]].cannon || "undefined" != typeof model.data_tileSheets[o[3]].laser || "undefined" != typeof model.data_tileSheets[o[3]].rocketsilo), assert(util.intRange(o[4], 1, model.data_tileSheets[o[3]].capturePoints) || util.intRange(o[4], -99, -1) || "undefined" != typeof model.data_tileSheets[o[3]].rocketsilo), assert(util.intRange(o[5], -1, 3)), t = model.property_data[o[0]], t.type = model.data_tileSheets[o[3]], t.capturePoints = 20, t.owner = o[5], t.x = o[1], t.y = o[2], model.property_posMap[o[1]][o[2]] = t

      model.round_turnOwner = -1, model.round_day = 0

      assert(util.intRange(e.trOw, 0, 999999)), assert(util.intRange(e.day, 0, 999999)), model.round_turnOwner = e.trOw, model.round_day = e.day

      model.rule_map.resetValues()

      assert(util.isInt(e.gmTm) && e.gmTm >= 0), assert(util.isInt(e.tnTm) && e.tnTm >= 0), model.timer_gameTimeElapsed = e.gmTm, model.timer_turnTimeElapsed = e.tnTm

      for (var t = 0, o = model.unit_data.length; o > t; t++) model.unit_data[t].owner = -1;
      model.unit_posData.resetValues();
      var n;
      if (e.units) {
        assert(Array.isArray(e.units));
        for (var t = 0, o = e.units.length; o > t; t++) {
          n = e.units[t], assert(util.isInt(n[0])), assert("string" == typeof n[1]), assert(model.data_unitSheets.hasOwnProperty(n[1]));
          var a = model.data_unitSheets[n[1]];
          assert(model.map_isValidPosition(n[2], n[3])), assert(util.intRange(n[4], 1, 99)), assert(util.intRange(n[5], 0, a.ammo)), assert(util.intRange(n[6], 0, a.fuel)), assert(util.isInt(n[7])), assert(util.intRange(n[8], -1, 3));
          var r = n[0],
            l = model.unit_data[r];
          l.type = a, l.x = n[2], l.y = n[3], l.hp = n[4], l.ammo = n[5], l.fuel = n[6], l.loadedIn = n[7], l.owner = n[8], model.unit_posData[n[2]][n[3]] = l
        }

        // CONTAINS LOW_AMMO,LOW_FUEL,HAS_LOADS,CAPTURES,VISIBLE
        mode.unit_data.forEach(unit => unit.traits = new Set())
      }
      model.weather_data = model.data_defaultWeatherSheet

      // TODO uuuuugh

      for (var t = Object.keys(e.cfg), o = t.length; o--;) assert(util.isInt(e.cfg[t[o]]));
      controller.buildRoundConfig(e.cfg)

      var t, o, n, a;
      for (assert(Array.isArray(e.co) && 4 === e.co.length), n = 0, a = 4; a > n; n++) t = e.co[n], t > 0 && (assert(util.intRange(t[0], 0, 999999)), assert(util.intRange(t[1], 0, 999999)), assert(util.intRange(t[2], model.co_MODES.NONE, model.co_MODES.AWDR)), assert(util.isString(t[3]) && model.data_coSheets.hasOwnProperty(t[3])), assert(util.isString(t[4]) && model.data_coSheets.hasOwnProperty(t[4])), o = model.co_data[n], o.power = t[0], o.timesUsed = t[1], o.level = t[2], o.coA = t[3] ? model.data_coSheets[t[3]] : null, o.coB = t[4] ? model.data_coSheets[t[4]] : null)

      var t = 0,
        o = e.dyev.length;
      for (assert(e.dyea.length === 2 * o); o > t; t++) assertInt(e.dyev[t]), assertStr(e.dyee[t]), assert(e.dyev[t] > 0), model.dayTick_dataTime[t] = e.dyev[t], model.dayTick_dataEvent[t] = e.dyee[t], model.dayTick_dataArgs[2 * t] = e.dyea[2 * t], model.dayTick_dataArgs[2 * t + 1] = e.dyea[2 * t + 1]

      assert(Array.isArray(e.manpower));
      var t = e.manpower.length - 1;
      do assert(util.isInt(e.manpower[t]) && e.manpower[t] >= 0), t--; while (t >= 0);
      model.manpower_data.grabValues(e.manpower)

      var t, o, n, a;
      for (n = 0, a = e.players.length; a > n; n++) t = e.players[n], assert(util.intRange(t[0], 0, 3)), assert(util.isString(t[1])), assert(util.intRange(t[2], 0, 999999)), assert(util.intRange(t[3], 0, 3)), o = model.player_data[t[0]], o.name = t[1], o.gold = t[2], o.team = t[3]

      for (var t, o = 0, n = e.prps.length; n > o; o++) {
        var a = e.prps[o];
        t = model.property_data[a[0]], t.capturePoints = a[4]
      }

      assert(model.data_weatherSheets.hasOwnProperty(e.wth)), model.weather_data = model.data_weatherSheets[e.wth]

      // =======================================================
      // TODO

      model.properties = $.range(1, 300).map(id => ({
        id,
        capturePoints: 20,
        owner: -1,
        x: 0,
        y: 0,
        type: null
      }))

      model.cos = {
        data: $.range(1, 4).map(any => ({
          timesUsed: 0,
          power: 0,
          level: 0,
          coA: null,
          coB: null
        }))
      }

      model.players = $
        .range(1, 4)
        .map(any => ({
          gold: 0,
          team: -1,
          name: null
        }))

      model.units = $
        .range(1, 200)
        .map(id => ({
          id,
          hp: 99,
          x: 0,
          y: 0,
          ammo: 0,
          fuel: 0,
          loadedIn: -1,
          type: null,
          hidden: !1,
          owner: -1
        }))

      model.mode = "no-co"
    }
  }

  exports.commands = {

    /**
      returns true if the buffer contains at least one command,
      false otherwise
     */
    hasItems: buffer => buffer.length > 0,

    post: (buffer, command) => {
      const MAX_SIZE = 200

      // TODO check format
      guard(buffer.length < MAX_SIZE)
      buffer.push(command)
      return buffer
    },

    /**

      */
    getNext: buffer => {
      guard(exports.commands.hasItems(buffer))
      return buffer.shift()
    }
  }

  exports.transfer = {

    /**
       @param player {PlayerType}
       @return a list of values which are transferable by the given player
     */
    getMoneyTransferPackages: player => [1000, 2500, 5000, 10000, 25000, 50000]
      .filter(x => x <= player.gold),

    /**
      @return true when the player can transfer money, false otherwise
     */
    canTransferMoney: (sourcePlayer) =>
      player.gold >= $.head(exports.transfer.getMoneyTransferPackages()),

    doMoneyTransfer(sourcePlayer, amount, targetPlayer) {
      sourcePlayer.gold -= amount
      targetPlayer.gold += amount
      guard(sourcePlayer.gold >= 0)
    },

    canDoPropertyTransfer: (property) => !property.type.notTransferable,

    /**
      @param property {PropertyType}
      @param targetPlayer {PlayerType}
     */
    doPropertyTransfer: (property, targetPlayer) => property.owner = targetPlayer,

    /**
      @return true when the unit can be transfered, else false
     */
    canTransferUnit: unit => !exports.transport.hasLoads(unit),

    /**
      @param unit {UnitType} unit that will be transfered
      @param targetPlayer {PlayerType} new owner of the unit
    */
    transferUnit(unit, targetPlayer) {
      // TODO this does not work because there is no effect here 
      // exports.model.sliceRange(unit.owner.visionMap, unit.type.vision, unit.position).forEach()
      exports.model.mapTable(vision => vision - 1, unit.type.vision, unit.owner.visionMap, unit.position)
      exports.model.mapTable(vision => vision + 1, unit.type.vision, targetPlayer.visionMap, unit.position)
      unit.owner = targetPlayer
    },

    /**
      @param players {[PlayerType]} all known players
      @param player {PlayerType}
      @returns a list of players which are suitable as transfer target for the
               given player
     */
    getTransferTargetPlayers: (players, player) => players
      .filter(p => p.team != -1)
      .filter(p => p != player)
  }

  const supply = {

    isSupplier: (unit) => !!unit.type.supply,

    /**
      @return a list of units which can be supplied by the given unit
              at a given position
     */
    getSupplyTargets: (map, unit, position = unit.position) => exports.model
      .sliceRange(map, 1, position)
      .filter(tile => !!tile.unit)
      .map(tile => tile.unit)
      .filter(tileUnit => tileUnit.owner === unit.owner),

    /**
      @return true if the given unit can supply surrounding units at
      a given position
     */
    canSupplyNeighbours: (map, unit, position = unit.position) => supply
      .getSupplyTargets(map, unit, unit.position)
      .length > 0,

    /**
      Refills every unit of the same owner in the surrounding tiles
      to the given supply unit.
    
      @param {Map} map
      @param {Unit} unit
     */
    supplyNeighbours: (map, unit) => supply
      .getSupplyTargets(map, unit, unit.position)
      .forEach(supply.refillSupplies),

    refillSupplies(unit) {
      unit.ammo = unit.type.maxAmmo
      unit.fuel = unit.type.maxFuel
    },

    /**
      Heals an unit and may pays all heal points over 99 to the
      units owner.

      @param unit {Unit}
      @param amount {integer 1 <-> 99} amount that will be healed
      @return maximum of 0 and unit.hp + amount - 99

      @TODO outsource additional hp as gold
     */
    refillHP(unit, amount) {
      guard(amount > 0 && amount <= 99)
      const aboveMaxHP = Math.max(0, unit.hp + amount - 99)
      unit.owner.gold += parseInt(aboveMaxHP * unit.type.cost / 100, 10)
      unit.hp = Math.min(99, unit.hp + amount)
      return aboveMaxHP
    },

    raiseFunds: (property) => property.gold += 1000,

    drainFuel: unit => condition()
    case (unit.hidden && unit.type.dailyFuelDrainHidden > 0, unit.type.dailyFuelDrainHidden)
    case (unit.type.dailyFuelDrain > 0, unit.type.dailyFuelDrain)
    defaultDo(0, fuelDrain => {
      unit.fuel = unit.fuel - fuelDrain
    })
  }

  exports.async = {

    /**
      @effect
      @return list of events which have to be executed now
     */
    tick: asyncModel => {
      const events = asyncModel.events
      events.forEach(el => el.leftTicks--)
      asyncModel.events = events.filter(el => el.leftTicks > 0)
      return events.filter(el => el.leftTicks == 0)
    }
  }

  exports.turn = {

    /**

      @return {string} (nothing|end-turn|end-game)
     */
    evaluateTime(model, time) {
      model.leftTurnTime = Math.max(0, model.leftTurnTime - time)
      model.leftGameTime = Math.max(0, model.leftGameTime - time)

      return condition()
        .case(mode.leftGameTime <= 0, "end-game")
        .case(mode.leftTurnTime <= 0, "end-turn")
        .default("nothing")
    },

    /**

      @return {boolean} true if the day changed, false otherwise
     */
    endTurn: (turn, players) => {

      const currentOwner = model.round_turnOwner
      let nextOwner = currentOwner

      do {
        nextOwner = nextOwner < 3 ? nextOwner + 1 : 0

        // break out when we find a suitable player
        if (players[nextOwner].team != -1) break;

      } while (currentOwner != nextOwner)

      guard(currentOwner != nextOwner)

      const dayChanged = nextOwner < currentOwner

      turn.day = turn.day + (dayChanged ? 1 : 0)

      return dayChanged
    },

    yield(map, player) {

      const mayNeutralizePlayerObject = ownable => {
        if (!!ownable) ownable.owner = ownable.owner === player ? null : ownable.owner
      }

      map.forEach(column =>
        column.forEach(tile => {
          mayNeutralizePlayerObject(tile.unit)
          mayNeutralizePlayerObject(tile.property)
        }))

      player.team = -1

      //TODO
      api.turn.endTurn()
    }
  }

  exports.co = {

    getCostOfOnePowerStar(playerId) {
      const STAR_COST = 9000
      const INCREASE_PER_USE = 1800
      const MAXIMUM_INCREASES = 10

      const timesUsed = Math.max(model.co_data[playerId].timesPowerUsed, MAXIMUM_INCREASES)
      return STAR_COST + timesUsed * INCREASE_PER_USE
    },

    activatePower(model, power, playerId) {
      const powerLevel = model.co_POWER_LEVEL[power.toUpperCase()]
      exports.guard(powerLevel)

      const coData = model.co_data[playerId]
      coData.power = 0
      coData.level = powerLevel
      coData.timesUsed++
    },

    activateCoPower(model, playerId) {
      // TODO
    },

    activateSuperCoPower(model, playerId) {
      // TODO
    },


    isPowerActivatable(model, power, playerId) {
      if ([model.co_MODES.AW1, model.co_MODES.AW2, model.co_MODES.AWDS].includes(model.co_activeMode)) {
        return false
      }

      const coData = model.co_data[playerId]

      if (!coData.coA) return false

      const stars = {
        cop: "coStars",
        scop: "scoStars"
      }

      const starsNeeded = stars[power]
      cwt.guard(!!stars)

      return coData.power >= exports.co.getCostOfOnePowerStar(playerId) * starsNeeded
    },

    isCoPActivatable: (model, playerId) => exports.co.isPowerActivatable(model, "cop", playerId),

    isSCoPActivatable: (model, playerId) => exports.co.isPowerActivatable(model, "scop", playerId)
  }

  exports.stealth = {

    isStealthUnit: unit => !!unit.type.stealth,

    canHide: unit => !unit.hidden,

    canReveal: unit => !!unit.hidden,

    /**
      hides the unit on the map and all units from the enemy teams
      which can see the underlying tile can no longer see the unit, 
      except they standing in one of the surrounding tiles.
     */
    hide(unit) {
      exports.guard(exports.stealth.canHide(unit))
      unit.stealth.hidden = true
    },

    /**
      reveals the unit on the map and all units which can see the 
      underlying tile can see the given unit too.
     */
    reveal(unit) {
      exports.guard(exports.stealth.canReveal(unit))
      unit.hidden = false
    }
  }

  exports.join = {

    /**
      @return {boolean} true if source and target can join together,
                        false otherwise
     */
    canJoin: (sourceUnit, targetUnit) => [
        sourceUnit.owner == targetUnit.owner,
        sourceUnit.type == targetUnit.type,
        // TODO move this to the actions mediator
        !exports.transport.isTransporter(sourceUnit),
        !exports.transport.hasLoads(targetUnit),
        targetUnit.hp < 90
      ].every(x => !!x),

    combine: (sourceUnit, targetUnit) => {
      exports.guard(exports.join.canJoin(sourceUnit, targetUnit))

      const aboveFullHp = Math.max(0, sourceUnit.hp + targetUnit.hp - 99)

      targetUnit.hp = Math.min(targetUnit.hp + sourceUnit.hp, 99)
      targetUnit.fuel = Math.min(targetUnit.fuel + sourceUnit.fuel, targetUnit.type.fuel)
      targetUnit.ammo = Math.min(targetUnit.ammo + sourceUnit.ammo, targetUnit.type.ammo)
      sourceUnit.owner = null

      // TODO ?
      targetUnit.owner.gold = targetUnit.owner.gold + (sourceUnit.type.cost * 0.1)
    }
  }

  exports.battle = {

    /*
       controller.defineGameConfig("daysOfPeace", 0, 50, 0)
       controller.defineGameScriptable("minrange", 1, 14),
       controller.defineGameScriptable("maxrange", 1, 15),
       controller.defineGameScriptable("att", 50, 400),
       controller.defineGameScriptable("def", 50, 400),
       controller.defineGameScriptable("counteratt", 50, 400),
       controller.defineGameScriptable("luck", -50, 50),
       controller.defineGameScriptable("firstCounter", 0, 1),
       controller.defineGameScriptable("terrainDefense", 0, 12),
       controller.defineGameScriptable("terrainDefenseModifier", 10, 300)
    */

    WEAPON_KEYS: ["main_wp", "sec_wp"],

    FIRETYPES: {
      DIRECT: 0,
      INDIRECT: 1,
      BALLISTIC: 2,
      NONE: 3
    },

    isPeacePhaseActive: (model) => model.turn.day < model.cfg.daysOfPeace,

    /**
      @return {array<Unit>}
     */
    getTargets(model, unit, position = unit.position) {
      const minRange = unit.type.attack.range.min
      const maxRange = unit.type.attack.range.max
      const team = unit.owner.team
      const visionMap = unit.owner.visionMap

      return exports.model
        .sliceRange(model.map, maxRange, position)
        .map(tile => tile.unit)
        .filter(u => !!u)
        .filter(unit => visionMap[unit.position.x][unit.position.y] > 0)
        .filter(unit => exports.model.distance(position, unit.position) >= minRange)
        .filter(unit => unit.owner.team != team)
    },

    hasMainWeapon(e) {
      var t = e.attack;
      return "undefined" != typeof t && "undefined" != typeof t.main_wp
    },

    hasSecondaryWeapon(e) {
      var t = e.attack;
      return "undefined" != typeof t && "undefined" != typeof t.sec_wp
    },

    getUnitFireType(e) {
      if (!model.battle_hasMainWeapon(e) && !model.battle_hasSecondaryWeapon(e)) return model.battle_FIRETYPES.NONE;
      if ("undefined" != typeof e.attack.minrange) {
        var t = e.attack.minrange;
        return 1 === t ? model.battle_FIRETYPES.BALLISTIC : model.battle_FIRETYPES.INDIRECT
      }
      return model.battle_FIRETYPES.DIRECT
    },

    isIndirectUnit(e) {
      return assert(model.unit_isValidUnitId(e)), model.battle_getUnitFireType(model.unit_data[e].type) === model.battle_FIRETYPES.INDIRECT
    },

    isBallisticUnit(e) {
      return assert(model.unit_isValidUnitId(e)), model.battle_getUnitFireType(model.unit_data[e].type) === model.battle_FIRETYPES.BALLISTIC
    },

    canUseMainWeapon(e, t) {
      var o, n = e.type.attack,
        a = t.type.ID;
      return e.ammo > 0 && void 0 !== n.main_wp && (o = n.main_wp[a], "undefined" != typeof o) ? !0 : !1
    },

    hasTargets(e, t, o) {
      return model.battle_calculateTargets(e, t, o)
    },

    getBaseDamageAgainst(e, t, o) {
      var n = e.type.attack;
      if (!n) return -1;
      var a, r = t.type.ID;
      return "undefined" == typeof o && (o = !0), o && e.ammo > 0 && void 0 !== n.main_wp && (a = n.main_wp[r], "undefined" != typeof a) ? a : void 0 !== n.sec_wp && (a = n.sec_wp[r], "undefined" != typeof a) ? a : -1
    },

    getBattleDamageAgainst(e, t, o, n, a) {
      "undefined" == typeof a && (a = !1), assert(util.intRange(o, 0, 100)), assert(util.isBoolean(n)), assert(util.isBoolean(a));
      var r = model.battle_getBaseDamageAgainst(e, t, n);
      if (-1 === r) return -1;
      var l = model.unit_convertHealthToPoints(e),
        i = model.unit_convertHealthToPoints(t);
      controller.prepareTags(e.x, e.y);
      var d = parseInt(o / 100 * controller.scriptedValue(e.owner, "luck", 10), 10),
        s = controller.scriptedValue(e.owner, "att", 100);
      a && (s += controller.scriptedValue(t.owner, "counteratt", 0)), controller.prepareTags(t.x, t.y);
      var c = controller.scriptedValue(t.owner, "def", 100),
        m = model.map_data[t.x][t.y].defense,
        u = parseInt(controller.scriptedValue(t.owner, "terrainDefense", m) * controller.scriptedValue(t.owner, "terrainDefenseModifier", 100) / 100, 10),
        _ = (r * s / 100 + d) * (l / 10) * ((200 - (c + u * i)) / 100);
      return _ = parseInt(_, 10)
    },

    destroyUnit(unit) {
      // TODO neutral player
      unit.owner = null
    },

    damageUnit(unit, amount, minRest = 0) {
      unit.hp = Math.max(minRest, unit.hp - amount)
      if (unit.hp == 0) {
        api.battle.destroyUnit(unit)
      }
    },

    attack(map, attacker, defender, attackerLuck, defenderLuck) {

      exports.guard(model.unit_isValidUnitId(e.source.unitId))
      exports.guard(model.unit_isValidUnitId(e.targetselection.unitId))

      // TODO share via event -> build into action data model
      const attackerLuck = Math.round(100 * Math.random())
      const defenderLuck = Math.round(100 * Math.random())

      exports.guard(exports.isInteger(attackerLuck))
      exports.guard(exports.isBetween(0, 100, attackerLuck))
      exports.guard(exports.isInteger(defenderLuck))
      exports.guard(exports.isBetween(0, 100, defenderLuck))

      var a = model.unit_data[e],
        r = model.unit_data[t],
        l = model.battle_isIndirectUnit(e);
      if (!l && 1 === controller.scriptedValue(r.owner, "firstCounter", 0) && !model.battle_isIndirectUnit(t)) {
        var i = r;
        r = a, a = i
      }
      var d, s = a.type,
        c = r.type,
        m = a.owner,
        u = r.owner,
        _ = model.unit_convertHealthToPoints(r),
        p = model.unit_convertHealthToPoints(a),
        f = model.battle_canUseMainWeapon(a, r);
      d = model.battle_getBattleDamageAgainst(a, r, o, f, !1) - 1 !== d && (model.events.damageUnit(t, d), _ -= model.unit_convertHealthToPoints(r) f && a.ammo--
        _ = parseInt(.1 * _ * c.cost, 10) model.events.co_modifyPowerLevel(m, parseInt(.5 * _, 10)) model.events.co_modifyPowerLevel(u, _))
      r.hp > 0 && !model.battle_isIndirectUnit(t) && (
        f = model.battle_canUseMainWeapon(r, a), d = model.battle_getBattleDamageAgainst(r, a, n, f, !0), -1 !== d && (model.events.damageUnit(e, d), p -= model.unit_convertHealthToPoints(a), f && r.ammo--, p = parseInt(.1 * p * s.cost, 10), model.events.co_modifyPowerLevel(u, parseInt(.5 * p, 10)), model.events.co_modifyPowerLevel(m, p)))
    }
  }

  /**
    Sucuide features allows units to do a suicide move to
    hurt surrounding units.
   */
  exports.suicide = {

    /**
      @returns true if the unit can explode, false otherwise
     */
    canExplode: (unit) => !!unit.type.suicide,

    /**
      @param unit that will explode
     */
    explode(unit) {
      controller.commandStack_sharedInvokement("unit_destroySilently", e.source.unitId)
      controller.commandStack_sharedInvokement("explode_invoked", e.target.x, e.target
        .y, e.source.unit.type.suicide.range, model.unit_convertPointsToHealth(e
          .source.unit.type.suicide.damage), e.source.unit.owner)

    }
  }

  exports.fog = {
    /*
      model.fog_turnOwnerData = util.matrix(100, 100, 0),
      model.fog_clientData = util.matrix(100, 100, 0),
      model.fog_visibleClientPids = util.list(4, !1),
      model.fog_visibleTurnOwnerPids = util.list(4, !1),
    */

    modifyVision(tile, fogModel) {
      if (-1 !== o && controller.configValue("fogEnabled")) {
        assert(model.map_isValidPosition(e, t)), assert(util.isInt(n) && n >= 0), controller.prepareTags(e, t), n > 0 && (n = controller.scriptedValue(o, "vision", n));
        var r = model.fog_visibleClientPids[o],
          l = model.fog_visibleTurnOwnerPids[o];
        if (r || l)
          if (0 === n) r && (model.fog_clientData[e][t] += a), l && (model.fog_turnOwnerData[e][t] += a);
          else {
            var i, d, s = model.map_height,
              c = model.map_width,
              m = t - n,
              u = t + n;
            for (0 > m && (m = 0), u >= s && (u = s - 1); u >= m; m++) {
              var _ = Math.abs(m - t);
              for (i = e - n + _, d = e + n - _, 0 > i && (i = 0), d >= c && (d = c - 1); d >= i; i++) model.map_data[i][m].blocksVision && model.map_getDistance(e, t, i, m) > 1 || (r && (model.fog_clientData[i][m] += a), l && (model.fog_turnOwnerData[i][m] += a))
            }
          }
      }
    },

    recalculate(map, owner, fogModel) {
      var e, t, o = model.map_width,
        n = model.map_height,
        a = 1 === controller.configValue("fogEnabled");
      for (e = 0; o > e; e++)
        for (t = 0; n > t; t++) a ? (model.fog_clientData[e][t] = 0, model.fog_turnOwnerData[e][t] = 0) : (model.fog_clientData[e][t] = 1, model.fog_turnOwnerData[e][t] = 1);
      if (a) {
        var r;
        for (e = 0; o > e; e++)
          for (t = 0; n > t; t++) {
            var l = model.unit_posData[e][t];
            null !== l && (r = l.type.vision, 0 > r && (r = 0), model.events.modifyVisionAt(e, t, l.owner, r, 1));
            var i = model.property_posMap[e][t];
            null !== i && (r = i.type.vision, 0 > r && (r = 0), model.events.modifyVisionAt(e, t, i.owner, r, 1))
          }
      }

      var t = model.player_data[e].team;
      model.client_instances[e] && (model.client_lastPid = e);
      for (var o = model.client_lastPid, n = 0, a = 4; a > n; n++) model.fog_visibleClientPids[
        n] = !1, model.fog_visibleTurnOwnerPids[n] = !1, -1 !== model.player_data[
        n].team && (model.player_data[n].team === o && (model.fog_visibleClientPids[
        n] = !0), model.player_data[n].team === t && (model.fog_visibleTurnOwnerPids[
        n] = !0));
      model.events.recalculateFogMap()
    }
  }

  exports.specialProperties = {

    isCannon: cannon => "CANNON_UNIT_INV" === cannon.type.ID,

    canFireCannon(cannon) {
      cwt.guard(exports.specialProperties.isCannon(cannon))

      // TODO
      return model.bombs_markCannonTargets(e, t)
    },

    getCannonTargets(map, cannon) {

      return []
    },

    fireCannon(cannon) {
      // TODO
      const unit = model.unit_posData[e.targetselection.x][e.targetselection.y]
      const cannonType = model.bombs_grabPropTypeFromPos(e.target.x, e.target.y)

      model.events.damageUnit(
        model.unit_extractId(unit),
        model.unit_convertPointsToHealth(cannonType.cannon.damage), 9)
    },

    isLaser: e => "LASER_UNIT_INV" === model.unit_data[e].type.ID,

    fireLaser(laser) {
      // TODO
      var o = model.property_posMap[e][t];
      assert(o);
      var n = e,
        a = t,
        r = o.owner;
      for (e = 0, xe = model.map_width; xe > e; e++)
        for (t = 0, ye = model.map_height; ye > t; t++)
          if (n === e || a === t) {
            var l = model.unit_posData[e][t];
            l && l.owner !== r && model.events.damageUnit(model.unit_extractId(l), model.unit_convertPointsToHealth(o.type.laser.damage), 9)
          }
    },

    tryToMarkCannonTargets(e, t, o, n, a, r, l, i, d, s, c) {
      assert(model.player_isValidPid(e));
      for (var m = model.player_data[e].team, u = i, _ = !1; d >= l; l++)
        for (i = u; i >= s; i--)
          if (model.map_isValidPosition(l, i) && !(Math.abs(l - o) + Math.abs(i - n) > c || Math.abs(l - a) + Math.abs(i - r) > c || model.fog_turnOwnerData[l][i] <= 0)) {
            var p = model.unit_posData[l][i];
            p && p.owner !== e && model.player_data[p.owner].team !== m && (t.setValueAt(l, i, 1), _ = !0)
          }
      return _
    },

    markCannonTargets(e, t) {
      var o, n = model.unit_data[e],
        a = model.property_posMap[n.x][n.y],
        r = "PROP_INV" !== a.type.ID ? a.type : model.bombs_grabPropTypeFromPos(n.x, n.y);
      assert(r.cannon), t.setCenter(n.x, n.y, -1);
      var l = r.cannon.range;
      switch (r.cannon.direction) {
        case "N":
          o = model.bombs_tryToMarkCannonTargets(n.owner, t, n.x, n.y, n.x, n.y - l - 1, n.x - n + 1, n.y - 1, n.x + n - 1, n.y - l, l);
          break;
        case "E":
          o = model.bombs_tryToMarkCannonTargets(n.owner, t, n.x, n.y, n.x + l + 1, n.y, n.x + 1, n.y + l - 1, n.x + l, n.y - l + 1, l);
          break;
        case "W":
          o = model.bombs_tryToMarkCannonTargets(n.owner, t, n.x, n.y, n.x - l - 1, n.y, n.x - l, n.y + l - 1, n.x - 1, n.y - l + 1, l);
          break;
        case "S":
          o = model.bombs_tryToMarkCannonTargets(n.owner, t, n.x, n.y, n.x, n.y + l + 1, n.x - l + 1, n.y + l, n.x + l - 1, n.y + 1, l)
      }
      return o
    },

    grabPropTypeFromPos(e, t) {
      for (;;) {
        if (!(t + 1 < model.map_height && model.property_posMap[e][t + 1] && "PROP_INV" === model.property_posMap[e][t + 1].type.ID)) break;
        t++
      }
      if ("PROP_INV" !== model.property_posMap[e][t].type.ID) return model.property_posMap[e][t].type;
      for (;;) {
        if (e + 1 < model.map_width && model.property_posMap[e + 1][t] && "PROP_INV" !== model.property_posMap[e + 1][t].type.ID) return model.property_posMap[e + 1][t].type;
        break
      }
      assert(!1)
    },

    isSilo: (property) => !!property.type.rocketsilo,

    isSiloFireableBy(unit, property) {
      exports.guard(exports.specialProperties.isSilo(property))
      return property.type.rocketsilo.fireable.includes(unit.type.ID)
    },

    fireSilo(launchingUnit, silo, targetPosition) {
      // TODO
      let x = e.target.x
      let y = e.target.y
      let tx = e.targetselection.x
      let ty = e.targetselection.y
      let r = model.property_posMap[x][y]
      let l = model.property_extractId(r)
      let i = r.type
      let d = i.rocketsilo.range
      let s = model.unit_convertPointsToHealth(i.rocketsilo.damage)

      // TODO
      model.events.property_changeType(l, model.data_tileSheets[i.changeTo])
      model.events.rocketFly(e, t, tx, ty)
      model.events.explode_invoked(tx, ty, d, s, e.source.unit.owner)
      model.events.dayEvent(5, "property_changeTypeById", l, model.data_propertyTypes
        .indexOf(i))
    },

    emptifySilo(types, silo) {
      // TODO
      silo.type = types.find(t => t.id === "PSLE")
    }

    refillSilo(types, silo) {
      // TODO
      silo.type = types.find(t => t.id === "PSLO")
    }
  }

  exports.transport = {

    isTransporter(unit) {
      //TODO
    },

    hasLoads(unit) {
      //TODO
    },

    canLoad(transporter, load) {
      return !$.Stream([
        exports.greaterThan(model.unit_data[e].type.maxloads, 0),
        exports.notEqual(e.source.unitId, e.target.unitId),
        exports.notEqual(sourceUnit.loadedIn, e.target.unitId),
        exports.notEqual(targetUnit.loadedIn + 1 + targetUnit.type.maxloads, 0),
        exports.notEqual(exports.includes(sourceUnit.type.movetype, targetUnit.type.canload))
      ]).includes(false)
    },

    load(transporter, load) {
      load.loadedIn = transporter.id
      transporter.loadedIn -= 1
    },

    canUnload(transporter, load, direction) {
      let e = data.source.unitId
      let t = data.target.x
      let o = data.target.y
      var n, a = model.unit_data[e],
        r = a.owner;

      if (!model.transport_isTransportUnit(e) || !model.transport_hasLoads(e)) return !1;
      for (var l = model.unit_firstUnitId(r), i = model.unit_lastUnitId(r); i >= l; l++)
        if (n = model.unit_data[l], -1 !== n.owner && n.loadedIn === e) {
          var d = model.data_movetypeSheets[n.type.movetype];
          if (model.move_canTypeMoveTo(d, t - 1, o)) return;
          if (model.move_canTypeMoveTo(d, t + 1, o)) return;
          if (model.move_canTypeMoveTo(d, t, o - 1)) return;
          if (model.move_canTypeMoveTo(d, t, o + 1)) return
        }
      return !1
    },

    getSuitableUnloads(transporter) {
      // TODO

      let e = data.source.unitId
      let t = data.target.x,
        let o = data.target.y
      let n = data.menu

      for (var a, r = model.unit_data[e], l = r.owner, i = model.unit_firstUnitId(l), d = model.unit_lastUnitId(l); d >= i; i++)
        if (a = model.unit_data[i], -1 !== a.owner && a.loadedIn === e) {
          var s = model.data_movetypeSheets[a.type.movetype];
          (model.move_canTypeMoveTo(s, t - 1, o) || model.move_canTypeMoveTo(s, t + 1, o) || model.move_canTypeMoveTo(s, t, o - 1) || model.move_canTypeMoveTo(s, t, o + 1)) && n.addEntry(i, !0)
        }
    },

    getUnloadTargets(transporter) {
      // TODO
      var r = model.data_movetypeSheets[model.unit_data[e.action.selectedSubEntry].type.movetype];
      let t = e.target.x
      let o = e.target.y

      model.move_canTypeMoveTo(r, t - 1, o) &&
        a.setValueAt(t - 1, o, 1)

      model.move_canTypeMoveTo(r, t + 1, o) &&
        a.setValueAt(t + 1, o, 1)

      model.move_canTypeMoveTo(r, t, o - 1) &&
        a.setValueAt(t, o - 1, 1)

      model.move_canTypeMoveTo(r, t, o + 1) &&
        a.setValueAt(t, o + 1, 1)
    }

    unload(transporter, load, direction) {
      let e = e.source.unitId
      let t = e.target.x
      let o = e.target.y
      let n = e.action.selectedSubEntry
      let a = e.targetselection.x
      let r = e.targetselection.y
      if (assert(model.unit_data[n].loadedIn === e), -1 === a || -1 === r || model.unit_posData[a][r]) return controller.stateMachine.data.breakMultiStep = !0, void 0;
      model.unit_data[n].loadedIn = -1, model.unit_data[e].loadedIn++;
      var l;
      t > a ? l = model.move_MOVE_CODES.LEFT : a > t ? l = model.move_MOVE_CODES.RIGHT : o > r ? l = model.move_MOVE_CODES.UP : r > o && (l = model.move_MOVE_CODES.DOWN), controller.commandStack_localInvokement("move_clearWayCache"), controller.commandStack_localInvokement("move_appendToWayCache", l), controller.commandStack_localInvokement("move_moveByCache", n, t, o, 1), controller.commandStack_localInvokement("wait_invoked", n)
    }
  }

  exports.production = {

    isFactory: (property) => !!property.type.builds,

    canProduce(model, property) {
      exports.guard(exports.production.isFactory(property))
      return model.manpower_data[property.owner] > 0 &&
        model.unit_data.filter(unit => unit.owner === property.owner).length < 50
    },

    getProducableTypes: (model, property) => model
      .data_unitSheets
      .filter(sheet => property.type.builds.includes(sheet.movetype))
      .filter(sheet => sheet.cost <= model.player_data[property.owner].gold)
      .map(sheet => sheet.ID),

    produce(units, factory, type) {
      $.guard(exports.factory.canProduce( ? ? ? , factory))

      // TODO change usable system

      const newUnit = units.find(u => !u.owner)
      $.guard(!!newUnit)

      newUnit.hp = 99
      newUnit.owner = factory.owner
      newUnit.type = type
      newUnit.ammo = type.ammo
      newUnit.fuel = type.fuel
      newUnit.loadedIn = -1
      newUnit.x = factory.x
      newUnit.y = factory.y

      // TODO model.manpower_data[model.property_posMap[e][t].owner]--

      // TODO
      var n = model.property_posMap[e][t],
        a = model.data_unitSheets[o].cost,
        r = model.player_data[n.owner];
      r.gold -= a, assert(r.gold >= 0), model.events.createUnit(model.unit_getFreeSlot(n.owner), n.owner, e, t, o)

      exports.client.events.onUnitCreated(type.ID, factory.x, factory.y)
    }
  }

  exports.usable = {
    isUsable: (model, unit) => model.actions_leftActors[unit.id - unit.owner * 50],
    setUsable: (model, unit) => model.actions_leftActors[unit.id - unit.owner * 50] = true,
    setUnusable: (model, unit) => model.actions_leftActors[unit.id - unit.owner * 50] = false
  }

  exports.capture = {

    canBeCapturedBy(model, property, unit) {
      if (model.player_data[unit.owner].team == model.player_data[property.owner].team) {
        return false
      }
      return property.type.capturePoints > 0 && unit.type.captures > 0
    },

    capture(property, unit) {
      cwt.guard(exports.capture.canBeCapturedBy(property, unit))

      // TODO
      assert(model.property_isValidPropId(e)), assert(model.unit_isValidUnitId(t));
      var o = model.unit_data[e.source.unitId],
        n = model.property_data[e.target.propertyId],
        a = parseInt(o.hp / 10, 10) + 1;

      if (a = parseInt(a * controller.scriptedValue(o.owner, "captureRate", 100) / 100, 10), n.capturePoints -= a, n.capturePoints <= 0) {
        var r = n.x,
          l = n.y;
        if (model.events.modifyVisionAt(r, l, n.type.vision, 1), n.type.looseAfterCaptured === !0) {
          var i = n.owner;

          // e === i
          assert(model.property_isValidPropId(e));
          var t, o;
          for (t = model.unit_firstUnitId(e), o = model.unit_lastUnitId(e); o > t; t++) - 1 !== model.unit_data[t].owner && model.events.destroyUnit(t);
          for (t = 0, o = model.property_data.length; o > t; t++) {
            var n = model.property_data[t];
            if (n.owner === e) {
              n.owner = -1;
              var a = n.type.changeAfterCaptured;
              a && model.events.property_changeType(t, a)
            }
          }
          model.player_data[e].team = -1, model.player_areEnemyTeamsLeft() || controller.commandStack_localInvokement("player_noTeamsAreLeft")

        }
        var d = n.type.changeAfterCaptured;
        "undefined" != typeof d && model.events.property_changeType(e, d), n.capturePoints = 20, n.owner = o.owner;
        var s = controller.configValue("captureLimit");
        0 !== s && model.countProperties() >= s && controller.update_endGameRound()
      }
    }
  }

  exports.weather = {

    /**
      @effect
    */
    set(weatherModel, newType) {
      const randomInteger = (from, to) => from + Math.trunc(Math.random() * (to - from))

      weatherModel.active = newType
      weatherModel.leftDays = randomInteger(newType.duration.min, newType.duration.max)
      exports.client.events.onWeatherChanged(newType.id)
    },

    /**

    */
    pickRandomWeather(weatherModel) {
      var e, t;
      if (assert(controller.isHost()), null !== model.weather_data && model.weather_data === model.data_defaultWeatherSheet) {
        var o = model.data_nonDefaultWeatherTypes;
        e = o[parseInt(Math.random() * o.length, 10)].ID, t = 1
      } else e = model.data_defaultWeatherSheet.ID,
        t = controller.configValue("weatherMinDays") +
        parseInt(controller.configValue("weatherRandomDays") * Math.random(), 10);
      controller.commandStack_sharedInvokement("weather_change", e),
        model.events.dayEvent(t, "weather_calculateNext")
    }
  }

  exports.move = {

    getMovemap() {

    },

    getMoveway(map, unit, source, target) {

    },

    getFuelCosts(map, unit, way) {

    },

    move(map, unit, way) {

    }

    model.move_pathCache = util.list(15, -1),
    model.move_getMoveCosts = function (e, t, o) {
      assert(model.map_isValidPosition(t, o));
      var n, a;
      return a = model.property_posMap[t][o], n = a ? a.type.blocker ? -1 : e.costs[a.type.ID] : e.costs[model.map_data[t][o].ID], "number" == typeof n ? n : (n = e.costs["*"], "number" == typeof n ? n : -1)
    },
    model.move_canTypeMoveTo = function (e, t, o) {
      return model.map_isValidPosition(t, o) ? -1 === model.move_getMoveCosts(e, t, o) ? !1 : 0 === model.fog_turnOwnerData[t][o] ? !0 : null !== model.unit_posData[t][o] ? !1 : !0 : void 0
    },
    model.move_codeFromAtoB = function (e, t, o, n) {
      return assert(model.map_isValidPosition(e, t)), assert(model.map_isValidPosition(o, n)), assert(1 === model.map_getDistance(e, t, o, n)), o > e ? model.move_MOVE_CODES.RIGHT : e > o ? model.move_MOVE_CODES.LEFT : n > t ? model.move_MOVE_CODES.DOWN : t > n ? model.move_MOVE_CODES.UP : null
    },
    model.move_generatePath = function (e, t, o, n, a, r) {
      assert(model.map_isValidPosition(e, t)), assert(model.map_isValidPosition(o, n));
      var l, i = new Graph(a.data),
        d = e - a.centerX,
        s = t - a.centerY,
        c = i.nodes[d][s],
        m = o - a.centerX,
        u = n - a.centerY,
        _ = i.nodes[m][u],
        p = astar.search(i.nodes, c, _),
        f = e,
        v = t;
      r.resetValues();
      for (var h = 0, y = 0, g = p.length; g > y; y++) {
        l = p[y];
        var T;
        l.x > f ? T = model.move_MOVE_CODES.RIGHT : l.x < f ? T = model.move_MOVE_CODES.LEFT : l.y > v ? T = model.move_MOVE_CODES.DOWN : l.y < v ? T = model.move_MOVE_CODES.UP : util.expect(util.expect.isTrue, !1), r[h] = T, h++, f = l.x, v = l.y
      }
    },
    model.move_addCodeToPath = function (e, t) {
      assert(util.intRange(e, model.move_MOVE_CODES.UP, model.move_MOVE_CODES.LEFT));
      var o, n = t.getLastCode();
      switch (e) {
        case model.move_MOVE_CODES.UP:
          o = model.move_MOVE_CODES.DOWN;
          break;
        case model.move_MOVE_CODES.DOWN:
          o = model.move_MOVE_CODES.UP;
          break;
        case model.move_MOVE_CODES.LEFT:
          o = model.move_MOVE_CODES.RIGHT;
          break;
        case model.move_MOVE_CODES.RIGHT:
          o = model.move_MOVE_CODES.LEFT
      }
      if (n === o) return t[t.getSize() - 1] = -1, !0;
      var a = controller.stateMachine.data.source,
        r = a.unit,
        l = r.fuel,
        i = 0,
        d = r.type.range;
      d > l && (d = l), t[t.getSize()] = e;
      for (var s = a.x, c = a.y, m = 0, u = t.getSize(); u > m; m++) {
        switch (t[m]) {
          case model.move_MOVE_CODES.UP:
            c--;
            break;
          case model.move_MOVE_CODES.DOWN:
            c++;
            break;
          case model.move_MOVE_CODES.LEFT:
            s--;
            break;
          case model.move_MOVE_CODES.RIGHT:
            s++
        }
        i += controller.stateMachine.data.selection.getValueAt(s, c)
      }
      return i > d ? (t[t.getSize() - 1] = -1, !1) : !0
    },
    model.move_move_fillMoveMapHelper_ = [],
    model.move_fillMoveMap = function (e, t, o, n, a) {
      var r;
      "number" != typeof o && (o = e.x), "number" != typeof n && (n = e.y), a || (a = e.unit), assert(model.map_isValidPosition(o, n));
      var l, i = !1;
      null !== model.move_move_fillMoveMapHelper_ ? (l = model.move_move_fillMoveMapHelper_, model.move_move_fillMoveMapHelper_ = null, i = !0) : l = [];
      var d = model.data_movetypeSheets[a.type.movetype],
        s = model.player_data[a.owner];
      controller.prepareTags(o, n, model.unit_extractId(a));
      var c = controller.scriptedValue(a.owner, "moverange", a.type.range);
      a.fuel < c && (c = a.fuel), t.setCenter(o, n, -1), t.setValueAt(o, n, c), l[0] = o, l[1] = n, l[2] = c;
      for (var m = [-1, -1, -1, -1, -1, -1, -1, -1];;) {
        for (var u = -1, _ = -1, p = 0, f = l.length; f > p; p += 3) {
          var v = l[p + 2];
          void 0 !== v && null !== v && (-1 === u || v > u) && (u = v, _ = p)
        }
        if (-1 === _) break;
        var h = l[_],
          y = l[_ + 1],
          g = l[_ + 2];
        l[_] = null, l[_ + 1] = null, l[_ + 2] = null, h > 0 ? (m[0] = h - 1, m[1] = y) : (m[0] = -1, m[1] = -1), h < model.map_width - 1 ? (m[2] = h + 1, m[3] = y) : (m[2] = -1, m[3] = -1), y > 0 ? (m[4] = h, m[5] = y - 1) : (m[4] = -1, m[5] = -1), y < model.map_height - 1 ? (m[6] = h, m[7] = y + 1) : (m[6] = -1, m[7] = -1);
        for (var T = 0; 8 > T; T += 2)
          if (-1 !== m[T]) {
            var E = m[T],
              S = m[T + 1];
            if (r = model.move_getMoveCosts(d, E, S), -1 !== r) {
              var I = model.unit_posData[E][S];
              if (null !== I && model.fog_turnOwnerData[E][S] > 0 && !I.hidden && model.player_data[I.owner].team !== s.team) continue;
              var k = g - r;
              if (k >= 0 && k > t.getValueAt(E, S)) {
                t.setValueAt(E, S, k);
                for (var p = 0, f = l.length; f >= p; p += 3)
                  if (null === l[p] || p === f) {
                    l[p] = E, l[p + 1] = S, l[p + 2] = k;
                    break
                  }
              }
            }
          }
      }
      if (i) {
        for (var O = 0, A = l.length; A > O; O++) l[O] = null;
        model.move_move_fillMoveMapHelper_ = l
      }
      for (o = 0, xe = model.map_width; xe > o; o++)
        for (n = 0, ye = model.map_height; ye > n; n++) - 1 !== t.getValueAt(o, n) && (r = model.move_getMoveCosts(d, o, n), t.setValueAt(o, n, r))
    },
    model.move_trapCheck = function (e, t, o) {
      for (var n, a, r = t.x, l = t.y, i = model.player_data[t.unit.owner].team, d = 0, s = e.length; s > d && -1 !== e[d]; d++) {
        switch (e[d]) {
          case model.move_MOVE_CODES.DOWN:
            l++;
            break;
          case model.move_MOVE_CODES.UP:
            l--;
            break;
          case model.move_MOVE_CODES.LEFT:
            r--;
            break;
          case model.move_MOVE_CODES.RIGHT:
            r++
        }
        var c = model.unit_posData[r][l];
        if (c) {
          if (i !== model.player_data[c.owner].team) return o.set(n, a), e[d] = -1, !0
        } else n = r, a = l
      }
      return !1
    },

    model.event_on("move_flushMoveData", function (e, t) {
      controller.commandStack_sharedInvokement("move_clearWayCache");
      for (var o = 0, n = e.length; n > o && -1 !== e[o]; o += 6) controller.commandStack_sharedInvokement("move_appendToWayCache", e[o], e[o + 1], e[o + 2], e[o + 3], e[o + 4], e[o + 5]);
      controller.commandStack_sharedInvokement("move_moveByCache", t.unitId, t.x, t.y, 0)
    })

    model.event_on("move_clearWayCache", function () {
      model.move_pathCache.resetValues()
    })

    model.event_on("move_appendToWayCache", function () {
      for (var e = 0; - 1 !== model.move_pathCache[e];) e++, e >= 15 && assert(!1);
      for (var t = 0; t < arguments.length;) model.move_pathCache[e] = arguments[t], t++, e++, e >= 15 && assert(!1)
    })

    model.event_on("move_moveByCache", function (e, t, o, n) {
      for (var a = model.move_pathCache, r = t, l = o, i = model.unit_data[e], d = i.type, s = model.data_movetypeSheets[d.movetype], c = !1, m = (a.length - 1, 0), u = 0, _ = a.length; _ > u && -1 !== a[u]; u++) {
        switch (a[u]) {
          case model.move_MOVE_CODES.UP:
            0 === l && (c = !0), l--;
            break;
          case model.move_MOVE_CODES.RIGHT:
            r === model.map_width - 1 && (c = !0), r++;
            break;
          case model.move_MOVE_CODES.DOWN:
            l === model.map_height - 1 && (c = !0), l++;
            break;
          case model.move_MOVE_CODES.LEFT:
            0 === r && (c = !0), r--
        }
        assert(!c), n !== !0 && (m += model.move_getMoveCosts(s, r, l))
      }
      i.fuel -= m, assert(i.fuel >= 0), i.x >= 0 && i.y >= 0 && model.events.clearUnitPosition(e), null === model.unit_posData[r][l] && model.events.setUnitPosition(e, r, l)
    }),
    function () {
      function e(e, t, o) {
        var n = model.unit_data[e];
        n.x = t, n.y = o, model.unit_posData[t][o] = n, model.events.modifyVisionAt(t, o, n.owner, n.type.vision, 1)
      }
      model.event_on("setUnitPosition", e), model.event_on("createUnit", function (t, o, n, a) {
        e(t, n, a)
      })
    }()

    model.event_on(["clearUnitPosition", "destroyUnitSilent"], function (e) {
      var t = model.unit_data[e],
        o = t.x,
        n = t.y;
      model.events.modifyVisionAt(o, n, t.owner, t.type.vision, -1), model.unit_posData[o][n] = null, t.x = -t.x, t.y = -t.y
    })

    model.event_on("move_moveByCache", function (e, t, o) {
      var n = model.property_posMap[t][o];
      n && (n.capturePoints = 20)
    })
  }

  exports.ai = {

    enabled: false,

    isActiveForPlayer: exports.noop,

    activateForPlayer: exports.noop,

    about: () => "DumbBoy 0.0.1",

    init() {
      exports.ai.enabled = true
      exports.ai.about = exports.always("ai-dumbBoy 0.0.1")
    }
  }

  /**
    game logic mediator service which coordinates the
    access of actions into the different logic modules.
   */
  exports.actions = {

      /*====================================================*/

      const getPropertyActions = (transition, data, actionData) => {
        const property = actionData.source.property
        const sourceUnit = actionData.source.unit

        if (!sourceUnit) return {}
        if (!property) return {}

        return {
          produce: exports.production.isFactory(property) &&
            exports.production.canProduce(model, property),

          propertyTransfer: exports.transfer.canDoPropertyTransfer(property)
        }
      }

      const getUnitActions = (transition, data, unitActionData) => {
        const actionData = unitActionData.actionData
        const moveData = unitActionData.moveData
        const sourceUnit = actionData.source.unit

        if (!sourceUnit) return {}

        const targetUnit = actionData.target.unit
        const targetProperty = actionData.target.property
        const unitAtTarget = !!targetUnit
        const propertyAtTarget = !!targetProperty
        const canAct = exports.usable.isUsable(sourceUnit)

        if (!canAct) return {}

        return {

          attack:
            // TODO
            exports.every(exports.isTruthy, [
                  model.round_day < controller.configValue("daysOfPeace"), !model.battle_isIndirectUnit(e.source.unitId) || exports.notEqual(-1, e.movePath.data[0]),
                  model.battle_calculateTargets(e.source.unitId, e.target.x, e.target.y)
                ]),
          exports.battle.calculateTargets().length > 0,

          fireLaser: exports.specialProperties.isLaser(sourceUnit),

          fireSilo: propertyAtTarget &&
            exports.specialProperties.isSilo(targetProperty) &&
            exports.specialProperties.isSiloFireableBy(sourceUnit, targetProperty),

          unitHide: exports.stealth.isStealthUnit(sourceUnit) &&
            exports.stealth.canHide(sourceUnit),

          unitReveal: exports.stealth.isStealthUnit(sourceUnit) &&
            exports.stealth.canReveal(sourceUnit),

          join: unitAtTarget &&
            exports.join.canJoin(model.unit_data[actionData.source.unitId], model.unit_data[actionData.target.unitId]),

          supply:
            !unitAtTarget &&
            supply.isSupplier(sourceUnit) &&
            supply.canSupplyAtPositon(
              model.map_data,
              sourceUnit, {
                x: actionData.target.x,
                y: actionData.target.y
              }),

          explode:
            !unitAtTarget &&
            exports.explode.canExplode(sourceUnit),

          wait: !unitAtTarget
        }
      }

      const getSubMenu = (transition, data, actionData) => {
        if (actionData.action === "produce") {
          const ownerGold =
            return model.data_unitSheets.some(sheet => )
          var n = model.property_data[e];
          assert(model.player_isValidPid(n.owner));
          for (var a = model.player_data[n.owner].gold, r = model.data_unitTypes, l = n.type.builds, i = 0, d = r.length; d > i; i++) {
            var s = r[i],
              c = model.data_unitSheets[s]; - 1 !== l.indexOf(c.movetype) && (c.cost <= a || o) && t.addEntry(s, c.cost <= a)
          }
        } else if (["propertyTransfer", "unitTransfer"].includes(actionData.action)) {
          return exports.transfer.getTransferTargetPlayers(
            model.player_data,
            model.player_data[actionData.source.property.owner])
        }
        return []
      }

      // TODO exports.battle.calculateTargets().length > 0
      const getTargetSelection = (transition, data, actionData) => ({
        needed: actionData.action === "fireSilo",
        freestyle: true,
        targets: actionData.action === "fireSilo" ? null : []
      })

      const getMapActions = (transition, data, actionData) => ({
        activateCoPower: exports.co.isCoPActivatable(model, model.round_turnOwner),
        activateSuperCoPower: exports.co.isSCoPActivatable(model, model.round_turnOwner),
        moneyTransfer: exports.transfer.canTransferMoney(model.turn.owner),
        toOptions: true,
        endTurn: true
      })

      const nx = actionData.get("x")
      const ny = actionData.get("y")

      $.guard(model.map_isValidPosition(nx, ny))

      const noPositionSelected = pos => pos.x == -1 && pos.y == -1

      const position = Switch()
        .Case(noPositionSelected(data.uiData.source), data.uiData.source)
        .Case(noPositionSelected(data.uiData.target), data.uiData.target)
        .Default(data.uiData.targetselection)

      $.guard(noPositionSelected(position))
      position.x = nx
      position.y = ny

      return Switch(position)
        .Case(pos => pos === data.uiData.source, {
          // TODO move
          move: {
            map: []
          }
        })
        .Case(pos => pos === data.uiData.target, {
          // TODO set move path if unit exists
        })
        .Default({

        })
    },

    clickAction(transition, data, actionData) {
      const action = actionData.get("actionKey")
      cwt.guard(!!action) // TODO check key

      cwt.guard(!data.uiData.action.key || !data.uiData.action.subKey)

      const targetProperty = !data.uiData.action.key ? "subKey" : "key"
      data.uiData.action[targetProperty] = action

      return {

      }
    },

    /*====================================================*/

    pushAction: (world, actionData) => {
      // TODO
      exports.client.debug("push command into buffer", actionData)
      world.commands.push(JSON.stringify({
        key: actionData.key,
        data: actionData
      }))
    },

    handleEndTurn: (world, action) => {

      exports.client.debug("player " + world.turn.owner.id + " ends it turn now")

      const dayChanged = exports.turn.endTurn(world)

      if (dayChanged) {

        exports.client.debug("day changed, now it's day " + exports.turn.day)

        const nextAsyncCommands = exports.async.tick(world.async)

        if (nextAsyncCommands.length > 0) {
          exports.client.debug("found async commands which has to be invoked")

          nextAsyncCommands.forEach(command => {
            exports.client.debug("evaluate async command", command)
            // TODO
          })
        }
      }

      exports.client.debug("set turn owner")
      world.turn.owner = turnOwner

      exports.client.debug("reset turn timer")
      world.turn.limits.leftTurnTime = 0

      exports.client.debug("player " + turnOwner.id + " starts it turn now")

      exports.client.debug("calculating fog map")
      exports.fog.recalculate(world.map, world.turn.owner, world.turn.owner.visionMap)

      const turnOwnerProperties = world.properties.filter(prop => prop.owner == player)

      // TODO config
      export.client.debug("raising funds from properties")
      turnOwnerProperties.forEach(exports.supply.raiseFunds)

      export.client.debug("check supply units for automatical supply")
      world
        .units
        .filter(exports.supply.isSupplier)
        .filter(exports.supply.canSupplyNeighbours.bind(null, world.map))
        .map(unit => {
          exports.client.debug("unit " + unit.id + " is going to supply neighbours")
          return unit
        })
        .forEach(exports.supply.supplyNeighbours)

      // TODO repair

      exports.client.debug("going to drain fuel on turnowner units")
      world.units
        .filter(ownable => ownable.owner == turnOwner)
        // TODO
        .map(tap(exports.supply.drainFuel))
        .filter(unit => unit.fuel <= 0)
        .forEach(..destory..)

      exports.client.debug("put units into usable list")
      world.usables = world.units
        .filter(ownable => ownables.owner == world.turn.owner)
        .map(unit => unit.id)
    },

    handleAttack: niyError,
    handleFireLaser: niyError,
    handleUnitHide: niyError,
    handleUnitReveal: niyError,
    handleJoin: niyError,
    handleWait: niyError,
    handleProduce: niyError,
    handleFireSilo: niyError,
    handleSupply: niyError,
    handleMoneyTransfer: niyError,
    handlePropertyTransfer: niyError,

    handleNextCommand(world) {
      const commands = world.commands

      if (exports.commands.hasItems(commands)) {
        exports.client.debug("no commands in buffer, skip command handling")
        return
      }
      exports.client.debug("command in buffer, handle it")

      const commandData = exports.commands.getNext(commands)
      let action = exports.action_objects[command.key]
      if (exports.isFalsy(action)) return ["invalid-action"]

      const actionKey = commandData.key
      const actionData = {
        source: exports.model.position(commandData.sx, commandData.sy),
        // TODO
        sourceUnit: null,
        sourceProperty: null,
        target: exports.model.position(commandData.tx, commandData.ty),
        // TODO
        targetUnit: null,
        targetProperty: null,
        targetselection: exports.model.position(commandData.stx, commandData.sty)
      }

      const actionIdentifier = [
            "handle",
            actionKey.substring(0, 1).toUpperCase(),
            actionKey.substring(1)
      ].join("")

      const action = exports.actions[actionIdentifier]
      exports.guard(action)

      action(world, actionData)
    }
}

exports.screen = {

  define(data) {
    let screens = {}
    exports.guard(exports.isUndefined(screens[data.id]))
  },

  doAction(name, ...args) {

  },

  open(screenName) {
    exports.client.debug("game:open-screen:" + screenName)

    // TODO
    let activeScreen
    let screens = {}
    let changeEvent = exports.eventBus()

    exports.guard(screenName != activeScreen)

    activeScreen = screenName

    const screen = screens[screenName]

    // notify client about the new screen
    // TODO refill layout data
    exports.client.onScreenOpened(screenName, screen.layout)

    screen.onenter(exports.screen.open, screen.data)
  },

  init() {

    // some helpers =)
    const element = type => content => [type, content]
    const box = content => element("box")
    const header = value => element("header")
    const text = value => element("text")
    const whenDefined = (property, content) => ["if:exists", property, content]

    exports.screen.define({
      id: "ERROR",
      layout: [
          box([

            header("$header"),

            text("$message"),
            whenDefined("$location", [
              text(exports.client.translated("source")),
              text("$location")
            ]),

            ["spacer"],
            ["button", exports.client.translated("restart"), "restart"]
          ])
        ],
      data: {
        header: "",
        message: "",
        location: ""
      },
      action: {
        restart: () => exports.client.restart()
      },
      onenter(transition, data, eventData) {
        data.header = cwt.getOr(eventData.header, "")
        data.message = cwt.getOr(eventData.message, "")
        data.location = cwt.getOr(eventData.location, "")
      }
    })

    exports.screen.define({
      id: "NONE",
      layout: [
          ["background-color", "black"]
        ],
      onenter: transition => transition("LOAD")
    })

    exports.screen.define({
      id: "LOAD",
      layout: [
          ["text", "$loadingText"],
          ["loading-bar", "$loadingPercent"]
        ],
      data: {
        loadingText: "",
        loadingPercent: 0
      },
      onenter(transition, data) {
        exports.client
          .load({
            // TODO
            location: "",
            onLoadItem: (item) => data.loadingText = exports.localization.text("LOAD") + " " + item,
            // TODO
            onFinishedItem: (item) => data.loadingPercent += 1
          })
          .then(data => transition("START"))
          .catch(err => transition("ERROR"))
      }
    })

    exports.screen.define({
      id: "START",
      layout: [
          ["text", "$activeTooltip"],
          ["button", "$next"]
        ],
      data: {
        activeTooltip: "",
        next: exports.client.translated("next")
      },
      onenter(transition, data) {
        exports.client.jobs.add("start:tooltip:update", 5000, () =>
          data.activeTooltip = exports.client.translated("tooltip." + parseInt(Math.random() * 10, 10) + 1))
      },
      actions: {
        next: (transition, data) => {
          exports.client.jobs.remove("start:tooltip:update")
          transition("MAIN")
        }
      }
    })

    exports.screen.define({
      id: "MAIN",
      layout: [
          ["button-group", [
            ["button", "$versus"],
            ["button", "$options"]
          ], "vertical"],
          ["small-text", "$about", "bottom-right"]
        ],
      data: {
        versus: exports.client.translated("menu.versus"),
        options: exports.client.translated("menu.options"),
        about: "CustomWars-Tactics " + exports.VERSION
      },
      actions: {
        versus: (transition, data) => transition("VERSUS"),
        options: (transition, data) => transition("OPTIONS")
      }
    })

    exports.screen.define({
      id: "OPTIONS",
      layout: [
          ["button-group-vertical", [

            ["text", "$sfxVolumeLabel"],
            ["button-group-horizontal", [
              ["button", "$decreaseSFX"],
              ["text", "$sfxVolume"],
              ["button", "$increaseSFX"]
            ]],

            ["text", "$musicVolumeLabel"],
            ["button-group-horizontal", [
              ["button", "$decreaseMusic"],
              ["text", "$musicVolume"],
              ["button", "$increaseMusic"]
            ]],

            ["button", "$wipeData"],
            ["button", "$goBack"]
          ]]
        ],
      data: {
        sfxVolume: 0,
        musicVolume: 0,
        sfxVolumeLabel: exports.client.translated("options.sfx"),
        musicVolumeLabel: exports.client.translated("options.music"),
        decreaseSFX: exports.client.translated("options.sfx.decrease"),
        increaseSFX: exports.client.translated("options.sfx.increase"),
        decreaseMusic: exports.client.translated("options.music.decrease"),
        increaseMusic: exports.client.translated("options.music.increase"),
        wipeData: exports.client.translated("options.music.wipeData"),
        goBack: exports.client.translated("options.music.goBack")
      },
      actions: {
        decreaseSFX: (transition, data) => data.sfxVolume = exports.client.setSfxVolume(data.sfxVolume - 1),
        increaseSFX: (transition, data) => data.sfxVolume = exports.client.setSfxVolume(data.sfxVolume + 1),
        decreaseMusic: (transition, data) => data.musicVolume = exports.client.setMusicVolume(data.musicVolume - 1),
        increaseMusic: (transition, data) => data.musicVolume = exports.client.setMusicVolume(data.musicVolume + 1),
        wipeData: () => exports.client.storage.clear().then( /* TODO */ ),
        goBack: (transition, data) => transition("MAIN")
      },
      onenter(transition, data) {
        data.sfxVolume = exports.client.getSfxVolume()
        data.musicVolume = exports.client.getMusicVolume()
      }
    })

    exports.screen.define({
      id: "MAP_SELECT",
      layout: [
          ["box", [
            ["text", exports.client.translated("map")],
            ["text", "$mapName"],
            ["button", exports.client.translated("previous"), "previousMap"],
            ["button", exports.client.translated("next"), "nextMap"]
          ]],
          ["button", exports.client.translated("start"), "start"]
        ],
      data: {
        maps: [],
        mapIndex: 0,
        mapName: ""
      },
      actions: {

        nextMap(transition, data) {
          data.mapIndex = data.mapIndex + 1 < data.map.length ? data.mapIndex + 1 : 0
        },

        previousMap(transition, data) {
          data.mapIndex = data.mapIndex + 1 < data.map.length ? data.mapIndex - 1 : data.map.length - 1
        },

        start(transition, data) {
          transition("PLAYER_SETUP")
        }
      },
      onenter() {
        data.maps = []
      }
    })

    exports.screen.define({
      id: "PLAYER_SETUP",
      layout: [
          ["box", [

            ["text", exports.client.translated("player.type")],
            ["text", data => data[0].type],
            ["button", exports.client.translated("previous"), "prevTypeP1"],
            ["button", exports.client.translated("next"), "nextTypeP1"],

            ["text", exports.client.translated("player.type")],
            ["text", data => data[0].team],
            ["button", exports.client.translated("previous"), "prevTeamP1"],
            ["button", exports.client.translated("next"), "nextTeamP1"]
          ]]
        ],
      data: $.Stream.range(1, 4).map(id => ({
        type: 0,
        team: id
      })),
      actions: {
        // TODO this is just too  UGLY !
        prevTeamP1: (transition, data) => data.nth(0).team = 0,
        prevTeamP2: (transition, data) => null,
        prevTeamP3: (transition, data) => null,
        prevTeamP4: (transition, data) => null,
        nextTeamP1: (transition, data) => null,
        nextTeamP2: (transition, data) => null,
        nextTeamP3: (transition, data) => null,
        nextTeamP4: (transition, data) => null,
        prevTypeP1: (transition, data) => null,
        prevTypeP2: (transition, data) => null,
        prevTypeP3: (transition, data) => null,
        prevTypeP4: (transition, data) => null,
        nextTypeP1: (transition, data) => null,
        nextTypeP2: (transition, data) => null,
        nextTypeP3: (transition, data) => null,
        nextTypeP4: (transition, data) => null
      },
      onexit(transition, data) {
        // TODO transfer data into model
      }
    })

    exports.screen.define({
      id: "INGAME",
      layout: [
          ["canvas"],
          ["box", [
            ["row", [
              ["text", "???TileOrPropertyName???"]
            ]]
            ["is:given", "$tileUnit", [
              ["row", [
                ["text", "???UnitName???"]
              ]]
              ["row", [
                ["symbol", "HP"],
                ["symbol", "$tileHP"]
              ]]
            ]]
          ]]
        ],
      data: {
        tileUnit: null,
        tileHP: 0,
        uiData: {
          source: exports.model.position(-1, -1),
          target: exports.model.position(-1, -1),
          targetselection: exports.model.position(-1, -1),
          move: {
            way: []
          },
          action: {
            key: "",
            subKey: ""
          }
        }
      },
      actions: {

        placeCursor(transition, data, actionData) {

          const getWay = (way, map, pos, target, points) => {
            let queue = [{
              way: [],
              pos,
              points,
              distance: Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y)
              }]

            while (queue.length > 0) {
              const entity = queue.pop()

              const nextEntities = [
                  exports.model.position(entity.pos.x - 1, entity.pos.y),
                  exports.model.position(entity.pos.x + 1, entity.pos.y),
                  exports.model.position(entity.pos.x, entity.pos.y - 1),
                  exports.model.position(entity.pos.x, entity.pos.y + 1)
                ]

              nextEntities.forEach(pos =>
                Just(pos)
                .filter(pos => model.map_isValidPosition(pos.x, pos.y))
                .filter(pos => entity.points - movetype.costs[model.map_data[pos.y][pos.y].type.ID] >= 0)
                .ifPresent(pos => queue.push({
                  pos,
                  points: entity.points - movetype.costs[model.map_data[pos.y][pos.y].type.ID],
                  distance: Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y)
                })))

              const targetEntity = queue.find(entity => entity.pos.x === target.x && entity.pos.y === target.y)

              if (targetEntity) {
                return targetEntity.way
              }

              queue.sort((a, b) => a.distance < b.distance ? -1 : +1)
            }

            return []
          }

          const nx = actionData.get("x")
          const ny = actionData.get("y")

          cwt.guard(model.map_isValidPosition(nx, ny))

          if (!data.uiData.source.unit) {
            return []
          }

          const sx = data.uiData.source.x
          const sy = data.uiData.source.y

          const moveTargetX = data.uiData.move.way
            .reduce(code =>
              code == "L" ? -1 :
              code == "R" ? +1 : 0, sx)

          const moveTargetY = data.uiData.move.way
            .reduce(code =>
              code == "U" ? -1 :
              code == "D" ? +1 : 0, sy)

          const distance = Math.abs(moveTargetX - sx) + Math.abs(moveTargetY - sy)

          if (distance == 1) {

            const dir = exports.cond([
                [sx < moveTargetX, "L"],
                [sx > moveTargetX, "R"],
                [sy < moveTargetY, "U"],
                [sy > moveTargetY, "D"]
              ])

            exports.guard(dir)
            data.uiData.move.way.push(dir)

            // TODO out of range

          } else {

            // TODO
            data.uiData.move.way = getWay(model.map_data, data.uiData.source, position(nx, ny), 5)
          }

          return data.uiData.move.way
        },

        clickCursor(transition, data, actionData) {

          const getPropertyActions = (transition, data, actionData) => {
            const property = actionData.source.property
            const sourceUnit = actionData.source.unit

            if (!sourceUnit) return {}
            if (!property) return {}

            return {
              produce: exports.production.isFactory(property) &&
                exports.production.canProduce(model, property),

              propertyTransfer: exports.transfer.canDoPropertyTransfer(property)
            }
          }

          const getUnitActions = (transition, data, unitActionData) => {
            const actionData = unitActionData.actionData
            const moveData = unitActionData.moveData
            const sourceUnit = actionData.source.unit

            if (!sourceUnit) return {}

            const targetUnit = actionData.target.unit
            const targetProperty = actionData.target.property
            const unitAtTarget = !!targetUnit
            const propertyAtTarget = !!targetProperty
            const canAct = exports.usable.isUsable(sourceUnit)

            if (!canAct) return {}

            return {

              attack:
                // TODO
                exports.every(exports.isTruthy, [
                  model.round_day < controller.configValue("daysOfPeace"), !model.battle_isIndirectUnit(e.source.unitId) || exports.notEqual(-1, e.movePath.data[0]),
                  model.battle_calculateTargets(e.source.unitId, e.target.x, e.target.y)
                ]),
              exports.battle.calculateTargets().length > 0,

              fireLaser: exports.specialProperties.isLaser(sourceUnit),

              fireSilo: propertyAtTarget &&
                exports.specialProperties.isSilo(targetProperty) &&
                exports.specialProperties.isSiloFireableBy(sourceUnit, targetProperty),

              unitHide: exports.stealth.isStealthUnit(sourceUnit) &&
                exports.stealth.canHide(sourceUnit),

              unitReveal: exports.stealth.isStealthUnit(sourceUnit) &&
                exports.stealth.canReveal(sourceUnit),

              join: unitAtTarget &&
                exports.join.canJoin(model.unit_data[actionData.source.unitId], model.unit_data[actionData.target.unitId]),

              supply:
                !unitAtTarget &&
                supply.isSupplier(sourceUnit) &&
                supply.canSupplyAtPositon(
                  model.map_data,
                  sourceUnit, {
                    x: actionData.target.x,
                    y: actionData.target.y
                  }),

              explode:
                !unitAtTarget &&
                exports.explode.canExplode(sourceUnit),

              wait: !unitAtTarget
            }
          }

          const getSubMenu = (transition, data, actionData) => {
            if (actionData.action === "produce") {
              const ownerGold =
                return model.data_unitSheets.some(sheet => )
              var n = model.property_data[e];
              assert(model.player_isValidPid(n.owner));
              for (var a = model.player_data[n.owner].gold, r = model.data_unitTypes, l = n.type.builds, i = 0, d = r.length; d > i; i++) {
                var s = r[i],
                  c = model.data_unitSheets[s]; - 1 !== l.indexOf(c.movetype) && (c.cost <= a || o) && t.addEntry(s, c.cost <= a)
              }
            } else if (["propertyTransfer", "unitTransfer"].includes(actionData.action)) {
              return exports.transfer.getTransferTargetPlayers(
                model.player_data,
                model.player_data[actionData.source.property.owner])
            }
            return []
          }

          // TODO exports.battle.calculateTargets().length > 0
          const getTargetSelection = (transition, data, actionData) => ({
            needed: actionData.action === "fireSilo",
            freestyle: true,
            targets: actionData.action === "fireSilo" ? null : []
          })

          const getMapActions = (transition, data, actionData) => ({
            activateCoPower: exports.co.isCoPActivatable(model, model.round_turnOwner),
            activateSuperCoPower: exports.co.isSCoPActivatable(model, model.round_turnOwner),
            moneyTransfer: exports.transfer.canTransferMoney(model.turn.owner),
            toOptions: true,
            endTurn: true
          })

          const nx = actionData.get("x")
          const ny = actionData.get("y")

          $.guard(model.map_isValidPosition(nx, ny))

          const noPositionSelected = pos => pos.x == -1 && pos.y == -1

          const position = Switch()
            .Case(noPositionSelected(data.uiData.source), data.uiData.source)
            .Case(noPositionSelected(data.uiData.target), data.uiData.target)
            .Default(data.uiData.targetselection)

          $.guard(noPositionSelected(position))
          position.x = nx
          position.y = ny

          return Switch(position)
            .Case(pos => pos === data.uiData.source, {
              // TODO move
              move: {
                map: []
              }
            })
            .Case(pos => pos === data.uiData.target, {
              // TODO set move path if unit exists
            })
            .Default({

            })
        },

        clickAction(transition, data, actionData) {
          const action = actionData.get("actionKey")
          cwt.guard(!!action) // TODO check key

          cwt.guard(!data.uiData.action.key || !data.uiData.action.subKey)

          const targetProperty = !data.uiData.action.key ? "subKey" : "key"
          data.uiData.action[targetProperty] = action

          return {

          }
        },

        deselect(transition, data, actionData) {},

        postAction(transition, data, actionData) {
          exports.actions.pushAction(world, {
            key: actionData.action,
            sx: actionData.source.x,
            sy: actionData.source.y,
            tx: actionData.target.x,
            ty: actionData.target.y,
            stx: actionData.targetselection.x,
            sty: actionData.targetselection.y
          })
        }
      },
      onenter() {

        // TODO ???
        const world = null

        exports.client.jobs.add("inGameLoop", 100, delta => exports.actions.handleNextCommand(world))
      },
      onexit: () => exports.client.jobs.remove("inGameLoop")
    })
  }
}

exports.VERSION = "0.3.6 (INTERNAL)"

/**
  @return Promise(-, error-message)
 */
exports.initialize = () => new Promise((resolve, reject) => {

  exports.client.init()
  exports.client.debug("game:version:" + exports.VERSION)
  exports.client.debug("game:debug:on")
  exports.client.debug("game:startup")
  exports.client.debug("game:init:screens")
  exports.screen.init()
  exports.screen.open("LOAD")

  resolve()
})

exports.gameFactory = () => {

  let world = {}

  return {
    getWorld() {

    }
  }
}

return exports.gameFactory()
}
