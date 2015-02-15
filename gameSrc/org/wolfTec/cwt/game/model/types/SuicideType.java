package org.wolfTec.cwt.game.model.types;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.wolfTecEngine.validation.IntValue;
import org.wolfTec.wolfTecEngine.validation.StringValue;

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
