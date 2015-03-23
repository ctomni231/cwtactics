package org.wolftec.cwtactics.game.domain.types;

import org.wolftec.validation.DataObject;
import org.wolftec.validation.validators.IntValue;

@DataObject
public class CoType extends ObjectType {

  @IntValue(min = 1, max = 10)
  public int coStars;
  
  @IntValue(min = 1, max = 10)
  public int scoStars;
}
