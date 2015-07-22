package org.wolftec.cwt.actions;

import org.stjs.javascript.Array;

/**
 * Action class which represents an action which is usable by engine objects.
 */
public interface Action {

  /**
   * Key ID of the action.
   */
  String key();

  default PositionUpdateMode positionUpdateMode() {
    return PositionUpdateMode.SET_POSITION;
  }

  /**
   * Type of the action.
   */
  ActionType type();

  void action();

  /**
   * Condition function which checks the availability of the action with the
   * current state data.
   */
  boolean condition();

  /**
   * Prepares the menu for a given state data.
   */
  default void prepareMenu() {
  }

  /**
   * Checks the correctness of a given target position.
   */
  default boolean isTargetValid() {
    return false;
  }

  /**
   * Adds all possible targets into the state selection.
   */
  default void prepareTargets() {
  }

  /**
   * Marks the kind of the action. Multistep actions can flush more than one
   * command into the command stack.
   */
  default void multiStepAction() {
  }

  /**
   * Prepares the selection.
   */
  default void prepareSelection() {

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

  /**
   * Shows the needed unit to unit relation mode.
   */
  default Object relation() {
    return null;
  }

  /**
   * Shows the needed unit to property relation mode.
   */
  Array<Integer> relationToProp();

  /**
   * Invokes the action with a given set of arguments.
   */
  void invoke();
}
