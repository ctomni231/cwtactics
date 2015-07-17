package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Weather implements Component {
  public boolean defaultWeather;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("defaultWeather")
        .bool()
        .def(false);
  }
}
