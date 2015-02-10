package org.wolfTec.cwt.game.model;

import org.stjs.javascript.Map;
import org.wolfTec.cwt.utility.validation.IntValue;
import org.wolfTec.cwt.utility.validation.StringKey;

public class MoveType extends ObjectType {

  @StringKey(minLength = 1) 
  @IntValue(min = -1, max = 100, not = { 0 }) 
  public Map<String, Integer> costs;
}
