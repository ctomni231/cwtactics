"use strict";

// **Class Action**
//
cwt.Action = my.Class({

  STATIC: {

    // **Action.MULTITON_NAMES (Const)**
    //
    MULTITON_NAMES: [
      "activatePower",
      "attack",
      "buildUnit",
      "capture",
      "doExplosion",
      "fireCannon",
      "fireLaser",
      "unitHide",
      "joinUnits",
      "loadUnit",
      "nextTurn",
      "changeWeather",
      "options",
      "silofire",
      "supplyUnit",
      "transferMoney",
      "transferProperty",
      "transferUnit",
      "unitUnhide",
      "unloadUnit",
      "wait",
      "startAnimation",
      "clearMove",
      "pushToMove",
      "flushMove"
    ],

    // **Action.MAP_ACTION (Const)**
    //
    // Map actions are called in the idle state on the map.
    //
    MAP_ACTION: 0,

    // **Action.UNIT_ACTION (Const)**
    //
    // Unit actions are called on units.
    //
    UNIT_ACTION: 1,

    /**
     * Property actions are called on properties.
     *
     * @constant
     */
    PROPERTY_ACTION: 2,

    /**
     * Engine actions are callable by the engine itself.
     *
     * @constant
     */
    ENGINE_ACTION: 3,

    /**
     *
     *
     * @constant
     */
    CLIENT_ACTION: 4,

    /**
     * Holds all actions
     */
    actions_: {},

    /**
     * @return {Array}
     */
    getRegisteredNames: function () {
      return this.classNames_;
    },

    /**
     * @private
     */
    registerAction_: function (name, impl) {
      var action = new cwt.Action(impl);
      this.registerInstance(name, action);
    },

    /**
     *
     * @param key
     * @return {cwt.Action}
     */
    getActionObject: function (key) {
      return this.getInstance(key);
    },

    /**
     *
     * @param impl
     */
    unitAction: function (impl) {
      impl.type = cwt.Action.UNIT_ACTION;
      this.registerAction_(impl.key, impl);
    },

    /**
     *
     * @param impl
     */
    propertyAction: function (impl) {
      impl.type = cwt.Action.PROPERTY_ACTION;
      this.registerAction_(impl.key, impl);
    },

    /**
     *
     * @param impl
     */
    mapAction: function (impl) {
      impl.type = cwt.Action.MAP_ACTION;
      this.registerAction_(impl.key, impl);
    },

    /**
     *
     * @param impl
     */
    clientAction: function (impl) {
      impl.type = cwt.Action.CLIENT_ACTION;
      this.registerAction_(impl.key, impl);
    },

    /**
     *
     * @param impl
     */
    engineAction: function (impl) {
      impl.type = cwt.Action.ENGINE_ACTION;
      this.registerAction_(impl.key, impl);
    }

  },

  constructor: function (impl) {
    this.type = impl.type;
    this.action = impl.action;
    this.condition = (impl.condition) ? impl.condition : cwt.emptyFunction;
    this.prepareMenu = impl.prepareMenu || null;
    this.isTargetValid = impl.isTargetValid || null;
    this.prepareTargets = impl.prepareTargets || null;
    this.multiStepAction = impl.multiStepAction || null;
    this.prepareSelection = impl.prepareSelection || null;
    this.targetSelectionType = impl.targetSelectionType || "A";
    this.relation = impl.relation || null;
    this.toDataBlock = impl.toDataBlock || null;
    this.parseDataBlock = impl.parseDataBlock || null;
    this.noAutoWait = impl.noAutoWait || false;
  }
});
my.extendClass(cwt.Action, {STATIC: cwt.IdMultiton});

cwt.Action.engineAction({
  key:"clearMove",

  parseDataBlock: function (dataBlock) {
    cwt.Move.tmpMovePath.clear();
  }
});

