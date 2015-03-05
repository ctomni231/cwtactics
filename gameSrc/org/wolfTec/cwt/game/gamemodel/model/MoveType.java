package org.wolfTec.cwt.game.gamemodel.model;

import org.stjs.javascript.Map;
import org.wolfTec.validation.IntValue;
import org.wolfTec.validation.StringKey;

public class MoveType extends ObjectType {

  @StringKey(minLength = 1)
  @IntValue(min = -1, max = 100, not = 0)
  public Map<String, Integer> costs;
}
