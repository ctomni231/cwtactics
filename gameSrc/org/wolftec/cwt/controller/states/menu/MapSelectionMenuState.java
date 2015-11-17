package org.wolftec.cwt.controller.states.menu;

import org.wolftec.cwt.controller.states.base.State;
import org.wolftec.cwt.controller.states.base.GameActionConstants;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.model.persistence.MapManager;
import org.wolftec.cwt.view.input.InputService;

public class MapSelectionMenuState extends State {

  private MapManager maps;

  private int selectedMap;

  @Override
  public void onConstruction() {
    selectedMap = 0;
  }

  @Override
  public void update(StateFlowData transition, int delta, InputService input) {

    if (input.isActionPressed(GameActionConstants.BUTTON_LEFT)) {
      selectedMap--;
      if (selectedMap < 0) {
        selectedMap = maps.getNumberOfMaps() - 1;
      }

    } else if (input.isActionPressed(GameActionConstants.BUTTON_RIGHT)) {
      selectedMap++;
      if (selectedMap == maps.getNumberOfMaps()) {
        selectedMap = 0;
      }

    }
    if (input.isActionPressed(GameActionConstants.BUTTON_A)) {
      transition.setTransitionTo("PlayerSetupMenuState");
    }
  }
}
