package org.wolftec.cwtactics.gameold.domain.types;

import org.wolftec.wCore.validation.DataObject;
import org.wolftec.wCore.validation.validators.IntValue;

@DataObject
public class LaserType {
  
  @IntValue(min = 1, max = 9)
  public int damage;
}
