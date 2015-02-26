package org.wolfTec.cwt.game.model.types;

import org.wolfTec.wolfTecEngine.validation.annotations.IntValue;

public class CoType extends ObjectType {

  @IntValue(min = 1, max = 10)
  public int coStars;
  @IntValue(min = 1, max = 10)
  public int scoStars;
}
