package org.wolftec.cwtactics.game.system.old;

import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.components.Player;
import org.wolftec.cwtactics.game.components.Owner;

public class PlayerSys implements ISystem {

  @Override
  public void onConstruction() {
    events().UNIT_DESTROYED.subscribe(this::unitDestructs);
    events().UNIT_CREATED.subscribe(this::unitCreates);
  }

  public void unitCreates(String unit) {
    gec(gec(unit, Owner.class).owner, Player.class).numOfUnits++;
  }

  public void unitDestructs(String unit) {
    gec(gec(unit, Owner.class).owner, Player.class).numOfUnits--;
  }
}
