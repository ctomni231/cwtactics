package org.wolftec.cwtactics.game.owner;

import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.event.OwnerChangeEvent;

public class OwnerSystem implements ISystem, OwnerChangeEvent {

  @Override
  public void onUnitGetsPropertyOwner(String unit, String property) {
    gogec(unit, RelatedComponent.class).owner = gec(property, RelatedComponent.class).owner;
  }

}
