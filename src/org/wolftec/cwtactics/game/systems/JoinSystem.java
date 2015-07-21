package org.wolftec.cwtactics.game.systems;

import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback3;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.components.Buyable;
import org.wolftec.cwtactics.game.components.Living;
import org.wolftec.cwtactics.game.components.Owner;
import org.wolftec.cwtactics.game.components.Position;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.ChangeGold;
import org.wolftec.cwtactics.game.events.gameround.HealUnit;
import org.wolftec.cwtactics.game.events.gameround.JoinUnits;
import org.wolftec.cwtactics.game.events.ui.InvokeData;
import org.wolftec.cwtactics.game.events.ui.RegisterAction;
import org.wolftec.cwtactics.game.events.ui.TriggerData;
import org.wolftec.cwtactics.game.util.NumberUtil;

public class JoinSystem implements System, RegisterAction {

  private Components<Living>   livings;
  private Components<Buyable>  buyables;
  private Components<Position> positions;
  private Components<Owner>    owners;

  private ChangeGold           playerEventPush;
  private HealUnit             healEvent;
  private JoinUnits            joinUnitsEv;

  @Override
  public void onRegisterAction(Callback3<String, Callback1<TriggerData>, Callback1<InvokeData>> registerAction) {

    Callback1<TriggerData> check = (data) -> {
      // TODO
    };

    Callback1<InvokeData> invoke = (data) -> {

    };

    registerAction.$invoke("joinUnits", check, invoke);
  }

  public void joinUnits(String joiner, String joinTarget) {
    Living targetHp = livings.get(joinTarget);
    Living sourceHp = livings.get(joiner);

    targetHp.hp += sourceHp.hp;
    if (targetHp.hp > Constants.UNIT_HEALTH) {

      int diff = targetHp.hp - Constants.UNIT_HEALTH;

      diff = NumberUtil.asInt(buyables.get(joinTarget).cost * diff / 100);
      playerEventPush.changeGold(owners.get(joinTarget).owner, diff);

      healEvent.onHealUnit(joinTarget, diff);
    }
    joinUnitsEv.onJoinUnits(joiner, joinTarget);
  }
}