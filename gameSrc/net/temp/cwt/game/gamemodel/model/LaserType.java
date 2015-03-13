package net.temp.cwt.game.gamemodel.model;

import org.wolftec.validation.validators.IntValue;

public class LaserType {
  @IntValue(min = 1, max = 9)
  public int damage;
}
