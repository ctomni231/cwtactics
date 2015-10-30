package org.wolftec.cwt.states.menu;

import org.stjs.javascript.JSCollections;
import org.wolftec.wTec.state.AbstractMenuState;
import org.wolftec.wTec.state.GameActions;
import org.wolftec.wTec.state.StateFlowData;

public class MainMenuState extends AbstractMenuState {

  private static final String UIC_OPTIONS  = "OPTIONS";
  private static final String UIC_SKIRMISH = "SKIRMISH";

  @Override
  public void onConstruction() {
    ui.registerMulti(UIC_SKIRMISH, JSCollections.$array(GameActions.BUTTON_UP, GameActions.BUTTON_DOWN), UIC_OPTIONS);
    ui.registerMulti(UIC_OPTIONS, JSCollections.$array(GameActions.BUTTON_UP, GameActions.BUTTON_DOWN), UIC_SKIRMISH);
  }

  @Override
  public void onEnter(StateFlowData transition) {
    ui.setState(UIC_SKIRMISH);
  }

  @Override
  public void handleButtonA(StateFlowData transition, int delta, String currentUiState) {
    switch (ui.getState()) {

      case UIC_OPTIONS:
        transition.setTransitionTo("OptionsMenuState");
        break;

      case UIC_SKIRMISH:
        transition.setTransitionTo("MapSelectionMenuState");
        break;
    }
  }
}
