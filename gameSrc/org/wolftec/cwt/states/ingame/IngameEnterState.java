package org.wolftec.cwt.states.ingame;

import org.stjs.javascript.Array;
import org.wolftec.cwt.logic.features.TurnLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.persistence.MapManager;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.StateFlowData;
import org.wolftec.cwt.states.UiDataMapConfiguration;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.system.InputProvider;
import org.wolftec.cwt.system.SavegameHandler;
import org.wolftec.cwt.util.JsUtil;
import org.wolftec.cwt.util.ListUtil;

public class IngameEnterState extends AbstractState {

  private ModelManager model;
  private MapManager maps;
  private UserInteractionData uiData;

  private TurnLogic turnLogic;

  private UiDataMapConfiguration mapData;
  private Array<SavegameHandler> gameHandlers;

  private boolean loaded;

  @Override
  public void onEnter(StateFlowData transition) {
    loaded = false;

    // HINT
    mapData.selectedMap = "testmap.json";

    maps.loadMap(mapData.selectedMap, (data) -> {
      try {
        ListUtil.forEachArrayValue(gameHandlers, (index, handler) -> {
          handler.onGameLoad(data);
        });
        prepareModel(mapData);

        uiData.cursorX = 0;
        uiData.cursorY = 0;

        loaded = true;

      } catch (Exception e) {
        JsUtil.throwError("Could not load map (" + e + ")");
      }
    });
  }

  @Override
  public void update(StateFlowData transition, int delta, InputProvider input) {
    if (loaded) {
      transition.setTransitionTo("IngameIdleState");
    }
  }

  private void prepareModel(UiDataMapConfiguration data) {
    turnLogic.startsTurn(model.turnOwner);
  }
}
