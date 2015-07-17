package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.components.Usable;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.ClientEndsTurn;
import org.wolftec.cwtactics.game.events.ui.ActionFlags;
import org.wolftec.cwtactics.game.events.ui.AddAction;
import org.wolftec.cwtactics.game.events.ui.BuildActions;
import org.wolftec.cwtactics.game.events.ui.InvokeAction;

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
