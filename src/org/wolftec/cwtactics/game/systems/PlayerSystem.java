package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.game.components.Player;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.error.IllegalGameData;
import org.wolftec.cwtactics.game.events.gameround.ChangeGold;

public class PlayerSystem implements System, ChangeGold {

  private IllegalGameData    illegalGameDataExc;

  private Components<Player> players;

  @Override
  public void changeGold(String player, int amount) {
    Player data = players.get(player);
    data.gold += amount;
    if (data.gold < 0) {
      illegalGameDataExc.onIllegalGameData("negative player gold value detected");
    }
  }
}