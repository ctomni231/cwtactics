package org.wolftec.cwt.states.actions;

import org.wolftec.cwt.actions.Action;
import org.wolftec.cwt.actions.ActionData;
import org.wolftec.cwt.actions.ActionType;
import org.wolftec.cwt.actions.UserInteractionData;
import org.wolftec.cwt.logic.FogLogic;
import org.wolftec.cwt.logic.WeatherLogic;
import org.wolftec.cwt.system.StringNumberConverter;

public class ChangeWeather implements Action {

  private FogLogic     fog;
  private WeatherLogic weather;

  @Override
  public String key() {
    return "changeWeather";
  }

  @Override
  public ActionType type() {
    return ActionType.ENGINE_ACTION;
  }

  @Override
  public void fillData(UserInteractionData positionData, ActionData actionData) {
    String weatherId = weather.pickRandomWeatherId();
    actionData.p1 = StringNumberConverter.toInt(weatherId);
    actionData.p2 = weather.pickRandomWeatherTime(weatherId);
  }

  @Override
  public void invoke(ActionData data) {
    weather.changeWeather(StringNumberConverter.toId(data.p1), data.p2);
    fog.fullRecalculation();
  }

}
