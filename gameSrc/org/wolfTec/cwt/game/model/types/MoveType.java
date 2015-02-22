package org.wolfTec.cwt.game.model.types;

import org.stjs.javascript.Map;
import org.wolfTec.wolfTecEngine.data.IntValue;
import org.wolfTec.wolfTecEngine.data.StringKey;

public class MoveType extends ObjectType {

  @StringKey(minLength = 1)
  @IntValue(min = -1, max = 100, not = 0)
  public Map<String, Integer> costs;
}
