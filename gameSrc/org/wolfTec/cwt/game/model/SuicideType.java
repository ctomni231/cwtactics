package org.wolfTec.cwt.game.model;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.utility.validation.IntValue;
import org.wolfTec.cwt.utility.validation.StringValue;

public class SuicideType {

  @IntValue(min = 0, max = 10)
  public int damage;
  @IntValue(min = 0, max = EngineGlobals.MAX_SELECTION_RANGE)
  public int range;
  @StringValue(minLength = 4, maxLength = 4)
  public Array<String> noDamage;

  public SuicideType() {
    noDamage = JSCollections.$array();
  }
}
