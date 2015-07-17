package org.wolftec.cwtactics.game.systems;

import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback3;
import org.wolftec.cwtactics.game.components.Living;
import org.wolftec.cwtactics.game.components.Owner;
import org.wolftec.cwtactics.game.components.Player;
import org.wolftec.cwtactics.game.components.Position;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.SendMoney;
import org.wolftec.cwtactics.game.events.gameround.SendProperty;
import org.wolftec.cwtactics.game.events.gameround.SendUnit;
import org.wolftec.cwtactics.game.events.ui.ActionFlags;
import org.wolftec.cwtactics.game.events.ui.InvokeData;
import org.wolftec.cwtactics.game.events.ui.RegisterAction;
import org.wolftec.cwtactics.game.events.ui.TriggerData;

public class TeamSystem implements System, SendUnit, SendProperty, SendMoney, RegisterAction {

  private Components<Position> positions;
  private Components<Living>   livings;
  private Components<Player>   players;
  private Components<Owner>    owners;

  @Override
  public void onRegisterAction(Callback3<String, Callback1<TriggerData>, Callback1<InvokeData>> registerAction) {

    registerAction.$invoke("sendUnit", (data) -> {
      data.addEnabledWhen.$invoke(data.flags.get(ActionFlags.FLAG_SOURCE_UNIT_TO) == 1);
    }, (data) -> {
      String source = positions.find((entity, pos) -> pos.x == data.sourceX && pos.y == data.sourceY && livings.has(entity));
      /* TODO */
      String target = null;
      onSendUnit(source, target);
    });

    registerAction.$invoke("sendProperty", (data) -> {
      data.addEnabledWhen.$invoke(data.flags.get(ActionFlags.FLAG_SOURCE_PROP_TO) == 1);
    }, (data) -> {
      String source = positions.find((entity, pos) -> pos.x == data.sourceX && pos.y == data.sourceY && !livings.has(entity));
      /* TODO */
      String target = null;
      onSendProperty(source, target);
    });

    registerAction.$invoke("sendMoney", (data) -> {
      data.addEnabledWhen.$invoke(data.flags.get(ActionFlags.FLAG_SOURCE_PROP_TO_ALLIED) == 1 || data.flags.get(ActionFlags.FLAG_SOURCE_PROP_TO_ENEMY) == 1);
    }, (data) -> {
      /* TODO */
      String source = null;
      String target = positions.find((entity, pos) -> pos.x == data.sourceX && pos.y == data.sourceY && !livings.has(entity));
      /* TODO */
      onSendMoney(source, target, 0);
    });
  }

  @Override
  public void onSendMoney(String source, String target, int amount) {
    players.get(owners.get(source).owner).gold -= amount;
    players.get(owners.get(target).owner).gold += amount;
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