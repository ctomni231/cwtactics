package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.IEntityComponent;

public class ValueMetaData implements IEntityComponent {
  public int lowerBound;
  public int upperBound;
  public int changeValue;
  public int defaultValue;
}
