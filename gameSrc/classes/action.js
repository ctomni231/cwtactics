/**
 * @class
 */
cwt.Action = my.Class({

  STATIC: {

    /**
     * Map actions are called in the idle state on the map.
     *
     * @constant
     */
    MAP_ACTION: 0,

    /**
     * Unit actions are called on units.
     *
     * @constant
     */
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
      return Object.keys(this.actions_);
    },

    /**
     * 
     */
    registerAction_ : function (name, impl) {
      var action = new cwt.Action(impl);
      this.actions_[name] = action;
    },

    /**
     *
     * @param key
     * @return {cwt.Action}
     */
    getActionObject: function (key) {
      return this.actions_[key];
    },

    /**
     *
     * @param impl
     */
    unitAction: function (impl) {
      impl.type = cwt.Action.UNIT_ACTION;
      this.registerAction_(impl.key,impl);
    },

    /**
     *
     * @param impl
     */
    propertyAction: function (impl) {
      impl.type = cwt.Action.PROPERTY_ACTION;
      this.registerAction_(impl.key,impl);
    },

    /**
     *
     * @param impl
     */
    mapAction: function (impl) {
      impl.type = cwt.Action.MAP_ACTION;
      this.registerAction_(impl.key,impl);
    },

    /**
     *
     * @param impl
     */
    clientAction: function (impl) {
      impl.type = cwt.Action.CLIENT_ACTION;
      this.registerAction_(impl.key,impl);
    },

    /**
     *
     * @param impl
     */
    engineAction: function (impl) {
      impl.type = cwt.Action.ENGINE_ACTION;
      this.registerAction_(impl.key,impl);
    }

  },

  constructor: function (impl) {
    this.type = impl.type;
    this.action = impl.action;
    this.condition = (impl.condition)? impl.condition : cwt.emptyFunction;
    this.prepareMenu = impl.prepareMenu || null;
    this.isTargetValid = impl.isTargetValid || null;
    this.prepareTargets = impl.prepareTargets || null;
    this.multiStepAction = impl.multiStepAction || null;
    this.prepareSelection = impl.prepareSelection || null;
    this.targetSelectionType = impl.targetSelectionType || "A";
    this.noAutoWait = impl.noAutoWait || false;
    this.relation = impl.relation || null;
    this.toDataBlock = impl.toDataBlock || null;
    this.parseDataBlock = impl.parseDataBlock || null;
  }
});

