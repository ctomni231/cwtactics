package org.wolfTec.cwt.game.gamemodel.model;

import org.wolftec.validation.IntValue;

public class CoType extends ObjectType {

  @IntValue(min = 1, max = 10)
  public int coStars;
  @IntValue(min = 1, max = 10)
  public int scoStars;
}
