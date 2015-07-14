package org.wolftec.cwtactics.game.commander;

import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.error.IllegalArguments;
import org.wolftec.cwtactics.game.event.gameround.ActivatePowerLevel;
import org.wolftec.cwtactics.game.event.gameround.ChangePower;
import org.wolftec.cwtactics.game.event.gameround.GameroundStart;
import org.wolftec.cwtactics.game.event.gameround.PowerChanged;
import org.wolftec.cwtactics.game.event.gameround.PowerLevel;

public class CommanderSystem implements System, ChangePower, ActivatePowerLevel, GameroundStart {

  private Components<PlayerCommander> playerCommanders;

  private PowerChanged                powerChangedEvent;
  private IllegalArguments            illegalArgumentsExc;

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
