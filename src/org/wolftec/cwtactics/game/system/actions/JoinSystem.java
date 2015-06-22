package org.wolftec.cwtactics.game.system.actions;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.Buyable;
import org.wolftec.cwtactics.game.components.Living;
import org.wolftec.cwtactics.game.components.Owner;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.actions.JoinEvents;
import org.wolftec.cwtactics.game.event.actions.PlayerEvents;
import org.wolftec.cwtactics.game.util.NumberUtil;

public class JoinSystem implements ConstructedClass, JoinEvents {

  private EntityManager em;
  private EventEmitter ev;

  @Override
  public void onJoinUnits(String joiner, String joinTarget) {
    Living targetHp = em.getComponent(joinTarget, Living.class);
    Living sourceHp = em.getComponent(joiner, Living.class);

    targetHp.hp += sourceHp.hp;
    if (targetHp.hp > Constants.UNIT_HEALTH) {

      // pay the difference (combined hp - max hp) as money
      int diff = targetHp.hp - Constants.UNIT_HEALTH;
      diff = NumberUtil.asInt(em.getComponent(joinTarget, Buyable.class).cost * diff / 100);
      ev.publish(PlayerEvents.class).onChangeGold(em.getComponent(joinTarget, Owner.class).owner, diff);

      targetHp.hp = Constants.UNIT_HEALTH;
    }

    // TODO heal event?
  }
}