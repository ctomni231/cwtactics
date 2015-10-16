package org.wolftec.cwt.logic;

import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.model.gameround.Unit;

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