cwt.Action.engineAction({
  key:"flushMove",

  parseDataBlock: function (dataBlock) {
    cwt.Move.move(

      /** @type {cwt.Unit} */ cwt.Unit.getInstance(dataBlock.p1),

      // start point
      dataBlock.p2,
      dataBlock.p3,

      cwt.Move.tmpMovePath,

      // move meta                                                                       0
      (dataBlock.p4 === 1),
      (dataBlock.p5 === 1),
      (dataBlock.p5 === 2)
    );
  }
});

cwt.Action.engineAction({
  key: "changeWeather",

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.action.selectedEntry;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Weather.changeWeather(
      cwt.WeatherSheet.sheets[dataBlock.p1]);
  }
});

cwt.Action.engineAction({
  key:"pushToMove",

  parseDataBlock: (function () {
    function push (code) {
      cwt.Move.tmpMovePath.push(code);
    }

    return function (dataBlock) {
      if (dataBlock.p1 !== cwt.INACTIVE) push(dataBlock.p1);
      if (dataBlock.p2 !== cwt.INACTIVE) push(dataBlock.p2);
      if (dataBlock.p3 !== cwt.INACTIVE) push(dataBlock.p3);
      if (dataBlock.p4 !== cwt.INACTIVE) push(dataBlock.p4);
      if (dataBlock.p5 !== cwt.INACTIVE) push(dataBlock.p5);
    };
  })()
});

cwt.Action.engineAction({
  key:"startAnimation",

  parseDataBlock: function (dataBlock) {
    switch (dataBlock.p1) {

      // next turn
      case 0:
        cwt.Gameflow.changeState("ANIMATION_NEXT_TURN");
        break;
    }
  }
});

cwt.Action.mapAction({
  key: "activatePower",

  condition: function () {
    return cwt.CO.canActivatePower(cwt.Gameround.turnOwner, cwt.CO.POWER_LEVEL_COP);
  },

  hasSubMenu: true,
  prepareMenu: function (data) {

    data.menu.addEntry("cop");
    if (cwt.CO.canActivatePower(cwt.Gameround.turnOwner, cwt.CO.POWER_LEVEL_SCOP)) {
      data.menu.addEntry("scop");
    }
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = (data.action.selectedSubEntry === "cop" ? cwt.CO.POWER_LEVEL_COP : -1);
    dataBlock.p1 = (data.action.selectedSubEntry === "scop" ? cwt.CO.POWER_LEVEL_SCOP : -1);
  },

  parseDataBlock: function (dataBlock) {
    cwt.CO.activatePower(cwt.Gameround.turnOwner,dataBlock.p1);
  }
});

cwt.Action.mapAction({
  key: "nextTurn",

  toDataBlock: function (data, dataBlock) {
  },

  parseDataBlock: function (dataBlock) {
    cwt.Turn.next();
  }
});

cwt.Action.mapAction({
  key:"transferMoney",

  condition: function( data ){
    return cwt.Team.canTransferMoney(
      cwt.Gameround.turnOwner,
      data.target.x,
      data.target.y
    );
  },

  hasSubMenu: true,
  prepareMenu: function( data ){
    cwt.Team.getTransferMoneyTargets(cwt.Gameround.turnOwner,data.menu);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = cwt.Gameround.turnOwner.id;
    dataBlock.p2 = data.target.property.owner.id;
    dataBlock.p3 = data.selectedSubEntry;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Team.transferMoney(
      /** @type {cwt.Player} */ cwt.Player.getInstance(dataBlock.p1),
      /** @type {cwt.Player} */ cwt.Player.getInstance(dataBlock.p2),
      dataBlock.p3
    );
  }

});

cwt.Action.propertyAction({
  key:"buildUnit",

  condition: function( data ){
    return (
      cwt.Factory.isFactory(data.source.property) &&
        cwt.Factory.canProduce(data.source.property)
      );
  },

  hasSubMenu: true,
  prepareMenu: function( data ){
    cwt.Factory.generateBuildMenu(
      data.source.property,
      data.menu,
      true
    );
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = cwt.Gameround.turnOwner.id;
    dataBlock.p2 = data.target.property.owner.id;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Factory.buildUnit(
      /** @type {cwt.Property} */ cwt.Property.getInstance(dataBlock.p1),
      dataBlock.p2
    );
  }
});

