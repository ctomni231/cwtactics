package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class WeatherData implements Component {

  public int    leftDays;
  public String weather;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("leftDays").integer().ge(0);

    data.desc("weather").componentEntity(Weather.class);
  }
}
