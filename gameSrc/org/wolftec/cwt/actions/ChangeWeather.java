package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.core.util.SheetIdNumberUtil;
import org.wolftec.cwt.logic.FogLogic;
import org.wolftec.cwt.logic.WeatherLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.sheets.types.WeatherType;
import org.wolftec.cwt.states.UserInteractionData;

public class ChangeWeather implements Action {

  private FogLogic     fog;
  private WeatherLogic weather;

  private ModelManager model;

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
    WeatherType nextWeather = weather.pickRandomWeatherId(model.weather);
    actionData.p1 = SheetIdNumberUtil.toNumber(nextWeather.ID);
    actionData.p2 = weather.pickRandomWeatherTime(nextWeather);
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    weather.changeWeather(SheetIdNumberUtil.toId(data.p1), data.p2);
    fog.fullRecalculation();
  }

}
