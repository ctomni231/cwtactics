package org.wolftec.cwtactics.game.model;

import org.stjs.javascript.Map;
import org.wolftec.validation.validators.IntValue;
import org.wolftec.validation.validators.StringKey;

public class MoveType extends ObjectType {

  @StringKey(minLength = 1)
  @IntValue(min = -1, max = 100, not = 0)
  public Map<String, Integer> costs;
}
