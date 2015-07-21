package org.wolftec.cwtactics.game.components;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Factory implements Component {
  public Array<String> builds;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("builds").list().values((valData) -> valData.componentEntity(Buyable.class));
  }
}
