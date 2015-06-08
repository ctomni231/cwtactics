package org.wolftec.cwtactics.game.components.old;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.engine.ischeck.Is;

public class WeatherType extends ObjectType {

  public boolean isDefaultWeather = false;

  @Override
  protected void validateData(Array<String> errors) {
    checkExpression(Is.is.bool(isDefaultWeather), errors, "isDefaultWeather");
  }

  @Override
  public void grabDataFromMap(Map<String, Object> data) {
    isDefaultWeather = grabMapValue(data, "isDefaultWeather", false);
  }
}
