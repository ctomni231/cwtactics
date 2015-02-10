package org.wolfTec.cwt.game.model;

import org.stjs.javascript.Map;
import org.wolfTec.cwt.game.Constants;
import org.wolfTec.cwt.utility.validation.IntValue;
import org.wolfTec.cwt.utility.validation.StringKey;
import org.wolfTec.cwt.utility.validation.StringValue;

public class PropertyType extends ObjectType {

  @IntValue(min = 0, max = 6) public int defense = 0;
  @IntValue(min = 0, max = Constants.MAX_SELECTION_RANGE) public int vision = 0;
  @IntValue(min = 0, max = 20) public int capturePoints = 20; // TODO static ?
  public boolean visionBlocker;
  public RocketSiloType rocketsilo;
  public Object builds;
  public LaserType laser;
  @StringValue(minLength = 1) public String changesTo;
  
  @StringKey(minLength = 4, maxLength = 4) 
  @IntValue(min = 1, max = 10) public Map<String, Integer> repairs;
  
  @IntValue(min = 0, max = 99999) public int funds = 0;
  public boolean looseAfterCaptured = false;
  public boolean blocker = false;
  public boolean notTransferable = false;
}