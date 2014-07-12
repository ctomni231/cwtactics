//
// @class
//
cwt.ActionClass = my.Class({
  constructor: function(impl) {
    this.type = impl.type;
    this.action = impl.action;
    this.condition = (impl.condition) ? impl.condition : cwt.emptyFunction;
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