cwt.Action.propertyAction({

  key:"transferProperty",

  relationToProp:[
    "S","T",
    cwt.Relationship.RELATION_SAME_THING
  ],

  condition: function( data  ){
    return cwt.Team.canTransferProperty(data.source.property);
  },

  hasSubMenu: true,
  prepareMenu: function( data ){
    cwt.Team.getPropertyTransferTargets(data.source.property.owner, data.menu);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.propertyId;
    dataBlock.p2 = data.selectedSubEntry;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Team.transferPropertyToPlayer(
      /** @type {cwt.Property} */ cwt.Property.getInstance(dataBlock.p1),
      /** @type {cwt.Player} */ cwt.Player.getInstance(dataBlock.p2)
    );
  }
});

/*
 cwt.Action.unitAction({
 key:"detachCommander",

 condition: function(data){
 return model.events.detachCommander_check(

 model.round_turnOwner
 );
 },

 invoke: function( data ){
 controller.commandStack_sharedInvokement(
 "detachCommander_invoked",
 model.round_turnOwner,
 data.target.x,
 data.target.y
 );
 }
 });
 */
/*
 cwt.Action.unitAction({
 key:"attachCommander",

 condition: function(data){
 return model.events.attachCommander_check(

 model.round_turnOwner
 );
 },

 invoke: function( data ){
 controller.commandStack_sharedInvokement(
 "co_attachCommander",
 model.round_turnOwner,
 data.source.unitId
 );
 }
 });
 */

cwt.Action.unitAction({
  key: "attack",

  relation: [
    "S", "T",
    cwt.Relationship.RELATION_NONE,
    cwt.Relationship.RELATION_SAME_THING
  ],

  condition: function (data) {
    if (cwt.Gameround.inPeacePhase()) return false;

    return cwt.Attack.hasTargets(
      data.source.unit,
      data.target.x,
      data.target.y,
      data.movePath.data[0] !== cwt.INACTIVE
    );
  },

  targetSelectionType: "A",
  prepareTargets: function (data) {
    cwt.Attack.calculateTargets(
      data.source.unit,
      data.target.x,
      data.target.y,
      data.selection
    );
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.unitId;
    dataBlock.p2 = data.targetselection.unitId;
    dataBlock.p3 = Math.round(Math.random() * 100);
    dataBlock.p4 = Math.round(Math.random() * 100);
  },

  parseDataBlock: function (dataBlock) {
    cwt.Attack.attack(
      /** @type {cwt.Unit} */ cwt.Unit.getInstance(dataBlock.p1),
      /** @type {cwt.Unit} */ cwt.Unit.getInstance(dataBlock.p2),
      dataBlock.p3,
      dataBlock.p4
    );
  }
});

cwt.Action.unitAction({
  key: "capture",

  relation: [
    "S", "T",
    cwt.Relationship.RELATION_SAME_THING,
    cwt.Relationship.RELATION_NONE
  ],

  relationToProp: [
    "S", "T",
    cwt.Relationship.RELATION_ENEMY,
    cwt.Relationship.RELATION_NONE
  ],

  condition: function (data) {
    if (cwt.Capture.canCapture(data.source.unit)) return false;
    if (cwt.Capture.canBeCaptured(data.target.property)) return false;
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.target.propertyId;
    dataBlock.p2 = data.source.unitId;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Capture.captureProperty(
      cwt.Property.getInstance(dataBlock.p1),
      cwt.Unit.getInstance(dataBlock.p2)
    );
  }
});

