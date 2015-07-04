package org.wolftec.cwtactics.game.system.game;

import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.game.Player;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.ErrorEvent;
import org.wolftec.cwtactics.game.event.game.player.ChangeGold;

public class PlayerSystem implements System, ChangeGold {

  private EntityManager em;
  private EventEmitter ev;

  @Override
  public void changeGold(String player, int amount) {
    Player data = em.getComponent(player, Player.class);
    data.gold += amount;
    if (data.gold < 0) ev.publish(ErrorEvent.class).onIllegalGameData("negative player gold value detected");
  }
}