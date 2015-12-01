package org.wolftec.cwt.model;

public class ActionData {
  public int id;
  public int p1;
  public int p2;
  public int p3;
  public int p4;
  public int p5;

  public ActionData() {
    reset();
  }

  /**
   * Resets the data of the data object.
   */
  public void reset() {
    this.id = -1;
    this.p1 = -1;
    this.p2 = -1;
    this.p3 = -1;
    this.p4 = -1;
    this.p5 = -1;
  }
}
