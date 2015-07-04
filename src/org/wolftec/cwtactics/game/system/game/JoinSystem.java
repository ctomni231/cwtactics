package org.wolftec.cwtactics.game.system.game;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.ComponentHolder;
import org.wolftec.cwtactics.game.components.game.Buyable;
import org.wolftec.cwtactics.game.components.game.Living;
import org.wolftec.cwtactics.game.components.game.Owner;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.game.JoinEvents;
import org.wolftec.cwtactics.game.event.game.LivingEvents;
import org.wolftec.cwtactics.game.event.game.PlayerEvents;
import org.wolftec.cwtactics.game.util.NumberUtil;

public class JoinSystem implements System, JoinEvents {

  private ComponentHolder<Living> livings;
  private ComponentHolder<Buyable> buyables;
  private ComponentHolder<Owner> owners;

  private PlayerEvents playerEventPush;
  private LivingEvents livingEventPush;

  @Override
  public void onJoinUnits(String joiner, String joinTarget) {
    Living targetHp = livings.get(joinTarget);
    Living sourceHp = livings.get(joiner);

    targetHp.hp += sourceHp.hp;
    if (targetHp.hp > Constants.UNIT_HEALTH) {

      int diff = targetHp.hp - Constants.UNIT_HEALTH;

      diff = NumberUtil.asInt(buyables.get(joinTarget).cost * diff / 100);
      playerEventPush.changeGold(owners.get(joinTarget).owner, diff);

      livingEventPush.healUnit(joinTarget, diff);
    }
  }
}