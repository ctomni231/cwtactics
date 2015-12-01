package org.wolftec.cwt.model.gameround;

public class Usable {

  private boolean actable;

  public boolean canAct() {
    return actable;
  }

  public void makeActable() {
    actable = true;
  }

  public void makeInactable() {
    actable = false;
  }

}
