package org.wolftec.cwt.controller.states.gameround;

import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.controller.states.menu.OptionsMenuState;

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
