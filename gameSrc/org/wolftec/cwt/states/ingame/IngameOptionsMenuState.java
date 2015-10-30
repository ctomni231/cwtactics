package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.states.menu.OptionsMenuState;
import org.wolftec.wTec.state.StateFlowData;

public class IngameOptionsMenuState extends OptionsMenuState {
  @Override
  public void handleButtonA(StateFlowData transition, int delta, String currentUiState) {

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
