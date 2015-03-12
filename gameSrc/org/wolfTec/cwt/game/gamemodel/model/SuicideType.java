package org.wolfTec.cwt.game.gamemodel.model;

import org.stjs.javascript.Array;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolftec.validation.IntValue;
import org.wolftec.validation.StringValue;

public class SuicideType {

  @IntValue(min = 0, max = 10)
  public int damage;
  
  @IntValue(min = 0, max = EngineGlobals.MAX_SELECTION_RANGE)
  public int range;
  
  @StringValue(minLength = 4, maxLength = 4)
  public Array<String> noDamage;
}