cwt.Action.unitAction({
  key:"doExplosion",
  noAutoWait: true,

  relation: [
    "S","T",
    cwt.Relationship.RELATION_NONE,
    cwt.Relationship.RELATION_SAME_THING
  ],

  condition: function( data ){
    return cwt.Explode.canExplode(data.source.unit);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.x;
    dataBlock.p2 = data.source.y;
    dataBlock.p3 = cwt.Explode.getExplosionRange(data.source.unit);
    dataBlock.p4 = cwt.Explode.getExplosionDamage(data.source.unit);
  },

  parseDataBlock: function (dataBlock) {
    cwt.Explode.doExplosion(dataBlock.p1,dataBlock.p2,dataBlock.p3,dataBlock.p4);
  }
});

cwt.Action.unitAction({
  key: "fireCannon",

  relation: [
    "S", "T",
    cwt.Relationship.RELATION_SAME_THING
  ],

  condition: function (data) {
    return (
      cwt.Cannon.isCannonUnit(data.source.unit) &&
        cwt.Cannon.hasTargets(data.source.x, data.source.y, null)
      );
  },

  targetSelectionType: "A",
  prepareTargets: function (data) {
    cwt.Cannon.fillCannonTargets(data.source.x, data.source.y, data.selection);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.x;
    dataBlock.p2 = data.source.y;
    dataBlock.p3 = data.targetselection.x;
    dataBlock.p4 = data.targetselection.y;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Cannon.fireCannon(dataBlock.p1, dataBlock.p2,dataBlock.p3, dataBlock.p4);
  }

});
cwt.Action.unitAction({
  key:"fireLaser",

  relation:[
    "S","T",
    cwt.Relationship.RELATION_SAME_THING
  ],

  condition: function( data ){
    return cwt.Laser.isLaser(data.target.unit);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.target.x;
    dataBlock.p2 = data.target.y;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Laser.fireLaser(dataBlock.p1,dataBlock.p2);
  }
});

cwt.Action.unitAction({
  key:"unitHide",

  relation: [
    "S","T",
    cwt.Relationship.RELATION_NONE,
    cwt.Relationship.RELATION_SAME_THING
  ],

  condition: function( data ){
    return model.events.unitHide_check(data.source.unitId);
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "unitHide_invoked",
      data.source.unitId
    );
  }

});

cwt.Action.unitAction({
  key:"joinUnits",
  noAutoWait: true,

  relation:[
    "S","T",
    cwt.Relationship.RELATION_OWN
  ],

  condition: function( data ){
    return cwt.Join.canJoin(data.source.unit,data.target.unit);
  },


  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.unitId;
    dataBlock.p2 = data.target.x;
    dataBlock.p2 = data.target.y;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Join.join(
      /** @type {cwt.Unit} */ cwt.Unit.getInstance(dataBlock.p1),
      dataBlock.p2, dataBlock.p3
    );
  }

});

cwt.Action.unitAction({
  key:"loadUnit",

  relation: [
    "S","T",
    cwt.Relationship.RELATION_OWN
  ],

  condition: function( data ){
    return model.events.loadUnit_check(data.source.unitId,data.target.unitId);
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "loadUnit_invoked",
      data.source.unitId,
      data.target.unitId
    );
  }

});

cwt.Action.unitAction({
  key: "silofire",

  relation: [
    "S", "T",
    cwt.Relationship.RELATION_SAME_THING,
    cwt.Relationship.RELATION_NONE
  ],

  relationToProp: [
    "S", "T",
    cwt.Player.RELATION_NONE
  ],

  condition: function (data) {
    if (!cwt.Silo.isRocketSilo(data.target.property)) return false;
    if (!cwt.Silo.canBeFired(data.target.property, data.source.unit)) return false;
    return true;
  },

  prepareSelection: function (data) {
    data.selectionRange = data.target.property.type.rocketsilo.range;
  },

  isTargetValid: function (data, x, y) {
    return cwt.Silo.canBeFiredTo(data.target.property, x, y);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.x;
    dataBlock.p2 = data.source.y;
    dataBlock.p3 = data.targetselection.x;
    dataBlock.p4 = data.targetselection.y;
    dataBlock.p5 = data.source.unit.owner.id;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Silo.fireSilo(
      dataBlock.p1,dataBlock.p2,
      dataBlock.p3,dataBlock.p4,
      cwt.Player.getInstance(dataBlock.p5)
    );
  }
});

