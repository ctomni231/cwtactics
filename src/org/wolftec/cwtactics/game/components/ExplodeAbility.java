package org.wolftec.cwtactics.game.components;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class ExplodeAbility implements Component {

  public int           damage;
  public int           range;
  public Array<String> noDamage;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("damage")
        .integer()
        .ge(10)
        .le(100);

    data.desc("range")
        .integer()
        .ge(2)
        .le(10);

    data.desc("noDamage")
        .list()
        .values((valDesc) -> valDesc.componentEntity(Living.class));
  }
}
