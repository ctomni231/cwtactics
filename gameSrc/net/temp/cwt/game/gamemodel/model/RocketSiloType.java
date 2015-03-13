package net.temp.cwt.game.gamemodel.model;

import org.stjs.javascript.Array;
import org.wolftec.validation.annotation.IntValue;
import org.wolftec.validation.annotation.StringValue;

public class RocketSiloType {

  @StringValue(minLength = 1)
  public Array<String> fireable;
  @IntValue(min = 1, max = 9)
  public int damage;
  @IntValue(min = 1, max = 5)
  public int range;
}
