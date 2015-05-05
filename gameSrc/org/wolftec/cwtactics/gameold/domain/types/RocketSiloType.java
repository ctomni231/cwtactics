package org.wolftec.cwtactics.gameold.domain.types;

import org.stjs.javascript.Array;
import org.wolftec.wCore.validation.DataObject;
import org.wolftec.wCore.validation.validators.IntValue;
import org.wolftec.wCore.validation.validators.StringValue;

@DataObject
public class RocketSiloType {

  @StringValue(minLength = 1)
  public Array<String> fireable;
  
  @IntValue(min = 1, max = 9)
  public int damage;
  
  @IntValue(min = 1, max = 5)
  public int range;
}
