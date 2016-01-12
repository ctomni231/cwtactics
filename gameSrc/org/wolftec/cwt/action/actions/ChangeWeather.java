package org.wolftec.cwt.action.actions;

import org.wolftec.cwt.action.Action;
import org.wolftec.cwt.action.ActionData;
import org.wolftec.cwt.action.ActionType;
import org.wolftec.cwt.logic.FogLogic;
import org.wolftec.cwt.logic.WeatherLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.sheets.types.WeatherType;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.ui.UserInteractionData;
import org.wolftec.cwt.util.SheetIdNumberUtil;

public class ChangeWeather implements Action
{

  private FogLogic     fog;
  private WeatherLogic weather;

  private ModelManager model;

  @Override
  public String key()
  {
    return "changeWeather";
  }

  @Override
  public ActionType type()
  {
    return ActionType.ENGINE_ACTION;
  }

  @Override
  public void fillData(UserInteractionData positionData, ActionData actionData)
  {
    WeatherType nextWeather = weather.pickRandomWeatherId(model.weather);
    actionData.p1 = SheetIdNumberUtil.convertIdToNumber(nextWeather.ID);
    actionData.p2 = weather.pickRandomWeatherTime(nextWeather);
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition)
  {
    weather.changeWeather(SheetIdNumberUtil.convertNumberToId(data.p1), data.p2);
    fog.fullRecalculation();
  }

}
