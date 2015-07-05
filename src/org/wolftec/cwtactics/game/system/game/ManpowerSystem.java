package org.wolftec.cwtactics.game.system.game;

import org.wolftec.cwtactics.game.components.game.Manpower;
import org.wolftec.cwtactics.game.components.game.Owner;
import org.wolftec.cwtactics.game.core.Components;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.UnitCreatedEvent;
import org.wolftec.cwtactics.game.event.game.gameround.GameroundStart;

/**
 * The {@link ManpowerSystem} gives players the restriction to pay an additional
 * resource per unit. This resource is manpower which is not expendable during
 * the game round and the player won't be able to produce units when the
 * manpower falls down to zero.
 * 
 */
public class ManpowerSystem implements System, UnitCreatedEvent, GameroundStart {

  private Components<Owner> owners;
  private Components<Manpower> manpowers;

  @Override
  public void gameroundStart() {
    manpowers.each((entity, mp) -> mp.manpower = 100000);
  }

  @Override
  public void unitCreatedEvent(String unitEntity) {
    manpowers.get(owners.get(unitEntity).owner).manpower--;
  }
}
