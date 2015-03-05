package org.wolfTec.cwt.game.gamemodel.model;

import org.wolfTec.validation.IntValue;

public class LaserType {
  @IntValue(min = 1, max = 9)
  public int damage;
}
