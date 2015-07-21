package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.game.components.CommanderInUse;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.error.IllegalArguments;
import org.wolftec.cwtactics.game.events.gameround.ActivatedPowerLevel;
import org.wolftec.cwtactics.game.events.gameround.ChangePower;
import org.wolftec.cwtactics.game.events.gameround.GameroundStart;
import org.wolftec.cwtactics.game.events.gameround.PowerChanged;
import org.wolftec.cwtactics.game.events.gameround.PowerLevel;

public class CommanderSystem implements System, ChangePower, ActivatedPowerLevel, GameroundStart {

  private Components<CommanderInUse> playerCommanders;

  private PowerChanged               powerChangedEvent;
  private IllegalArguments           illegalArgumentsExc;

  @Override
  public void changePower(String player, int amount) {
    CommanderInUse playerCommander = playerCommanders.get(player);
    playerCommander.power += amount;
    if (playerCommander.power < 0) {
      playerCommander.power = 0;
    }

    powerChangedEvent.powerChanged(player, playerCommander.power);
  }

  @Override
  public void onActivatedPowerLevel(String player, PowerLevel level) {
    // TODO generic avoid of null in the system
    if (level == null) {
      illegalArgumentsExc.onIllegalArguments("powerlevel is null");
    }

    CommanderInUse playerCommander = playerCommanders.get(player);

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
