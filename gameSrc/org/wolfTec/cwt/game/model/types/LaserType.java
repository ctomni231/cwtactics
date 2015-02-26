package org.wolfTec.cwt.game.model.types;

import org.wolfTec.wolfTecEngine.validation.annotations.IntValue;

public class LaserType {
  @IntValue(min = 1, max = 9)
  public int damage;
}
