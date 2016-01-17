package org.wolftec.cwt.action.actions;

import org.wolftec.cwt.action.Action;
import org.wolftec.cwt.action.ActionData;
import org.wolftec.cwt.action.ActionService;
import org.wolftec.cwt.action.ActionType;
import org.wolftec.cwt.logic.LifecycleLogic;
import org.wolftec.cwt.logic.TurnLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.ui.UserInteractionData;

public class NextTurn implements Action
{

  private TurnLogic turn;
  private LifecycleLogic life;
  private ActionService actions;
  private UserInteractionData uiData;
  private ModelManager model;
  private ChangeWeather changeWeather;

  @Override
  public String key()
  {
    return "nextTurn";
  }

  @Override
  public boolean noAutoWait()
  {
    return true;
  }

  @Override
  public ActionType type()
  {
    return ActionType.MAP_ACTION;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition)
  {
    turn.stopTurn();

    if (life.isGameroundEnded())
    {
      stateTransition.setTransitionTo("IngameLeaveState");
    }

    if (model.weatherLeftDays == 0)
    {
      ActionData weatherChangeData = actions.acquireData();
      changeWeather.fillData(uiData, weatherChangeData);
      actions.localActionData(changeWeather.key(), weatherChangeData, false);
    }
  }
}
