package org.wolftec.cwtactics.game.action;

import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.validation.DataObject;
import org.wolftec.validation.validators.IntValue;
import org.wolftec.validation.validators.StringValue;

/**
 * Action entry. Used to handle actions in a asynchronous way plus sending and
 * receiving them via a network interface.
 */
@DataObject
public class ActionItem {

  @IntValue
  public int actionId;

  @IntValue
  public int p1;

  @IntValue
  public int p2;

  @IntValue
  public int p3;

  @IntValue
  public int p4;

  @IntValue
  public int p5;

  @StringValue
  public String pStr;

  public void reset() {
    actionId = EngineGlobals.INACTIVE_ID;
    p1 = EngineGlobals.INACTIVE_ID;
    p2 = EngineGlobals.INACTIVE_ID;
    p3 = EngineGlobals.INACTIVE_ID;
    p4 = EngineGlobals.INACTIVE_ID;
    p5 = EngineGlobals.INACTIVE_ID;
    pStr = null;
  }
}
