package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.core.util.SheetIdNumberUtil;
import org.wolftec.cwt.logic.FogLogic;
import org.wolftec.cwt.logic.WeatherLogic;
import org.wolftec.cwt.states.StateFlowData;
import org.wolftec.cwt.states.UserInteractionData;

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
    // TODO recognize current weather
    String weatherId = weather.pickRandomWeatherId();
    actionData.p1 = SheetIdNumberUtil.toNumber(weatherId);
    actionData.p2 = weather.pickRandomWeatherTime(weatherId);
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    weather.changeWeather(SheetIdNumberUtil.toId(data.p1), data.p2);
    fog.fullRecalculation();
  }

}
