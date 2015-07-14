package org.wolftec.cwtactics.game.manpower;

import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.gameround.GameroundStart;
import org.wolftec.cwtactics.game.event.gameround.UnitCreated;
import org.wolftec.cwtactics.game.player.Owner;

/**
 * The {@link ManpowerSystem} gives players the restriction to pay an additional
 * resource per unit. This resource is manpower which is not expendable during
 * the game round and the player won't be able to produce units when the
 * manpower falls down to zero.
 * 
 */
public class ManpowerSystem implements System, UnitCreated, GameroundStart {

  private Components<Owner>    owners;
  private Components<Manpower> manpowers;

  @Override
  public void gameroundStart() {
    manpowers.each((entity, mp) -> mp.manpower = 100000);
  }

  @Override
  public void onUnitCreated(String unitEntity) {
    manpowers.get(owners.get(unitEntity).owner).manpower--;
  }
}
