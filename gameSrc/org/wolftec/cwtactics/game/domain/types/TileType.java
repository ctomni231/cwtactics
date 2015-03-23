package org.wolftec.cwtactics.game.domain.types;

import org.wolftec.validation.DataObject;
import org.wolftec.validation.validators.BooleanValue;
import org.wolftec.validation.validators.IntValue;

@DataObject
public class TileType extends ObjectType {
  
  @IntValue(min = 0)
  public int defense = 0;
  
  @BooleanValue(defaultValue = false)
  public boolean blocksVision;
}
