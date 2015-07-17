package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.game.components.HidingAbility;
import org.wolftec.cwtactics.game.components.Stealth;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.HideUnit;
import org.wolftec.cwtactics.game.events.gameround.UnhideUnit;
import org.wolftec.cwtactics.game.events.gameround.UnitProduced;
import org.wolftec.cwtactics.game.events.loading.LoadUnitType;
import org.wolftec.cwtactics.game.events.system.ValidateDataEvent;

public class StealthSystem implements System, HideUnit, UnhideUnit, LoadUnitType, UnitProduced, ValidateDataEvent {

  private Asserter                  as;

  private Components<HidingAbility> hidables;
  private Components<Stealth>       stealths;

  @Override
  public void onLoadUnitType(String entity, Object data) {
    if (hidables.isComponentInRootData(data)) {
      hidables.acquireWithRootData(entity, data);
    }
  }

  @Override
  public void onValidation() {
    hidables.each((entity, hideAble) -> as.inspectValue("hideAble [" + entity + "]", hideAble.additionFuelDrain).isIntWithinRange(0, 99));
    stealths.each((entity, stealth) -> as.inspectValue("stealth [" + entity + "]", stealth).isBoolean());
  }

  @Override
  public void onUnitProduced(String unit, String type, int x, int y) {
    if (hidables.has(type)) {
      Stealth data = stealths.acquire(unit);
      data.hidden = false;
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
