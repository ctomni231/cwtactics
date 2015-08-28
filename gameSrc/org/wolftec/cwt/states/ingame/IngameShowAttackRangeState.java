package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.GameActions;
import org.wolftec.cwt.states.StateTransition;

public class IngameShowAttackRangeState extends AbstractState {

  // enter: function () {
  // stateData.focusMode = image.Sprite.FOCUS_ATTACK;
  // attack.fillRangeMap(stateData.source.unit, stateData.source.x,
  // stateData.source.y, stateData.selection);
  // renderer.renderFocusOnScreen();
  // },
  //
  // exit: function () {
  // renderer.layerEffects.clear();
  // renderer.layerFocus.clearAll();
  // stateData.selection.clear();
  // },
  //
  // CANCEL: function () {
  // stateData.focusMode = constants.INACTIVE;
  // this.changeState("INGAME_IDLE");
  // }

  @Override
  public void update(StateTransition transition, int delta) {
    if (!input.isActionPressed(GameActions.BUTTON_B)) {
      transition.setTransitionTo(transition.getPreviousState().get());
    }
  }
}
