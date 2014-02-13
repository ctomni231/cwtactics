/**
 * @class
 */
cwt.Action = my.Class({

  STATIC: {

    MAP_ACTION: 0,
    UNIT_ACTION: 1,
    PROPERTY_ACTION: 2,
    
    /**
     * Engine actions are callable by the engine itself.
     */
    ENGINE_ACTION: 3,

    /**
     * Holds all actions
     */
    actions_: {},

    /**
     * 
     */
    registerAction_ : function (name, impl) {
      var action = new cwt.Action(impl)
      this.actions_[name] = action;
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
    engineAction: function (impl) {
      impl.type = cwt.Action.ENGINE_ACTION;
      this.registerAction_(impl.key,impl);
    },

    /**
     * Builds several commands from collected action data.
     */
    buildFromData: function (scope) {
      if (!scope) scope = controller.stateMachine.data;
      var targetDto = scope.target;
      var sourceDto = scope.source;
      var actionDto = scope.action;
      var moveDto = scope.movePath;
      var actionObject = actionDto.object;

      var trapped = false;
      if (moveDto.data[0] !== -1) {
        trapped = model.move_trapCheck(moveDto.data, sourceDto, targetDto);
        model.events.move_flushMoveData(moveDto.data, sourceDto);
      }

      if (!trapped) actionObject.invoke(scope);
      else controller.commandStack_sharedInvokement(
        "trapwait_invoked",
        sourceDto.unitId
      );

      // all unit actions invokes automatically waiting
      if (trapped || actionObject.unitAction && !actionObject.noAutoWait) {
        controller.commandStack_sharedInvokement(
          "wait_invoked",
          sourceDto.unitId
        );
      }

      return trapped;
    }

  },

  constructor: function (impl) {
    this.type = -1;
    this.action = impl.action;
    this.condition = (impl.condition)? impl.condition : cwt.emptyFunction;
    this.prepareMenu = null;
    this.isTargetValid = null;
    this.prepareTargets = null;
    this.multiStepAction = false;
    this.prepareSelection = null;
    this.targetSelectionType = "A";
    this.noAutoWait = false;
    this.relation = impl.relation;
    this.marshall = null;
  }
});
