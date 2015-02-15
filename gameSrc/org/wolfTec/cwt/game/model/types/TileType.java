package org.wolfTec.cwt.game.model.types;

import org.wolfTec.wolfTecEngine.validation.IntValue;

public class TileType extends ObjectType {
  @IntValue(min = 0)
  public int defense = 0;
  public boolean blocksVision = false;
}
