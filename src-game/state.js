const gameCreateUI = function() {

  const valueOr = (value, def) => value || def
  const element = type => content => [type, content]
  const box = content => element("box")
  const header = value => element("header")
  const text = value => element("text")
  const spacer = element(spacer)
  const whenDefined = (property, content) => ["if:exists", property, content]

  const screens = {}

  screens.ERROR = {
    layout: [
      box([
        header("$header"),

        text("$message"),
        whenDefined("$location", [
          text(gameClient.translated("source")),
          text("$location")
        ]),

        spacer(),

        ["button", gameClient.translated("restart"), "restart"]
      ])
    ],
    data: {
      header: "",
      message: "",
      location: ""
    },
    action: {
      restart: () => gameClient.restart()
    },
    onenter(transition, data, eventData) {
      data.header = valueOr(eventData.header, "Unknown Error")
      data.message = valueOr(eventData.message, "")
      data.location = valueOr(eventData.location, "?")
    }
  }

  screens.NONE = {
    layout: [
      ["background-color", "black"]
    ],
    onenter: transition => transition("LOAD")
  }

  screens.LOAD = {
    layout: [
      ["text", "$loadingText"],
      ["loading-bar", "$loadingPercent"]
    ],
    data: {
      loadingText: "",
      loadingPercent: 0
    },
    onenter(transition, data) {
      gameClient
        .load({
          // TODO
          location: "",
          onLoadItem: (item) => data.loadingText = exports.localization.text(
            "LOAD") + " " + item,
          // TODO
          onFinishedItem: (item) => data.loadingPercent += 1
        })
        .then(data => transition("START"))
        .catch(err => transition("ERROR"))
    }
  }

  screens.START = {
    layout: [
      ["text", "$activeTooltip"],
      ["button", "$next"]
    ],
    data: {
      activeTooltip: "",
      next: gameClient.translated("next")
    },
    onenter(transition, data) {
      gameClient.jobs.add("start:tooltip:update", 5000, () =>
        data.activeTooltip = gameClient.translated("tooltip." + parseInt(
          Math.random() * 10, 10) + 1))
    },
    actions: {
      next: (transition, data) => {
        gameClient.jobs.remove("start:tooltip:update")
        transition("MAIN")
      }
    }
  }

  screens.MAIN = {
    id: "MAIN",
    layout: [
      ["button-group", [
        ["button", "$versus"],
        ["button", "$options"]
      ], "vertical"],
      ["small-text", "$about", "bottom-right"]
    ],
    data: {
      versus: gameClient.translated("menu.versus"),
      options: gameClient.translated("menu.options"),
      about: "CustomWars-Tactics " + exports.VERSION
    },
    actions: {
      versus: (transition, data) => transition("VERSUS"),
      options: (transition, data) => transition("OPTIONS")
    }
  }

  screens.OPTIONS = {
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
      sfxVolumeLabel: gameClient.translated("options.sfx"),
      musicVolumeLabel: gameClient.translated("options.music"),
      decreaseSFX: gameClient.translated("options.sfx.decrease"),
      increaseSFX: gameClient.translated("options.sfx.increase"),
      decreaseMusic: gameClient.translated("options.music.decrease"),
      increaseMusic: gameClient.translated("options.music.increase"),
      wipeData: gameClient.translated("options.music.wipeData"),
      goBack: gameClient.translated("options.music.goBack")
    },
    actions: {
      decreaseSFX: (transition, data) => data.sfxVolume = gameClient.setSfxVolume(
        data.sfxVolume - 1),
      increaseSFX: (transition, data) => data.sfxVolume = gameClient.setSfxVolume(
        data.sfxVolume + 1),
      decreaseMusic: (transition, data) => data.musicVolume = gameClient.setMusicVolume(
        data.musicVolume - 1),
      increaseMusic: (transition, data) => data.musicVolume = gameClient.setMusicVolume(
        data.musicVolume + 1),
      wipeData: () => gameClient.storage.clear().then( /* TODO */ ),
      goBack: (transition, data) => transition("MAIN")
    },
    onenter(transition, data) {
      data.sfxVolume = gameClient.getSfxVolume()
      data.musicVolume = gameClient.getMusicVolume()
    }
  }

  screens.MAP_SELECT = {
    layout: [
      ["box", [
        ["text", gameClient.translated("map")],
        ["text", "$mapName"],
        ["button", gameClient.translated("previous"), "previousMap"],
        ["button", gameClient.translated("next"), "nextMap"]
      ]],
      ["button", gameClient.translated("start"), "start"]
    ],
    data: {
      maps: [],
      mapIndex: 0,
      mapName: ""
    },
    actions: {

      nextMap(transition, data) {
          data.mapIndex = data.mapIndex + 1 < data.map.length ? data.mapIndex +
            1 : 0
        },

        previousMap(transition, data) {
          data.mapIndex = data.mapIndex + 1 < data.map.length ? data.mapIndex -
            1 : data.map.length - 1
        },

        start(transition, data) {
          transition("PLAYER_SETUP")
        }
    },
    onenter() {
      data.maps = []
    }
  }

  screens.PLAYER_SETUP = {
    layout: [
      ["box", [

        ["text", gameClient.translated("player.type")],
        ["text", data => data[0].type],
        ["button", gameClient.translated("previous"), "prevTypeP1"],
        ["button", gameClient.translated("next"), "nextTypeP1"],

        ["text", gameClient.translated("player.type")],
        ["text", data => data[0].team],
        ["button", gameClient.translated("previous"), "prevTeamP1"],
        ["button", gameClient.translated("next"), "nextTeamP1"]
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
  }

  screens.INGAME = {
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
              distance: Math.abs(target.x - pos.x) + Math.abs(target.y -
                pos.y)
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
                .filter(pos => entity.points - movetype.costs[model.map_data[
                  pos.y][pos.y].type.ID] >= 0)
                .ifPresent(pos => queue.push({
                  pos,
                  points: entity.points - movetype.costs[model.map_data[
                      pos.y][pos.y].type.ID],
                    distance: Math.abs(target.x - pos.x) + Math.abs(
                      target.y - pos.y)
                })))

              const targetEntity = queue.find(entity => entity.pos.x ===
                target.x && entity.pos.y === target.y)

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

          const distance = Math.abs(moveTargetX - sx) + Math.abs(
            moveTargetY - sy)

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
            data.uiData.move.way = getWay(model.map_data, data.uiData.source,
              position(nx, ny), 5)
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

              propertyTransfer: exports.transfer.canDoPropertyTransfer(
                property)
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
                model.round_day < controller.configValue(
                  "daysOfPeace"), !model.battle_isIndirectUnit(e.source
                  .unitId) || exports.notEqual(-1, e.movePath.data[0]),
                model.battle_calculateTargets(e.source.unitId, e.target
                  .x, e.target.y)
              ]),
              exports.battle.calculateTargets().length > 0,

              fireLaser: exports.specialProperties.isLaser(sourceUnit),

              fireSilo: propertyAtTarget &&
                exports.specialProperties.isSilo(targetProperty) &&
                exports.specialProperties.isSiloFireableBy(sourceUnit,
                  targetProperty),

              unitHide: exports.stealth.isStealthUnit(sourceUnit) &&
                exports.stealth.canHide(sourceUnit),

              unitReveal: exports.stealth.isStealthUnit(sourceUnit) &&
                exports.stealth.canReveal(sourceUnit),

              join: unitAtTarget &&
                exports.join.canJoin(model.unit_data[actionData.source.unitId],
                  model.unit_data[actionData.target.unitId]),

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
              for (var a = model.player_data[n.owner].gold, r = model.data_unitTypes,
                  l = n.type.builds, i = 0, d = r.length; d > i; i++) {
                var s = r[i],
                  c = model.data_unitSheets[s]; - 1 !== l.indexOf(c.movetype) &&
                  (c.cost <= a || o) && t.addEntry(s, c.cost <= a)
              }
            } else if (["propertyTransfer", "unitTransfer"].includes(
                actionData.action)) {
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
            activateSuperCoPower: exports.co.isSCoPActivatable(model,
              model.round_turnOwner),
            moneyTransfer: exports.transfer.canTransferMoney(model.turn
              .owner),
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

      gameClient.jobs.add("inGameLoop", 100, delta => exports.actions.handleNextCommand(
        world))
    },
    onexit: () => gameClient.jobs.remove("inGameLoop")
  }

  const doAction = (name, ...args) => {

  }

  const open = (screenName) => {
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
    gameClient.onScreenOpened(screenName, screen.layout)

    screen.onenter(exports.screen.open, screen.data)
  }

  return {
    doAction,
    open
  }
}
