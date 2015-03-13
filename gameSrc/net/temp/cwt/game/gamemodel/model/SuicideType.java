package net.temp.cwt.game.gamemodel.model;

import net.temp.EngineGlobals;

import org.stjs.javascript.Array;
import org.wolftec.validation.annotation.IntValue;
import org.wolftec.validation.annotation.StringValue;

public class SuicideType {

  @IntValue(min = 0, max = 10)
  public int damage;
  
  @IntValue(min = 0, max = EngineGlobals.MAX_SELECTION_RANGE)
  public int range;
  
  @StringValue(minLength = 4, maxLength = 4)
  public Array<String> noDamage;
}
