package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.core.AssertUtil;

public class Hidable {

  private boolean hidden;

  public boolean isHidden() {
    return hidden;
  }

  public void hide() {
    _setHiddenStatus(true);
  }

  public void unhide() {
    _setHiddenStatus(false);
  }

  private void _setHiddenStatus(boolean status) {
    AssertUtil.assertThatNot(hidden == status, "Already" + (status ? "Unh" : "H") + "idden");
    hidden = status;
  }

}
