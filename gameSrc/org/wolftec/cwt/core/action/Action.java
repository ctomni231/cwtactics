package org.wolftec.cwt.core.action;

import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.core.util.ClassUtil;
import org.wolftec.cwt.core.util.NullUtil;
import org.wolftec.cwt.model.gameround.Ownable;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.Unit;
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
    return true;
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
        return unitFlag == TileMeta.EMPTY;

      default:
        return unitFlag == TileMeta.EMPTY;
    }
  }

  default void fillData(UserInteractionData interactionData, ActionData actionData) {

  }

  default void checkData(ActionData data) {

  }

  default TileMeta extractPositionMeta(Ownable ownable, Player actor) {
    if (NullUtil.isPresent(ownable)) {
      Player owner = ownable.getOwner();

      if (owner == null) {
        return TileMeta.NEUTRAL;

      } else if (owner == actor) {
        if (ownable instanceof Unit && !((Unit) ownable).canAct) {
          return TileMeta.OWN_USED;
        } else {
          return TileMeta.OWN;
        }
      } else if (owner.team == actor.team) {
        return TileMeta.ALLIED;

      } else {
        return TileMeta.ENEMY;
      }
    } else {
      return TileMeta.EMPTY;
    }
  }

  default boolean isUsable(UserInteractionData uiData) {
    TileMeta sourceUnit = extractPositionMeta(uiData.source.unit, uiData.actor);
    TileMeta targetUnit = extractPositionMeta(uiData.target.unit, uiData.actor);
    TileMeta sourceProperty = extractPositionMeta(uiData.source.property, uiData.actor);
    TileMeta targetProperty = extractPositionMeta(uiData.target.property, uiData.actor);

    if (uiData.source.tile == uiData.target.tile) {
      targetUnit = TileMeta.EMPTY;
    }

    return checkSource(sourceUnit, sourceProperty) && checkTarget(targetUnit, targetProperty) && condition(uiData);
  }

  /**
   * Invokes the action with a given set of arguments.
   * 
   * @param delta
   * @param data
   * @param stateTransition
   */
  void evaluateByData(int delta, ActionData data, StateFlowData stateTransition);

  /**
   * 
   * @param data
   * @return
   */
  default boolean isDataEvaluationCompleted(ActionData data) {
    return true;
  }

  /**
   * 
   * @param delta
   * @param gfx
   * @param data
   */
  default void renderByData(int delta, GraphicManager gfx, ActionData data) {

  }
}
