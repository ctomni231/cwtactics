package org.wolftec.cwt.logic.actions;

import org.wolftec.cwt.logic.Action;
import org.wolftec.cwt.logic.ActionData;
import org.wolftec.cwt.logic.ActionManager;
import org.wolftec.cwt.logic.ActionType;
import org.wolftec.cwt.logic.features.LifecycleLogic;
import org.wolftec.cwt.logic.features.TurnLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.StateFlowData;
import org.wolftec.cwt.states.UserInteractionData;

public class NextTurn implements Action {

  private TurnLogic turn;
  private LifecycleLogic life;
  private ActionManager actions;
  private UserInteractionData uiData;
  private ModelManager model;
  private ChangeWeather changeWeather;

  @Override
  public String key() {
    return "nextTurn";
  }

  @Override
  public boolean noAutoWait() {
    return true;
  }

  @Override
  public ActionType type() {
    return ActionType.MAP_ACTION;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    turn.stopTurn();

    if (life.isGameroundEnded()) {
      stateTransition.setTransitionTo("IngameLeaveState");
    }

    if (model.weatherLeftDays == 0) {
      ActionData weatherChangeData = actions.acquireData();
      changeWeather.fillData(uiData, weatherChangeData);
      actions.localActionData(changeWeather.key(), weatherChangeData, false);
    }
  }
}
