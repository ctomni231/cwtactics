package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.controller.actions.core.ActionType;
import org.wolftec.cwt.core.SheetIdNumberUtil;
import org.wolftec.cwt.model.tags.TagValue;

public class GameroundChangeWeatherAction extends AbstractAction {

  private final GameroundRecalcVisionAction recalcVision;

  private TagValue cfgMinDays;
  private TagValue cfgRandomDays;

  public GameroundChangeWeatherAction(GameroundRecalcVisionAction recalcVision) {
    this.recalcVision = recalcVision;

    cfgMinDays = new TagValue("weather.mindays", 1, 5, 1);
    cfgRandomDays = new TagValue("weather.randomdays", 0, 5, 4);
  }

  @Override
  public String key() {
    return "changeWeather";
  }

  @Override
  public ActionType type() {
    return ActionType.ENGINE_ACTION;
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    String nextWeather = model.battlefield.weather.pickRandomWeatherId();
    controller.data.p1 = SheetIdNumberUtil.convertIdToNumber(nextWeather);
    controller.data.p2 = model.battlefield.weather.pickRandomWeatherTime(nextWeather, cfgMinDays.value, cfgRandomDays.value);
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    model.battlefield.weather.changeWeather(SheetIdNumberUtil.convertNumberToId(controller.data.p1), controller.data.p2);
    recalcVision.evaluateByData(model, controller);
  }

}
