package org.wolftec.cwtactics.game.model;

import org.wolftec.validation.validators.IntValue;

public class TileType extends ObjectType {
  @IntValue(min = 0)
  public int defense = 0;
  public boolean blocksVision = false;
}
