package org.wolftec.cwtactics.game.player;

import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.ChangeGold;
import org.wolftec.cwtactics.game.event.IllegalGameData;

public class PlayerSystem implements System, ChangeGold {

  private EntityManager em;
  private EventEmitter ev;

  IllegalGameData illegalGameDataExc;

  @Override
  public void changeGold(String player, int amount) {
    Player data = em.getComponent(player, Player.class);
    data.gold += amount;
    if (data.gold < 0) {
      illegalGameDataExc.onIllegalGameData("negative player gold value detected");
    }
  }
}