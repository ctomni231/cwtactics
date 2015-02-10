package org.wolfTec.cwt.game.model;

import org.wolfTec.cwt.utility.validation.IntValue;

public class CoType extends ObjectType {

  @IntValue(min = 1, max = 10) public int coStars;
  @IntValue(min = 1, max = 10) public int scoStars;
}
