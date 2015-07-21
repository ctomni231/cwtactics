package org.wolftec.cwtactics.game.components;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class SupplierAbility implements Component {

  public boolean       refillLoads;
  public Array<String> supplies;

  @Override
  public void describe(DataDescriptor data) {

    data.desc("refillLoads").bool().def(false);

    data.desc("supplies").list().values((valData) -> valData.isString());
  }
}
