package org.wolftec.cwt.states.ingame;

import org.stjs.javascript.Array;
import org.wolftec.cwt.collection.ListUtil;
import org.wolftec.cwt.input.InputService;
import org.wolftec.cwt.logic.TurnLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.persistence.MapManager;
import org.wolftec.cwt.serialization.SavegameHandler;
import org.wolftec.cwt.states.base.AbstractState;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.ui.UiDataMapConfiguration;
import org.wolftec.cwt.ui.UserInteractionData;
import org.wolftec.cwt.util.JsUtil;

public class IngameEnterState extends AbstractState
{

  private ModelManager        model;
  private MapManager          maps;
  private UserInteractionData uiData;

  private TurnLogic turnLogic;

  private UiDataMapConfiguration mapData;
  private Array<SavegameHandler> gameHandlers;

  private boolean loaded;

  @Override
  public void onEnter(StateFlowData transition)
  {
    loaded = false;

    // HINT
    mapData.selectedMap = "testmap.json";

    maps.loadMap(mapData.selectedMap, (data) ->
    {
      try
      {
        ListUtil.forEachArrayValue(gameHandlers, (index, handler) ->
        {
          handler.onGameLoad(data);
        });
        prepareModel(mapData);

        uiData.cursorX = 0;
        uiData.cursorY = 0;

        loaded = true;

      }
      catch (Exception e)
      {
        JsUtil.throwError("Could not load map (" + e + ")");
      }
    });
  }

  @Override
  public void update(StateFlowData transition, int delta, InputService input)
  {
    if (loaded)
    {
      transition.setTransitionTo("IngameIdleState");
    }
  }

  private void prepareModel(UiDataMapConfiguration data)
  {
    turnLogic.startsTurn(model.turnOwner);
  }
}
