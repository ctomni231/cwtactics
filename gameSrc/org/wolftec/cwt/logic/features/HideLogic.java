package org.wolftec.cwt.logic.features;

import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.system.ManagedClass;
import org.wolftec.cwt.util.AssertUtil;

public class HideLogic implements ManagedClass {

  public boolean canHide(Unit unit) {
    return unit.type.stealth && !unit.hidden;
  }

  public boolean canUnhide(Unit unit) {
    return unit.type.stealth && unit.hidden;
  }

  public void hide(Unit unit) {
    setHiddenStatus(unit, true);
  }

  public void unhide(Unit unit) {
    setHiddenStatus(unit, false);
  }

  private void setHiddenStatus(Unit unit, boolean status) {
    AssertUtil.assertThatNot(unit.hidden == status, "Already" + (status ? "Unh" : "H") + "idden");
    unit.hidden = status;
  }
}
