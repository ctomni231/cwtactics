package net.wolfTec.wtEngine.action;



public abstract class Action {

  public abstract String getId ();
  public abstract void call (ActionData data);
  public abstract ActionType getType();
  
  public boolean invokesWait () {
    return false;
  }
  
  /*
  this.positionUpdateMode = MovingAction.SET_POSITION;
  this.condition = DEFAULT_CONDITION;
  this.prepareMenu = null;
  this.isTargetValid = null;
  this.prepareTargets = null;
  this.multiStepAction = false;
  this.prepareSelection = null;
  this.targetSelectionType = TargetSelectionType.BEFORE_SUB_ACTION;
  this.relationToUnit = null;
  this.relationToProperty = null;
  this.mappingForProperty = null;
  this.mappingForUnit = null;
  this.noAutoWait = false;
  this.invoke = null;
  this.hasSubMenu = false;
  */
}
