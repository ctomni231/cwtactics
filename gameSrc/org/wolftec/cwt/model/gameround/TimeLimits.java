package org.wolftec.cwt.model.gameround;

public class TimeLimits {

  /**
   * Maximum turn time limit in ms.
   */
  private int turntimeLimit;

  /**
   * Current elapsed turn time in ms.
   */
  private int turntimeElapsed;

  /**
   * Maximum game time limit in ms.
   * 
   */
  private int gametimeLimit;

  /**
   * Current elapsed game time in ms.
   */
  private int gametimeElapsed;

  public void tick(int time) {
    gametimeElapsed += time;
    turntimeElapsed += time;
  }

  public boolean isGametimeLimitReached() {
    return gametimeElapsed > gametimeLimit;
  }

  public boolean isTurntimeLimitReached() {
    return turntimeElapsed > turntimeLimit;
  }

  public void reset() {
    turntimeLimit = 0;
    gametimeLimit = 0;
    gametimeElapsed = 0;
    turntimeElapsed = 0;
  }
}
