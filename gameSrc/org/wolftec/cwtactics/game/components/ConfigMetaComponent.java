package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.IEntityComponent;

public class ConfigMetaComponent implements IEntityComponent {
  public int lowerBound;
  public int upperBound;
  public int changeValue;
  public int defaultValue;
}
