package org.wolftec.cwtactics.game.turn;

import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.gameround.ClientEndsTurn;
import org.wolftec.cwtactics.game.event.ui.ActionFlags;
import org.wolftec.cwtactics.game.event.ui.AddAction;
import org.wolftec.cwtactics.game.event.ui.BuildActions;
import org.wolftec.cwtactics.game.event.ui.InvokeAction;
import org.wolftec.cwtactics.game.usable.Usable;

public class TurnActions implements System, BuildActions, InvokeAction {

  private AddAction          addActionEv;
  private ClientEndsTurn     clientEndsTurnEv;

  private Components<Usable> usables;

  @Override
  public void buildActions(int x, int y, String tile, String property, String unit, BitSet flags) {
    if (flags.get(ActionFlags.FLAG_SOURCE_PROP_TO) == 0 && (flags.get(ActionFlags.FLAG_SOURCE_UNIT_TO) == 0 || !usables.get(unit).canAct)) {
      addActionEv.onAddAction("nextTurn", true);
    }
  }

  @Override
  public void invokeAction(String action, int x, int y, int tx, int ty) {
    if (action == "nextTurn") {
      clientEndsTurnEv.onClientEndsTurn();
    }
  }
}
