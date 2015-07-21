package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Visible implements Component {
  public boolean blocksVision;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("blocksVision").bool();
  }
}
