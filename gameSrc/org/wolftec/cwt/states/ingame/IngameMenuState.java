package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.ErrorManager;
import org.wolftec.cwt.states.AbstractIngameState;
import org.wolftec.cwt.states.StateTransition;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.system.ClassUtil;

public class IngameMenuState extends AbstractIngameState {

  private UserInteractionData data;

  private ErrorManager errors;

  @Override
  public void onEnter(StateTransition transition) {
    data.cleanInfos();

    // TODO
    // stateData.menu.generate();

    if (data.getNumberOfInfos() == 0) {
      errors.raiseError("NoUnitActionAvailable", ClassUtil.getClassName(IngameMenuState.class));
    }
  }

  @Override
  public void update(StateTransition transition, int delta) {
    // if (input.isActionPressed(GameActions.BUTTON_LEFT)) {
    //
    // } else if (input.isActionPressed(GameActions.BUTTON_RIGHT)) {
    //
    // } else if (input.isActionPressed(GameActions.BUTTON_UP)) {
    // var res = renderer.handleMenuInput(input.TYPE_UP);
    // if (res === 2) renderer.prepareMenu();
    // if (res >= 1) updateMenuData();
    //
    // } else if (input.isActionPressed(GameActions.BUTTON_DOWN)) {
    // var res = renderer.handleMenuInput(input.TYPE_DOWN);
    // if (res === 2) renderer.prepareMenu();
    // if (res >= 1) updateMenuData();
    //
    // } else if (input.isActionPressed(GameActions.BUTTON_A)) {
    // var actName = stateData.menu.getContent();
    // var actObj = action.getAction(actName);
    //
    // // select action in data
    // stateData.action.selectedEntry = actName;
    // stateData.action.object = actObj;
    //
    // // calculate next state from the given action object
    // var next = null;
    // if (actObj.prepareMenu !== null) {
    // next = "INGAME_SUBMENU";
    // } else if (actObj.isTargetValid !== null) {
    // next = "INGAME_SELECT_TILE";
    // } else if (actObj.prepareTargets !== null && actObj.targetSelectionType
    // === "A") {
    // next = "INGAME_SELECT_TILE_TYPE_A";
    // } else {
    // next = "INGAME_FLUSH_ACTION";
    // }
    //
    // if (constants.DEBUG) assert(next);
    // this.changeState(next);
    //
    // } else if (input.isActionPressed(GameActions.BUTTON_B)) {
    // var unit = stateData.source.unit;
    // var next = null;
    //
    // if (unit && unit.owner.activeClientPlayer) {
    // // unit was selected and it is controlled by the active player, so it
    // means that this unit is the acting unit
    // // -> go back to *INGAME_MOVEPATH* state without erasing the existing
    // move data
    //
    // stateData.preventMovePathGeneration = true;
    // next = "INGAME_MOVEPATH";
    //
    // } else {
    // next = "INGAME_IDLE";
    // }
    //
    // this.changeState(next);
    //
    // return Option.of(lastState);
    // }
    // return NO_TRANSITION;
  }
}
