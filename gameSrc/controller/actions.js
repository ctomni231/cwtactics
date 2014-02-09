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
    registerAction: function (name, obj) {
      this.actions_[name] = obj;
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

  constructor: function (name) {
    this.type = -1;
    this.action = null;
    this.condition = null;
    this.prepareMenu = null;
    this.isTargetValid = null;
    this.prepareTargets = null;
    this.multiStepAction = false;
    this.prepareSelection = null;
    this.targetSelectionType = "A";
    this.noAutoWait = false;
    this.relation = null;
    this.marshall = null;

    cwt.Action.registerAction(name, this);
    return this;
  },

  /**
   * Condition function. Returns true, when the action is callable with
   * the given game data, else false. Can be null.
   */
  condition: function (fn) {
    this.condition = fn;
    return this;
  },
  
  /**
   * The marshall function will be called when the action was flushed and
   * will be added to the command stack.
   */
  marshall: function(fn){
    this.marshall = fn;
    return this;
  },

  /**
   * Action handler. When called, this function will change the game
   * model.
   */
  action: function (fn) {
    this.action = fn;
    return this;
  },

  /**
   * The action won't do a wait command after the invocation.
   */
  noAutoWait: function () {
    this.noAutoWait = true;
    return this;
  },

  relation: function (value) {
    this.relation = value;
    return this;
  },

  /**
   * Marks the action as unit action. Can only be activated if a
   * unit is selected.
   */
  unitAction: function (source, target, expected) {
    assert(this.type === INACTIVE_ID);
    this.type = cwt.Action.UNIT_ACTION;
    return this;
  },

  /**
   * Marks the action as unit action. Can only be activated if a
   * property is selected.
   */
  propertyAction: function (source, target, expected) {
    assert(this.type === INACTIVE_ID);
    this.type = cwt.Action.PROPERTY_ACTION;
    return this;
  },

  /**
   * Marks the action as map action. Can only be activated if no
   * object is selected.
   */
  mapAction: function (source, target, expected) {
    assert(this.type === INACTIVE_ID);
    this.type = cwt.Action.MAP_ACTION;
    return this;
  },
  
  /**
   * 
   */
  prepareMenu: function(fn){
    this.prepareMenu = fn;
    return this;
  },
  
  /**
   * 
   */
  prepareTargets: function(fn){
    this.prepareTargets = fn;
    return this;
  },
  
  /**
   * 
   */
  prepareSelection: function(fn){
    this.prepareSelection = fn;
    return this;
  },
  
  /**
   * 
   */
  isTargetValid: function(fn){
    this.isTargetValid = fn;
    return this;
  },
  
  /**
   * Multistep actions has a lifecycle that survives one command evaluation
   * step.
   */
  multiStepAction: function(){
    this.multiStepAction = true;
    return this;
  },
  
  /**
   * 
   */
  targetSelectionType: function(tp){
    this.targetSelectionType = tp;
    return this;
  }
  
});
