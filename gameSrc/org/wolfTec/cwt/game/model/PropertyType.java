package org.wolfTec.cwt.game.model;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.wolfTec.cwt.game.utility.AssertUtilyBean;
import org.wolfTec.cwt.utility.MinValue;

public class PropertyType extends ObjectType {

  @MinValue(0) public int defense;
  @MinValue(0) public int vision;
  @MinValue(0) public int capturePoints;
  public boolean visionBlocker;
  public RocketSiloType rocketsilo;
  public Object builds;
  public LaserType laser;
  public String changesTo;
  public Map<String, Integer> repairs;
  public int funds = 0;
  public boolean looseAfterCaptured;
  public boolean blocker;
  public boolean notTransferable = false;

  @Override public void validate() {
    AssertUtilyBean.greaterEquals(defense, 0);
    AssertUtilyBean.greaterEquals(vision, 0);

    AssertUtilyBean.greaterEquals(capturePoints, 0);
  }
}