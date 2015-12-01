package org.wolftec.cwt.model.actions;

import org.stjs.javascript.annotation.SyntheticType;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.controller.ui.UserInteractionData;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.stjs.ClassUtil;
import org.wolftec.cwt.model.ActionData;
import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.MoveMeta;
import org.wolftec.cwt.model.TargetSelectionMode;
import org.wolftec.cwt.model.TileMeta;
import org.wolftec.cwt.model.gameround.Battlefield;
import org.wolftec.cwt.model.gameround.Ownable;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.model.sheets.SheetDatabase;
import org.wolftec.cwt.view.GraphicManager;

/**
 * Action class which represents an action which is usable by engine objects.
 */
public abstract class AbstractAction<A, B, C, D, E> {

  @SyntheticType
  public static class ControllerData {
    public UserInteractionData ui;
    public StateFlowData transition;
    public ActionData data;
    public int delta;
  }

  @SyntheticType
  public static class ModelData {
    public Battlefield battlefield;
    public SheetDatabase typeDB;
  }

  /**
   * Key ID of the action.
   */
  public String key() {
    return ClassUtil.getClassName(this);
  }

  /**
   * Type of the action.
   */
  public abstract ActionType type();

  /**
   * Condition function which checks the availability of the action with the
   * current state data.
   */
  public boolean condition(ModelData model, ControllerData controller) {
    return true;
  }

  public boolean hasSubMenu() {
    return false;
  }

  /**
   * Prepares the menu for a given state data.
   */
  public void prepareActionMenu(ModelData model, ControllerData controller) {
  }

  /**
   * Checks the correctness of a given target position.
   */
  public boolean isTargetValid(ModelData model, ControllerData controller) {
    return true;
  }

  /**
   * Adds all possible targets into the state selection.
   */
  public void prepareTargets(ModelData model, ControllerData controller) {
  }

  /**
   * Marks the kind of the action. Multistep actions can flush more than one
   * command into the command stack.
   */
  public boolean multiStepAction() {
    return false;
  }

  /**
   * Prepares the selection.
   */
  public void prepareSelection(ModelData model, ControllerData controller) {

  }

  public MoveMeta positionUpdateMode() {
    return MoveMeta.SET_POSITION;
  }

  /**
   * Marks the target selection mode. Mode 'A' will be done before the sub menu.
   * Mode 'B' will be done after the sub menu.
   */
  public TargetSelectionMode targetSelectionType() {
    return TargetSelectionMode.A;
  }

  /**
   * If true, then flusher won't push a 'wait' command. This is only usable for
   * unit actions.
   */
  public boolean noAutoWait() {
    return false;
  }

  public boolean checkSource(TileMeta unitFlag, TileMeta propertyFlag) {
    switch (type()) {

      case UNIT_ACTION:
        return unitFlag == TileMeta.OWN;

      case PROPERTY_ACTION:
        return unitFlag != TileMeta.OWN && propertyFlag == TileMeta.OWN;

      case MAP_ACTION:
        return unitFlag != TileMeta.OWN && propertyFlag != TileMeta.OWN;

      case CLIENT_ACTION:

      case ENGINE_MAP_ACTION:
      default:
        return false;
    }
  }

  public boolean checkTarget(TileMeta unitFlag, TileMeta propertyFlag) {
    switch (type()) {

      case UNIT_ACTION:
        return unitFlag == TileMeta.EMPTY;

      default:
        return unitFlag == TileMeta.EMPTY;
    }
  }

  public void fillData(ModelData model, ControllerData controller) {

  }

  public void checkData(ModelData model, ActionData data) {

  }

  public TileMeta extractPositionMeta(Ownable ownable, Player actor) {
    if (NullUtil.isPresent(ownable)) {
      Player owner = ownable.getOwner();

      if (owner == null) {
        return TileMeta.NEUTRAL;

      } else if (owner == actor) {
        if (ownable instanceof Unit && !((Unit) ownable).usable.canAct()) {
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

  public boolean isUsable(ModelData model, ControllerData controller) {
    UserInteractionData ui = controller.ui;

    TileMeta sourceUnit = extractPositionMeta(ui.source.unit, ui.actor);
    TileMeta targetUnit = extractPositionMeta(ui.target.unit, ui.actor);
    TileMeta sourceProperty = extractPositionMeta(ui.source.property, ui.actor);
    TileMeta targetProperty = extractPositionMeta(ui.target.property, ui.actor);

    if (ui.source.tile == ui.target.tile) {
      targetUnit = TileMeta.EMPTY;
    }

    return checkSource(sourceUnit, sourceProperty) && checkTarget(targetUnit, targetProperty) && condition(model, controller);
  }

  /**
   * Invokes the action with a given set of arguments.
   * 
   * @param delta
   * @param data
   * @param stateTransition
   */
  public abstract void evaluateByData(ModelData model, ControllerData controller);

  /**
   * 
   * @param data
   * @return
   */
  public boolean isDataEvaluationCompleted(ControllerData execution) {
    return true;
  }

  /**
   * 
   * @param delta
   * @param gfx
   * @param data
   */
  public void renderByData(int delta, GraphicManager gfx, ActionData data) {

  }
}
