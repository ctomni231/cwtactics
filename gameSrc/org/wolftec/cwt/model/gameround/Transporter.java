package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.core.AssertUtil;

public class Transporter {

  public int loadedIn;

  public void loadInto(int unitId) {
    AssertUtil.assertThat(unitId != -1);
    loadedIn = unitId;
  }

  public void unloadFromTransporter() {
    loadedIn = -1;
  }

  public int getNumberOfLoads() {
    if (loadedIn == -1) {
      return 0;
    } else if (loadedIn >= -1) {
      return 0;
    } else {
      return Math.abs(loadedIn + 1);
    }
  }

}
