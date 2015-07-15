package org.wolftec.cwtactics.game.stealth;

import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.gameround.HideUnit;
import org.wolftec.cwtactics.game.event.gameround.UnhideUnit;
import org.wolftec.cwtactics.game.event.ui.AddAction;
import org.wolftec.cwtactics.game.event.ui.BuildActions;
import org.wolftec.cwtactics.game.event.ui.InvokeAction;
import org.wolftec.cwtactics.game.usable.Usable;

public class StealthActions implements System, BuildActions, InvokeAction {

  private AddAction           addActionEv;
  private HideUnit            hideUnitEv;
  private UnhideUnit          unhideUnitEv;

  private Components<Usable>  usables;
  private Components<Stealth> stealths;

  @Override
  public void invokeAction(String action, int x, int y, int tx, int ty) {
    if (action == "hideUnit") {
      hideUnitEv.onHideUnit(unit);

    } else if (action == "unhideUnit") {
      unhideUnitEv.onUnhideUnit(unit);
    }
  }

  @Override
  public void buildActions(int x, int y, String tile, String property, String unit, BitSet flags) {
    if (!usables.has(unit) && !stealths.has(unit)) return;

    if (usables.has(unit) && usables.get(unit).canAct) {
      addActionEv.onAddAction(stealths.get(unit).hidden ? "unhideUnit" : "hideUnit", true);
    }
  }

}
