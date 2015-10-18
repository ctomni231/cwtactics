package org.wolftec.cwt.states.menu;

import org.stjs.javascript.JSCollections;
import org.wolftec.cwt.core.env.ResetSystem;
import org.wolftec.cwt.core.state.AbstractMenuState;
import org.wolftec.cwt.core.state.GameActions;
import org.wolftec.cwt.core.state.StateFlowData;

public class WipeoutConfirmMenuState extends AbstractMenuState {

  private static final String UIC_YES = "YES";
  private static final String UIC_NO  = "NO";

  private ResetSystem         reset;

  @Override
  public void onConstruction() {
    ui.registerMulti(UIC_YES, JSCollections.$array(GameActions.BUTTON_LEFT, GameActions.BUTTON_RIGHT), UIC_NO);
    ui.registerMulti(UIC_NO, JSCollections.$array(GameActions.BUTTON_LEFT, GameActions.BUTTON_RIGHT), UIC_YES);
  }

  @Override
  public void onEnter(StateFlowData transition) {
    ui.setState(UIC_NO);
  }

  @Override
  public void handleButtonA(StateFlowData transition, int delta, String currentUiState) {

    switch (currentUiState) {

      case UIC_YES:
        reset.wipeAndReload();
        break;

      case UIC_NO:
        transition.setTransitionTo(transition.getPreviousState().get());
        break;
    }
  }

}
