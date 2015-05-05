package org.wolftec.cwtactics.gameold.domain.types;

import org.wolftec.wCore.validation.DataObject;
import org.wolftec.wCore.validation.validators.IntValue;

@DataObject
public class CoType extends ObjectType {

  @IntValue(min = 1, max = 10)
  public int coStars;
  
  @IntValue(min = 1, max = 10)
  public int scoStars;
}
