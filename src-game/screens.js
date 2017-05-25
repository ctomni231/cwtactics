
  const cwtInitScreens = () => {

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
