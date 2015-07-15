package org.wolftec.cwtactics.game.team;

import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.gameround.SendMoney;
import org.wolftec.cwtactics.game.event.gameround.SendProperty;
import org.wolftec.cwtactics.game.event.gameround.SendUnit;
import org.wolftec.cwtactics.game.event.ui.ActionFlags;
import org.wolftec.cwtactics.game.event.ui.AddAction;
import org.wolftec.cwtactics.game.event.ui.BuildActions;
import org.wolftec.cwtactics.game.event.ui.InvokeAction;
import org.wolftec.cwtactics.game.living.Living;
import org.wolftec.cwtactics.game.map.Position;

public class TeamActions implements System, BuildActions, InvokeAction {

  private AddAction            addActionEv;
  private SendUnit             sendUnitEv;
  private SendProperty         sendPropertyEv;
  private SendMoney            sendMoneyEv;

  private Components<Position> positions;
  private Components<Living>   livings;

  @Override
  public void invokeAction(String action, int x, int y, int tx, int ty) {
    switch (action) {

      case "sendUnit":
        sendUnitEv.onSendUnit(positions.find((entity, pos) -> pos.x == x && pos.y == y && livings.has(entity)), target);
        break;

      case "sendProperty":
        sendPropertyEv.onSendProperty(positions.find((entity, pos) -> pos.x == x && pos.y == y && !livings.has(entity)), target);
        break;

      case "sendMoney":
        sendMoneyEv.onSendMoney(source, target, amount);
        break;

      default:
        break;
    }
  }

  @Override
  public void buildActions(int x, int y, String tile, String property, String unit, BitSet flags) {
    if (flags.get(ActionFlags.FLAG_SOURCE_UNIT_TO) == 1) {
      addActionEv.onAddAction("sendUnit", true);

    } else if (flags.get(ActionFlags.FLAG_SOURCE_PROP_TO) == 1) {
      addActionEv.onAddAction("sendProperty", true);

    } else if (flags.get(ActionFlags.FLAG_SOURCE_PROP_TO_ALLIED) == 1 || flags.get(ActionFlags.FLAG_SOURCE_PROP_TO_ENEMY) == 1) {
      addActionEv.onAddAction("sendMoney", true);
    }
  }

}
