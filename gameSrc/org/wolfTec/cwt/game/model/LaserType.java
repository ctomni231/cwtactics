package org.wolfTec.cwt.game.model;

import org.wolfTec.cwt.utility.validation.IntValue;

public class LaserType {
  @IntValue(min = 1, max = 9) public int damage;
}
