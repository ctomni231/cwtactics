package org.wolftec.cwtactics.game.model;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.validation.DataObject;
import org.wolftec.validation.validators.IntValue;
import org.wolftec.validation.validators.StringValue;

@DataObject
public class SuicideType {

  @IntValue(min = 0, max = 10)
  public int damage;
  
  @IntValue(min = 0, max = EngineGlobals.MAX_SELECTION_RANGE)
  public int range;
  
  @StringValue(minLength = 4, maxLength = 4)
  public Array<String> noDamage;
}
