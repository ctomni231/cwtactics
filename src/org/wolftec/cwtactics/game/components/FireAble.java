package org.wolftec.cwtactics.game.components;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class FireAble implements Component {

  public Array<String> usableBy;
  public int           damage;
  public int           range;
  public String        changesType;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("usableBy").list().values((sdata) -> sdata.componentEntity(Living.class));

    data.desc("damage").integer().ge(10).le(100);

    data.desc("range").integer().ge(1).le(10);

    data.desc("changesType").isString().def("");
  }
}
