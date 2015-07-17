package org.wolftec.cwtactics.game.components;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Repairer implements Component {

  public int           amount;
  public Array<String> targets;

  @Override
  public void describe(DataDescriptor data) {

    data.desc("amount")
        .integer()
        .ge(10)
        .le(100);

    data.desc("targets")
        .componentEntity(Living.class);
  }
}
