package org.wolftec.cwtactics.game.config;

import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class ValueMetaData implements Component {
  public int lowerBound;
  public int upperBound;
  public int changeValue;
  public int defaultValue;
}
