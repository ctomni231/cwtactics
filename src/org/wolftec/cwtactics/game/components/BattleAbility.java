package org.wolftec.cwtactics.game.components;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class BattleAbility implements Component {

  public int                  ammo;
  public int                  maxRange;
  public int                  minRange;
  public Map<String, Integer> primaryDamage;
  public Map<String, Integer> secondayDamage;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("ammo")
        .integer()
        .def(-1)
        .ge(-1)
        .le(10);

    data.desc("minRange")
        .integer()
        .def(1)
        .ge(1)
        .le(10);

    data.desc("maxRange")
        .integer()
        .def(1)
        .ge(1)
        .le(10);

    data.desc("primaryDamage")
        .map()
        .def(JSCollections.$map())
        .keys((keyDesc) -> keyDesc.componentEntity(Buyable.class))
        .values((valDesc) -> valDesc.integer()
                                    .ge(0)
                                    .le(1000));

    data.desc("secondayDamage")
        .map()
        .keys((keyDesc) -> keyDesc.componentEntity(Buyable.class))
        .values((valDesc) -> valDesc.integer()
                                    .ge(0)
                                    .le(1000));
  }
}
