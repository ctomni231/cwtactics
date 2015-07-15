package org.wolftec.cwtactics.game.team;

import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.gameround.SendMoney;
import org.wolftec.cwtactics.game.event.gameround.SendProperty;
import org.wolftec.cwtactics.game.event.gameround.SendUnit;
import org.wolftec.cwtactics.game.player.Owner;
import org.wolftec.cwtactics.game.player.Player;

public class TeamSystem implements System, SendUnit, SendProperty, SendMoney {

  private Components<Player> players;
  private Components<Owner>  owners;

  @Override
  public void onSendMoney(String source, String target, int amount) {
    players.get(source).gold -= amount;
    players.get(target).gold += amount;
  }

  @Override
  public void onSendUnit(String unit, String target) {
    owners.get(unit).owner = target;
  }

  @Override
  public void onSendProperty(String property, String target) {
    owners.get(property).owner = target;
  }
}