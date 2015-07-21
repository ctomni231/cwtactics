package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

// TODO remove this as component
public class ValueMetaData implements Component {
  public int lowerBound;
  public int upperBound;
  public int changeValue;
  public int defaultValue;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("lowerBound").integer();

    data.desc("upperBound").integer();

    data.desc("changeValue").integer().def(1);

    data.desc("defaultValue").integer();
  }
}
