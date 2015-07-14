package org.wolftec.cwtactics.game.join;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.gameround.ChangeGold;
import org.wolftec.cwtactics.game.event.gameround.HealUnit;
import org.wolftec.cwtactics.game.event.gameround.JoinUnits;
import org.wolftec.cwtactics.game.factory.Buyable;
import org.wolftec.cwtactics.game.living.Living;
import org.wolftec.cwtactics.game.player.Owner;
import org.wolftec.cwtactics.game.util.NumberUtil;

public class JoinSystem implements System, JoinUnits {

  private Components<Living>  livings;
  private Components<Buyable> buyables;
  private Components<Owner>   owners;

  private ChangeGold          playerEventPush;
  private HealUnit            healEvent;

  @Override
  public void onJoinUnits(String joiner, String joinTarget) {
    Living targetHp = livings.get(joinTarget);
    Living sourceHp = livings.get(joiner);

    targetHp.hp += sourceHp.hp;
    if (targetHp.hp > Constants.UNIT_HEALTH) {

      int diff = targetHp.hp - Constants.UNIT_HEALTH;

      diff = NumberUtil.asInt(buyables.get(joinTarget).cost * diff / 100);
      playerEventPush.changeGold(owners.get(joinTarget).owner, diff);

      healEvent.onHealUnit(joinTarget, diff);
    }
  }
}