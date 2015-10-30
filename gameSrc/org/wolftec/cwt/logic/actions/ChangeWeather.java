package org.wolftec.cwt.logic.actions;

import org.wolftec.cwt.logic.features.FogLogic;
import org.wolftec.cwt.logic.features.WeatherLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.sheets.types.WeatherType;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.util.SheetIdNumberUtil;
import org.wolftec.cwt.wotec.action.Action;
import org.wolftec.cwt.wotec.action.ActionData;
import org.wolftec.cwt.wotec.action.ActionType;
import org.wolftec.cwt.wotec.state.StateFlowData;

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
    actionData.p1 = SheetIdNumberUtil.convertIdToNumber(nextWeather.ID);
    actionData.p2 = weather.pickRandomWeatherTime(nextWeather);
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    weather.changeWeather(SheetIdNumberUtil.convertNumberToId(data.p1), data.p2);
    fog.fullRecalculation();
  }

}
