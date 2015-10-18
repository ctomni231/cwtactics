package org.wolftec.cwt.logic;

import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.core.util.AssertUtil;
import org.wolftec.cwt.model.gameround.Unit;

public class HideLogic implements Injectable {

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
