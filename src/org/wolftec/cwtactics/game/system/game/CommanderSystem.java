package org.wolftec.cwtactics.game.system.game;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.EntityId;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.game.Commander;
import org.wolftec.cwtactics.game.components.game.PlayerCommander;
import org.wolftec.cwtactics.game.components.game.PlayerCommander.PowerLevel;
import org.wolftec.cwtactics.game.components.game.Turn;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.ErrorEvent;
import org.wolftec.cwtactics.game.event.GameroundEvents;
import org.wolftec.cwtactics.game.event.game.CommanderEvents;
import org.wolftec.cwtactics.game.event.ui.ActionEvents;

public class CommanderSystem implements ConstructedClass, CommanderEvents, GameroundEvents, ActionEvents {

  private static final int POWER_PER_STAR = 1000;

  private EntityManager em;
  private EventEmitter ev;

  @Override
  public void onBuildActions(int x, int y, String tile, String property, String unit, BitSet flags) {
    if (flags.get(FLAG_SOURCE_PROP_TO) == 0 && flags.get(FLAG_SOURCE_UNIT_TO) == 0) {

      PlayerCommander player = em.getComponent(em.getComponent(EntityId.GAME_ROUND, Turn.class).owner, PlayerCommander.class);
      if (player.activeLevel != PlayerCommander.PowerLevel.NONE) return;

      Commander commander = em.getComponent(em.getComponent(EntityId.GAME_ROUND, Turn.class).owner, Commander.class);
      if (commander != null) {
        if (player.power >= commander.powerStars * POWER_PER_STAR) {
          ev.publish(ActionEvents.class).onAddAction("activatePower", true);
        }
        if (player.power >= commander.powerStars * POWER_PER_STAR + commander.superPowerStars * POWER_PER_STAR) {
          ev.publish(ActionEvents.class).onAddAction("activateSuperPower", true);
        }
      }
    }
  }

  @Override
  public void onInvokeAction(String action, int x, int y, int tx, int ty) {
    PowerLevel level = PowerLevel.NONE;

    if (action == "activatePower") {
      level = PowerLevel.POWER;
    } else if (action == "activateSuperPower") {
      level = PowerLevel.SUPER_POWER;
    }

    ev.publish(CommanderEvents.class).onActivatePowerLevel(em.getComponent(EntityId.GAME_ROUND, Turn.class).owner, level);
  }

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