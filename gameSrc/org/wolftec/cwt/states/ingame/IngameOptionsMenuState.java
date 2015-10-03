package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.states.StateTransition;
import org.wolftec.cwt.states.menu.OptionsMenuState;

public class IngameOptionsMenuState extends OptionsMenuState {
  @Override
  public void handleButtonA(StateTransition transition, int delta, String currentUiState) {

    switch (currentUiState) {

      case OptionsMenuState.UIC_BACK:
        saving.saveAppData((saveError) -> {
          transition.setTransitionTo("IngameIdleState");
        });
        return;
    }

    super.handleButtonA(transition, delta, currentUiState);
  }

}
