package org.wolftec.cwtactics.game.stealth;

import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.HideUnit;
import org.wolftec.cwtactics.game.event.LoadUnitType;
import org.wolftec.cwtactics.game.event.UnhideUnit;

public class StealthSystem implements System, HideUnit, UnhideUnit, LoadUnitType {

  private Asserter                  as;

  private Components<HidingAbility> hidables;
  private Components<Stealth>       stealths;

  @Override
  public void onLoadUnitType(String entity, Object data) {
    if (hidables.isComponentInRootData(data)) {
      HidingAbility hideAble = hidables.acquireWithRootData(entity, data);
      as.inspectValue("HideAble.additionFuelDrain of " + entity, hideAble.additionFuelDrain).isIntWithinRange(0, 99);
    }
  }

  @Override
  public void onHideUnit(String unit) {
    changeStealth(unit, true);
  }

  @Override
  public void onUnhideUnit(String unit) {
    changeStealth(unit, false);
  }

  private void changeStealth(String unit, boolean isHidden) {
    Stealth st = stealths.get(unit);
    as.resetFailureDetection().inspectValue("unit is " + (isHidden ? "not" : "") + " hidden", st.hidden != isHidden).isTrue().throwErrorWhenFailureDetected();
    st.hidden = isHidden;
  }
}
