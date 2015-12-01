package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.core.AssertUtil;

public class Visible {

  public int visionTurnOwner;
  public int visionClient;

  public Visible(int visionTurnOwner, int visionClient) {
    this.visionTurnOwner = visionTurnOwner;
    this.visionClient = visionClient;
  }

  public void objectGainsVision() {
    visionTurnOwner++;
  }

  public void objectLoosesVision() {
    visionTurnOwner--;
    AssertUtil.assertThat(visionTurnOwner >= 0);
  }

  public boolean isVisible(Tile tile) {
    return visionTurnOwner > 0;
  }
}