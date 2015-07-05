package org.wolftec.cwtactics.game.stealth;

import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.HideUnit;
import org.wolftec.cwtactics.game.event.LoadUnitType;
import org.wolftec.cwtactics.game.event.UnhideUnit;

public class StealthSystem implements System, HideUnit, UnhideUnit, LoadUnitType {

  private EntityManager em;
  private Asserter as;

  @Override
  public void onLoadUnitType(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, HideAble.class, (hideAble) -> {
      as.inspectValue("HideAble.additionFuelDrain of " + entity, hideAble.additionFuelDrain).isIntWithinRange(0, 99);
    });
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
    Stealth st = em.getComponent(unit, Stealth.class);
    as.resetFailureDetection().inspectValue("unit is " + (isHidden ? "not" : "") + " hidden", st.hidden != isHidden).isTrue().throwErrorWhenFailureDetected();
    st.hidden = isHidden;
  }
}
