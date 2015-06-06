package org.wolftec.cwtactics.game.manpower;

import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.event.GameStartEvent;
import org.wolftec.cwtactics.game.event.UnitCreatedEvent;
import org.wolftec.cwtactics.game.owner.RelatedComponent;

/**
 * The {@link ManpowerSystem} gives players the restriction to pay an additional
 * resource per unit. This resource is manpower which is not expendable during
 * the game round and the player won't be able to produce units when the
 * manpower falls down to zero.
 * 
 */
public class ManpowerSystem implements ISystem, UnitCreatedEvent, GameStartEvent {

  @Override
  public void onGameStart() {
    // TODO give all players at least 1000 manpower :P
  }

  @Override
  public void onUnitCreated(String unitEntity) {
    gec(gec(unitEntity, RelatedComponent.class).owner, ManpowerComponent.class).manpower -= 1;
  }
}
