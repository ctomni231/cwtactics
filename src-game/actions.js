const gameCreateActionHandler = world => {


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

      exports.client.debug("reset turn timer")
      limits.resetTurnTimer(world.turn, world.cfg)

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

    handleYield: (world, actionData) => {

      exports.client.debug("turn owner is going to yield")
      exports.turn.yield(world.turn.owner)

      exports.client.debug("wiping turn owners properties and units")[world.properties, world.units]
        .forEach(ownables => ownables
          .filter(ownable => ownable.owner == world.turn.owner)
          .forEach(ownable => ownable.owner = null))
    },

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
}
