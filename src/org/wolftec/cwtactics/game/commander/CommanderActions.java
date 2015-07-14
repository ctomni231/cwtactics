package org.wolftec.cwtactics.game.commander;

import org.wolftec.cwtactics.Entities;
import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.gameround.ActivatePowerLevel;
import org.wolftec.cwtactics.game.event.gameround.PowerLevel;
import org.wolftec.cwtactics.game.event.ui.ActionFlags;
import org.wolftec.cwtactics.game.event.ui.AddAction;
import org.wolftec.cwtactics.game.event.ui.BuildActions;
import org.wolftec.cwtactics.game.event.ui.InvokeAction;
import org.wolftec.cwtactics.game.turn.Turn;

public class CommanderActions implements System, BuildActions, InvokeAction {

  private static final int            POWER_PER_STAR = 1000;

  private Components<Turn>            turns;
  private Components<PlayerCommander> playerCommanders;
  private Components<Commander>       commanders;

  private AddAction                   actionEvent;
  private ActivatePowerLevel          activatePowerEvent;

  @Override
  public void buildActions(int x, int y, String tile, String property, String unit, BitSet flags) {
    if (flags.get(ActionFlags.FLAG_SOURCE_PROP_TO) == 0 && flags.get(ActionFlags.FLAG_SOURCE_UNIT_TO) == 0) {

      String turnOwner = turns.get(Entities.GAME_ROUND).owner;

      PlayerCommander player = playerCommanders.get(turnOwner);
      if (player.activeLevel != PowerLevel.NONE) return;

      Commander commander = commanders.get(turnOwner);
      if (commander != null) {
        if (player.power >= commander.powerStars * POWER_PER_STAR) {
          actionEvent.onAddAction("activatePower", true);
        }
        if (player.power >= commander.powerStars * POWER_PER_STAR + commander.superPowerStars * POWER_PER_STAR) {
          actionEvent.onAddAction("activateSuperPower", true);
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
}
