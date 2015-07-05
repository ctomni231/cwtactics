package org.wolftec.cwtactics.game.commander;

import org.wolftec.cwtactics.Entities;
import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.core.Components;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.ActionFlags;
import org.wolftec.cwtactics.game.event.ActivatePowerLevel;
import org.wolftec.cwtactics.game.event.AddAction;
import org.wolftec.cwtactics.game.event.BuildActions;
import org.wolftec.cwtactics.game.event.ChangePower;
import org.wolftec.cwtactics.game.event.GameroundStart;
import org.wolftec.cwtactics.game.event.IllegalArguments;
import org.wolftec.cwtactics.game.event.InvokeAction;
import org.wolftec.cwtactics.game.event.PowerChanged;
import org.wolftec.cwtactics.game.event.PowerLevel;
import org.wolftec.cwtactics.game.turn.Turn;

public class CommanderSystem implements System, ChangePower, ActivatePowerLevel, GameroundStart, BuildActions, InvokeAction {

  private static final int POWER_PER_STAR = 1000;

  private Components<Turn> turns;
  private Components<PlayerCommander> playerCommanders;
  private Components<Commander> commanders;

  private AddAction actionEvent;

  private ActivatePowerLevel activatePowerEvent;
  private PowerChanged powerChangedEvent;

  private IllegalArguments illegalArgumentsExc;

  @Override
  public void buildActions(int x, int y, String tile, String property, String unit, BitSet flags) {
    if (flags.get(ActionFlags.FLAG_SOURCE_PROP_TO) == 0 && flags.get(ActionFlags.FLAG_SOURCE_UNIT_TO) == 0) {

      String turnOwner = turns.get(Entities.GAME_ROUND).owner;

      PlayerCommander player = playerCommanders.get(turnOwner);
      if (player.activeLevel != PowerLevel.NONE) return;

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

    activatePowerEvent.activatePowerLevel(turns.get(Entities.GAME_ROUND).owner, level);
  }

  @Override
  public void changePower(String player, int amount) {
    PlayerCommander playerCommander = playerCommanders.get(player);
    playerCommander.power += amount;
    if (playerCommander.power < 0) {
      playerCommander.power = 0;
    }

    powerChangedEvent.powerChanged(player, playerCommander.power);
  }

  @Override
  public void activatePowerLevel(String player, PowerLevel level) {
    // TODO generic avoid of null in the system
    if (level == null) {
      illegalArgumentsExc.onIllegalArguments("powerlevel is null");
    }

    PlayerCommander playerCommander = playerCommanders.get(player);

    if ((level != PowerLevel.NONE && playerCommander.activeLevel != PowerLevel.NONE)
        || (level == PowerLevel.NONE && playerCommander.activeLevel == PowerLevel.NONE)) {
      illegalArgumentsExc.onIllegalArguments("player can change from none to a given level or from level to none");
    }

    playerCommander.activeLevel = level;
    playerCommander.power = 0;

    powerChangedEvent.powerChanged(player, 0);
  }

  @Override
  public void gameroundStart() {
    playerCommanders.each((entity, playerCommander) -> {
      playerCommander.activeLevel = PowerLevel.NONE;
      playerCommander.power = 0;
    });
  }
}