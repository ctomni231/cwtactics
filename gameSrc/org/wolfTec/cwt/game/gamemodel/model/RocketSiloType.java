package org.wolfTec.cwt.game.gamemodel.model;

import org.stjs.javascript.Array;
import org.wolfTec.validation.IntValue;
import org.wolfTec.validation.StringValue;

public class RocketSiloType {

  @StringValue(minLength = 1)
  public Array<String> fireable;
  @IntValue(min = 1, max = 9)
  public int damage;
  @IntValue(min = 1, max = 5)
  public int range;
}
