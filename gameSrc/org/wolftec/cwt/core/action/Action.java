package org.wolftec.cwt.core.action;

import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.core.util.ClassUtil;
import org.wolftec.cwt.core.util.NullUtil;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.states.UserInteractionData;

/**
 * Action class which represents an action which is usable by engine objects.
 */
public interface Action extends Injectable {

  /**
   * Key ID of the action.
   */
  default String key() {
    return ClassUtil.getClassName(this);
  }

  /**
   * Type of the action.
   */
  ActionType type();

  /**
   * Condition function which checks the availability of the action with the
   * current state data.
   */
  default boolean condition(UserInteractionData data) {
    return true;
  }

  default boolean hasSubMenu() {
    return false;
  }

  /**
   * Prepares the menu for a given state data.
   */
  default void prepareActionMenu(UserInteractionData data) {
  }

  /**
   * Checks the correctness of a given target position.
   */
  default boolean isTargetValid(UserInteractionData data) {
    return false;
  }

  /**
   * Adds all possible targets into the state selection.
   */
  default void prepareTargets(UserInteractionData data) {
  }

  /**
   * Marks the kind of the action. Multistep actions can flush more than one
   * command into the command stack.
   */
  default boolean multiStepAction() {
    return false;
  }

  /**
   * Prepares the selection.
   */
  default void prepareSelection(UserInteractionData data) {

  }

  default PositionUpdateMode positionUpdateMode() {
    return PositionUpdateMode.SET_POSITION;
  }

  /**
   * Marks the target selection mode. Mode 'A' will be done before the sub menu.
   * Mode 'B' will be done after the sub menu.
   */
  default ActionTargetMode targetSelectionType() {
    return ActionTargetMode.A;
  }

  /**
   * If true, then flusher won't push a 'wait' command. This is only usable for
   * unit actions.
   */
  default boolean noAutoWait() {
    return false;
  }

  default boolean checkSource(TileMeta unitFlag, TileMeta propertyFlag) {
    switch (type()) {

      case UNIT_ACTION:
        return unitFlag == TileMeta.OWN;

      case PROPERTY_ACTION:
        return unitFlag != TileMeta.OWN && propertyFlag == TileMeta.OWN;

      case MAP_ACTION:
        return unitFlag != TileMeta.OWN && propertyFlag != TileMeta.OWN;

      case CLIENT_ACTION:

      case ENGINE_ACTION:
      default:
        return false;
    }
  }

  default boolean checkTarget(TileMeta unitFlag, TileMeta propertyFlag) {
    switch (type()) {

      case UNIT_ACTION:
        return unitFlag == TileMeta.OWN || unitFlag == TileMeta.EMPTY;

      default:
        return unitFlag == TileMeta.EMPTY;
    }
  }

  default void fillData(UserInteractionData interactionData, ActionData actionData) {

  }

  default void checkData(ActionData data) {

  }

  default boolean isUsable(UserInteractionData uiData) {
    // TODO ALLY
    // TODO TARGET - SOURCE SAME THING CHECK
    TileMeta sourceUnit = NullUtil.isPresent(uiData.source.unit) ? TileMeta.OWN : TileMeta.EMPTY;
    TileMeta sourceProperty = NullUtil.isPresent(uiData.source.property)
        ? ((uiData.source.property.owner == uiData.actor) ? TileMeta.OWN : TileMeta.ENEMY) : TileMeta.EMPTY;
    TileMeta targetUnit = NullUtil.isPresent(uiData.target.unit) ? ((uiData.target.unit.owner == uiData.actor) ? TileMeta.OWN : TileMeta.ENEMY)
        : TileMeta.EMPTY;
    TileMeta targetProperty = NullUtil.isPresent(uiData.target.property)
        ? ((uiData.target.property.owner == uiData.actor) ? TileMeta.OWN : TileMeta.ENEMY) : TileMeta.EMPTY;

    if (uiData.source.tile == uiData.target.tile) {
      targetUnit = TileMeta.EMPTY;
    }

    if (sourceUnit == TileMeta.OWN && !uiData.source.unit.canAct) {
      sourceUnit = TileMeta.OWN_USED;
    }
    if (targetUnit == TileMeta.OWN && !uiData.target.unit.canAct) {
      targetUnit = TileMeta.OWN_USED;
    }

    return checkSource(sourceUnit, sourceProperty) && checkTarget(targetUnit, targetProperty) && condition(uiData);
  }

  /**
   * Invokes the action with a given set of arguments.
   * 
   * @param stateTransition
   *          TODO
   */
  void evaluateByData(int delta, ActionData data, StateFlowData stateTransition);

  default boolean isDataEvaluationCompleted(ActionData data) {
    return true;
  }

  default void renderByData(int delta, GraphicManager gfx, ActionData data) {

  }
}
