package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.input.InputProvider;
import org.wolftec.cwt.states.AbstractIngameState;
import org.wolftec.cwt.states.StateTransition;

public class IngamePushActionState extends AbstractIngameState {

  @Override
  public void update(StateTransition transition, int delta, InputProvider input) {

  }

  // var trapped = stateData.buildFromData();
  // var next = null;
  //
  // if (!trapped && stateData.action.object.multiStepAction) {
  // stateData.multiStepActive = true;
  //
  // /*
  // if( !controller.stateMachine.data.breakMultiStep ){
  // controller.stateMachine.event("nextStep");
  // } else {
  // controller.stateMachine.event("nextStepBreak");
  // }
  // */
  //
  // next = "INGAME_MULTISTEP_IDLE";
  // } else {
  // next = "INGAME_IDLE";
  // }
  //
  // this.changeState(next);
}
