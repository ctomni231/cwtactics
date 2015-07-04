package org.wolftec.cwtactics.game.system.game;

import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.game.Owner;
import org.wolftec.cwtactics.game.components.game.Player;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.game.TeamEvents;

public class TeamSystem implements System, TeamEvents {

  private EntityManager em;
  private Asserter as;

  @Override
  public void onSendMoney(String source, String target, int amount) {
    as.resetFailureDetection();

    Player sOwner = em.getComponent(source, Player.class);
    Player tOwner = em.getComponent(target, Player.class);

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
    as.inspectValue("entity owner exists", em.hasEntityComponent(entity, Owner.class)).isTrue();
    as.throwErrorWhenFailureDetected();

    em.getComponent(entity, Owner.class).owner = targetEntity;
  }
}