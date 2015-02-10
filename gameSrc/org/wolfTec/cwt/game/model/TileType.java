package org.wolfTec.cwt.game.model;

import org.wolfTec.cwt.utility.validation.IntValue;

public class TileType extends ObjectType {
  @IntValue(min = 0) public int defense = 0;
}
