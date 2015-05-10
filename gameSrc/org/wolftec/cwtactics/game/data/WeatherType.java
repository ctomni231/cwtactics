package org.wolftec.cwtactics.game.data;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.engine.ischeck.Is;

public class WeatherType extends ObjectType {

  public boolean isDefaultWeather = false;

  @Override
  protected void validateData(Array<String> errors) {
    checkExpression(Is.is.bool(isDefaultWeather), errors, "isDefaultWeather");
  }
}
