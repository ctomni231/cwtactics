package org.wolftec.cwtactics.game.system.game;

import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.ComponentHolder;
import org.wolftec.cwtactics.game.EntityId;
import org.wolftec.cwtactics.game.components.game.Commander;
import org.wolftec.cwtactics.game.components.game.PlayerCommander;
import org.wolftec.cwtactics.game.components.game.PlayerCommander.PowerLevel;
import org.wolftec.cwtactics.game.components.game.Turn;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.ErrorEvent;
import org.wolftec.cwtactics.game.event.GameroundEvents;
import org.wolftec.cwtactics.game.event.game.CommanderEvents;
import org.wolftec.cwtactics.game.event.ui.ActionEvents;

public class CommanderSystem implements System, CommanderEvents, GameroundEvents, ActionEvents {

  private static final int POWER_PER_STAR = 1000;

  private ComponentHolder<Turn> turns;
  private ComponentHolder<PlayerCommander> playerCommanders;
  private ComponentHolder<Commander> commanders;

  private ActionEvents actionEvent;

  private CommanderEvents commanderEvent;

  private ErrorEvent errorEvent;

  @Override
  public void buildActions(int x, int y, String tile, String property, String unit, BitSet flags) {
    if (flags.get(FLAG_SOURCE_PROP_TO) == 0 && flags.get(FLAG_SOURCE_UNIT_TO) == 0) {

      String turnOwner = turns.get(EntityId.GAME_ROUND).owner;

      PlayerCommander player = playerCommanders.get(turnOwner);
      if (player.activeLevel != PlayerCommander.PowerLevel.NONE) return;

      Commander commander = commanders.get(turnOwner);
      if (commander != null) {
        if (player.power >= commander.powerStars * POWER_PER_STAR) {
          actionEvent.addAction("activatePower", true);
        }
        if (player.power >= commander.powerStars * POWER_PER_STAR + commander.superPowerStars * POWER_PER_STAR) {
          actionEvent.addAction("activateSuperPower", true);
        }
      }
    }
  }

  @Override
  public void invokeAction(String action, int x, int y, int tx, int ty) {
    PowerLevel level = PowerLevel.NONE;

    if (action == "activatePower") {
      level = PowerLevel.POWER;
    } else if (action == "activateSuperPower") {
      level = PowerLevel.SUPER_POWER;
    }

    commanderEvent.activatePowerLevel(turns.get(EntityId.GAME_ROUND).owner, level);
  }

  @Override
  public void changePower(String player, int amount) {
    PlayerCommander playerCommander = playerCommanders.get(player);
    playerCommander.power += amount;
    if (playerCommander.power < 0) {
      playerCommander.power = 0;
    }

    commanderEvent.powerChanged(player, playerCommander.power);
  }

  @Override
  public void activatePowerLevel(String player, PowerLevel level) {
    // TODO generic avoid of null in the system
    if (level == null) {
      errorEvent.onIllegalArguments("powerlevel is null");
    }

    PlayerCommander playerCommander = playerCommanders.get(player);

    if ((level != PowerLevel.NONE && playerCommander.activeLevel != PowerLevel.NONE)
        || (level == PowerLevel.NONE && playerCommander.activeLevel == PowerLevel.NONE)) {
      errorEvent.onIllegalArguments("player can change from none to a given level or from level to none");
    }

    playerCommander.activeLevel = level;
    playerCommander.power = 0;

    commanderEvent.powerChanged(player, 0);
  }

  @Override
  public void gameroundStartEvent() {
    playerCommanders.each((entity, playerCommander) -> {
      playerCommander.activeLevel = PowerLevel.NONE;
      playerCommander.power = 0;
    });
  }
}