package org.wolftec.cwtactics.game.team;

import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.gameround.SendMoney;
import org.wolftec.cwtactics.game.event.gameround.SendProperty;
import org.wolftec.cwtactics.game.event.gameround.SendUnit;
import org.wolftec.cwtactics.game.player.Owner;
import org.wolftec.cwtactics.game.player.Player;

public class TeamSystem implements System, SendUnit, SendProperty, SendMoney {

  private Asserter           as;

  private Components<Player> players;
  private Components<Owner>  owners;

  @Override
  public void onSendMoney(String source, String target, int amount) {
    as.resetFailureDetection();

    Player sOwner = players.get(source);
    Player tOwner = players.get(target);

    as.inspectValue("send money gold", amount).isIntWithinRange(1000, 1000000);

    sOwner.gold -= amount;
    as.inspectValue("source owner gold amount after sending", sOwner.gold).isGreaterEquals(0);

    tOwner.gold += amount;

    as.throwErrorWhenFailureDetected();
  }

  @Override
  public void onSendUnit(String unit, String target) {
    changeOwner(unit, target);
  }

  @Override
  public void onSendProperty(String property, String target) {
    changeOwner(property, target);
  }

  private void changeOwner(String entity, String targetEntity) {
    as.resetFailureDetection();
    as.inspectValue("entity owner exists", owners.has(entity)).isTrue();
    as.inspectValue("target entity is a player", players.has(targetEntity)).isTrue();
    as.throwErrorWhenFailureDetected();

    owners.get(entity).owner = targetEntity;
  }
}