package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.Manpower;
import org.wolftec.cwtactics.game.components.Owner;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.GameroundEvents;
import org.wolftec.cwtactics.game.event.UnitCreatedEvent;

/**
 * The {@link ManpowerSystem} gives players the restriction to pay an additional
 * resource per unit. This resource is manpower which is not expendable during
 * the game round and the player won't be able to produce units when the
 * manpower falls down to zero.
 * 
 */
public class ManpowerSystem implements ConstructedClass, UnitCreatedEvent, GameroundEvents {

  private EntityManager em;

  @Override
  public void onGameroundStarts() {
    // TODO give all players at least 1000 manpower :P
  }

  @Override
  public void onUnitCreated(String unitEntity) {
    em.getComponent(em.getComponent(unitEntity, Owner.class).owner, Manpower.class).manpower--;
  }
}
