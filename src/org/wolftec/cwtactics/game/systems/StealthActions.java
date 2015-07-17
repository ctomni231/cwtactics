package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.components.Stealth;
import org.wolftec.cwtactics.game.components.Usable;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.HideUnit;
import org.wolftec.cwtactics.game.events.gameround.UnhideUnit;
import org.wolftec.cwtactics.game.events.ui.AddAction;
import org.wolftec.cwtactics.game.events.ui.BuildActions;
import org.wolftec.cwtactics.game.events.ui.InvokeAction;

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
