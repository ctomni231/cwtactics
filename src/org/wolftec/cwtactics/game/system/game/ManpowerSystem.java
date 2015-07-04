package org.wolftec.cwtactics.game.system.game;

import org.wolftec.cwtactics.game.ComponentHolder;
import org.wolftec.cwtactics.game.components.game.Manpower;
import org.wolftec.cwtactics.game.components.game.Owner;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.GameroundEvents;
import org.wolftec.cwtactics.game.event.UnitCreatedEvent;

/**
 * The {@link ManpowerSystem} gives players the restriction to pay an additional
 * resource per unit. This resource is manpower which is not expendable during
 * the game round and the player won't be able to produce units when the
 * manpower falls down to zero.
 * 
 */
public class ManpowerSystem implements System, UnitCreatedEvent, GameroundEvents {

  private ComponentHolder<Owner> owners;
  private ComponentHolder<Manpower> manpowers;

  @Override
  public void gameroundStartEvent() {
    // TODO give all players at least 1000 manpower :P
  }

  @Override
  public void unitCreatedEvent(String unitEntity) {
    manpowers.get(owners.get(unitEntity).owner).manpower--;
  }
}