cwt.Action.unitAction({
  key: "supplyUnit",

  relation: [
    "S", "T",
    cwt.Relationship.RELATION_NONE,
    cwt.Relationship.RELATION_SAME_THING
  ],

  condition: function (data) {
    return (
      cwt.Supply.isSupplier(data.target.unit) &&
        cwt.Supply.canSupplyTile(data.target.unit, data.target.x, data.target.y) );
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.target.x;
    dataBlock.p2 = data.target.y;
  },

  parseDataBlock: function (datBlock) {
    cwt.Supply.supplyNeighbours(datBlock.p1, datBlock.p2);
  }

});

cwt.Action.unitAction({
  key:"transferUnit",

  relation: [
    "S","T",
    cwt.Relationship.RELATION_SAME_THING
  ],

  condition: function( data ){
    return cwt.Team.canTransferUnit(data.source.unit);
  },

  hasSubMenu: true,
  prepareMenu: function( data ){
    cwt.Team.getUnitTransferTargets(data.source.unit.owner, data.menu);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.unitId,
    dataBlock.p2 = data.selectedSubEntry;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Team.transferUnitToPlayer(
      cwt.Unit.getInstance(dataBlock.p1),
      cwt.Player.getInstance(dataBlock.p2)
    );
  }

});

cwt.Action.unitAction({
  key:"unitUnhide",

  relation: [
    "S","T",
    cwt.Relationship.RELATION_NONE,
    cwt.Relationship.RELATION_SAME_THING
  ],

  condition: function( data ){
    return model.events.unitUnhide_check(
      data.source.unitId
    );
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "unitUnhide_invoked",
      data.source.unitId
    );
  }
});

cwt.Action.unitAction({
  key:"unloadUnit",
  multiStepAction: true,

  relation:[
    "S","T",
    cwt.Relationship.RELATION_SAME_THING,
    cwt.Relationship.RELATION_NONE
  ],

  condition: function( data ){
    return model.events.unloadUnit_check(

      data.source.unitId,
      data.target.x,
      data.target.y
    );
  },

  prepareMenu: function( data ){
    model.events.unloadUnit_addUnloadTargetsToMenu(
      data.source.unitId,
      data.target.x,
      data.target.y,
      data.menu
    );
  },

  targetSelectionType: "B",
  prepareTargets: function( data ){
    model.events.unloadUnit_addUnloadTargetsToSelection(
      data.source.unitId,
      data.target.x,
      data.target.y,
      data.action.selectedSubEntry,
      data.selection
    );
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "unloadUnit_invoked",
      data.source.unitId,
      data.target.x,
      data.target.y,
      data.action.selectedSubEntry,
      data.targetselection.x,
      data.targetselection.y
    );
  }
});

cwt.Action.unitAction({
  key: "wait",

  relation: [
    "S", "T",
    cwt.Relationship.RELATION_NONE,
    cwt.Relationship.RELATION_SAME_THING
  ],

  condition: function (data) {
    return data.source.unit.canAct;
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.unitId;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Unit.getInstance(dataBlock.p1).canAct = false;
    // if p2 === 1 --> trapped
  }
});

cwt.Action.clientAction({
  key:"options",

  condition: function (data) {
    return true;
  },

  toDataBlock: function (data, dataBlock) {},

  parseDataBlock: function (dataBlock) {
    cwt.Gameflow.changeState("OPTIONS");
    cwt.Gameflow.activeState.data.invokedFromIngame = true;
  }
});