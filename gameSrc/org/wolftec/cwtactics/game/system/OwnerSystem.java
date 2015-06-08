package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.components.RelatedComponent;
import org.wolftec.cwtactics.game.event.OwnerChangeEvent;

public class OwnerSystem implements ISystem, OwnerChangeEvent {

  @Override
  public void onUnitGetsPropertyOwner(String unit, String property) {
    em().getNonNullComponent(unit, RelatedComponent.class).owner = em().getComponent(property, RelatedComponent.class).owner;
  }

}
