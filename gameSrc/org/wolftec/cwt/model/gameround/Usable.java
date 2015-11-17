package org.wolftec.cwt.model.gameround;

public class Usable {

  private boolean canAct;

  public boolean isActable() {
    return canAct;
  }

  public void makeActable() {
    canAct = true;
  }

  public void makeInactable() {
    canAct = false;
  }

}
