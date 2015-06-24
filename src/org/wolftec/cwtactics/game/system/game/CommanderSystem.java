package org.wolftec.cwtactics.game.system.game;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.game.PlayerCommander;
import org.wolftec.cwtactics.game.components.game.PlayerCommander.PowerLevel;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.ErrorEvent;
import org.wolftec.cwtactics.game.event.GameroundEvents;
import org.wolftec.cwtactics.game.event.actions.CommanderEvents;

public class CommanderSystem implements ConstructedClass, CommanderEvents, GameroundEvents {

  private EntityManager em;
  private EventEmitter ev;

  @Override
  public void onChangePower(String player, int amount) {
    PlayerCommander playerCommander = em.getComponent(player, PlayerCommander.class);
    playerCommander.power += amount;
    if (playerCommander.power < 0) {
      playerCommander.power = 0;
    }

    ev.publish(CommanderEvents.class).onPowerChanged(player, playerCommander.power);
  }

  @Override
  public void onActivatePowerLevel(String player, PowerLevel level) {
    // TODO generic avoid of null in the system
    if (level == null) ev.publish(ErrorEvent.class).onIllegalArguments("powerlevel is null");

    PlayerCommander playerCommander = em.getComponent(player, PlayerCommander.class);

    if ((level != PowerLevel.NONE && playerCommander.activeLevel != PowerLevel.NONE)
        || (level == PowerLevel.NONE && playerCommander.activeLevel == PowerLevel.NONE)) {
      ev.publish(ErrorEvent.class).onIllegalArguments("player can change from none to a given level or from level to none");
    }

    playerCommander.activeLevel = level;
    playerCommander.power = 0;

    ev.publish(CommanderEvents.class).onPowerChanged(player, 0);
  }

  @Override
  public void onGameroundStarts() {
    Array<String> players = em.getEntitiesWithComponentType(PlayerCommander.class);
    JsUtil.forEachArrayValue(players, (index, player) -> {
      PlayerCommander playerCommander = em.getComponent(player, PlayerCommander.class);
      playerCommander.activeLevel = PowerLevel.NONE;
      playerCommander.power = 0;
    });
  }
}