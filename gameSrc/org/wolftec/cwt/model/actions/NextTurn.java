package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.action.ActionService;
import org.wolftec.cwt.controller.actions.core.ActionData;
import org.wolftec.cwt.controller.actions.core.ActionType;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.controller.ui.UserInteractionData;
import org.wolftec.cwt.logic.LifecycleLogic;
import org.wolftec.cwt.logic.TurnLogic;
import org.wolftec.cwt.model.gameround.Battlefield;

public class NextTurn implements AbstractAction {

  private TurnLogic turn;
  private LifecycleLogic life;
  private ActionService actions;
  private UserInteractionData uiData;
  private Battlefield model;
  private GameroundChangeWeatherAction changeWeather;

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

    if (model.weather.leftDays == 0) {
      ActionData weatherChangeData = actions.acquireData();
      changeWeather.fillData(uiData, weatherChangeData);
      actions.localActionData(changeWeather.key(), weatherChangeData, false);
    }
  }
}
