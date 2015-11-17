package org.wolftec.cwt.controller.states.gameround;

import org.stjs.javascript.Array;
import org.wolftec.cwt.controller.states.base.State;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.controller.ui.UiDataMapConfiguration;
import org.wolftec.cwt.controller.ui.UserInteractionData;
import org.wolftec.cwt.core.collection.ListUtil;
import org.wolftec.cwt.core.javascript.JsUtil;
import org.wolftec.cwt.core.persistence.SavegameHandler;
import org.wolftec.cwt.logic.TurnLogic;
import org.wolftec.cwt.model.gameround.GameroundEnder;
import org.wolftec.cwt.model.persistence.MapManager;
import org.wolftec.cwt.view.input.InputService;

public class IngameEnterState extends State {

  private GameroundEnder model;
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
  public void update(StateFlowData transition, int delta, InputService input) {
    if (loaded) {
      transition.setTransitionTo("IngameIdleState");
    }
  }

  private void prepareModel(UiDataMapConfiguration data) {
    turnLogic.startsTurn(model.turnOwner);
  }
}
