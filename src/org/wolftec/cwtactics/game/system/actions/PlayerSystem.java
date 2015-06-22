package org.wolftec.cwtactics.game.system.actions;

import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.Player;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.ErrorEvent;
import org.wolftec.cwtactics.game.event.actions.PlayerEvents;

public class PlayerSystem implements ConstructedClass, PlayerEvents {

  private EntityManager em;
  private EventEmitter ev;

  @Override
  public void onChangeGold(String player, int amount) {
    Player data = em.getComponent(player, Player.class);
    data.gold += amount;
    if (data.gold < 0) ev.publish(ErrorEvent.class).onIllegalGameData("negative player gold value detected");
  }
}