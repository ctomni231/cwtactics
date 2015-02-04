package net.wolfTec.wtEngine.action;

import net.wolfTec.wtEngine.Constants;

import org.stjs.javascript.annotation.Namespace;

@Namespace("wtEngine") public abstract class ActionData {

  public int actionId;
  public int p1;
  public int p2;
  public int p3;
  public int p4;
  public int p5;
  public String pStr;

  public ActionData() {
    reset();
  }

  public void reset() {
    p1 = Constants.INACTIVE_ID;
    p2 = Constants.INACTIVE_ID;
    p3 = Constants.INACTIVE_ID;
    p4 = Constants.INACTIVE_ID;
    p5 = Constants.INACTIVE_ID;
    pStr = null;
  }
}
