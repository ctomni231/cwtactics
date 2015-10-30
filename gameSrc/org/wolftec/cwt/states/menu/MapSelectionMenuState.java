package org.wolftec.cwt.states.menu;

import org.wolftec.cwt.model.persistence.MapManager;
import org.wolftec.cwt.wotec.input.InputProvider;
import org.wolftec.cwt.wotec.state.AbstractState;
import org.wolftec.cwt.wotec.state.GameActions;
import org.wolftec.cwt.wotec.state.StateFlowData;

public class MapSelectionMenuState extends AbstractState {

  private MapManager maps;

  private int selectedMap;

  @Override
  public void onConstruction() {
    selectedMap = 0;
  }

  @Override
  public void update(StateFlowData transition, int delta, InputProvider input) {

    if (input.isActionPressed(GameActions.BUTTON_LEFT)) {
      selectedMap--;
      if (selectedMap < 0) {
        selectedMap = maps.getNumberOfMaps() - 1;
      }

    } else if (input.isActionPressed(GameActions.BUTTON_RIGHT)) {
      selectedMap++;
      if (selectedMap == maps.getNumberOfMaps()) {
        selectedMap = 0;
      }

    }
    if (input.isActionPressed(GameActions.BUTTON_A)) {
      transition.setTransitionTo("PlayerSetupMenuState");
    }
  }
}
