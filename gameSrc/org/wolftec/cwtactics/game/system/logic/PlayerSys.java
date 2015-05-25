package org.wolftec.cwtactics.game.system.logic;

import org.wolftec.cwtactics.game.components.objects.OwnableCmp;
import org.wolftec.cwtactics.game.components.objects.Player;
import org.wolftec.cwtactics.game.system.ISystem;

public class PlayerSys implements ISystem {

  @Override
  public void onInit() {

    events().UNIT_DESTROYED.subscribe((unit) -> {
      OwnableCmp ownC = entityManager().getEntityComponent(unit, OwnableCmp.class);
      entityManager().getEntityComponent(ownC.owner, Player.class).numOfUnits--;
    });

    events().UNIT_CREATED.subscribe((unit) -> {
      OwnableCmp ownC = entityManager().getEntityComponent(unit, OwnableCmp.class);
      entityManager().getEntityComponent(ownC.owner, Player.class).numOfUnits++;
    });
  }
}
