package net.temp.cwt.game.gamemodel.model;

import org.stjs.javascript.Map;
import org.wolftec.validation.annotation.IntValue;
import org.wolftec.validation.annotation.StringKey;

public class MoveType extends ObjectType {

  @StringKey(minLength = 1)
  @IntValue(min = -1, max = 100, not = 0)
  public Map<String, Integer> costs;
}
