package org.wolftec.cwt.logic;

import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwt.model.Unit;

public class HideLogic implements Injectable {

  public void hide(Unit unit) {
    setHiddenStatus(unit, true);
  }

  public void unhide(Unit unit) {
    setHiddenStatus(unit, false);
  }

  private void setHiddenStatus(Unit unit, boolean status) {
    if (unit.hidden == status) {
      JsUtil.throwError("Already" + (status ? "Unh" : "H") + "idden");
    }
    unit.hidden = status;
  }
}
