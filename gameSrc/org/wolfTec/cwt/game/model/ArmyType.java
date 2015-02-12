package org.wolfTec.cwt.game.model;

import org.wolfTec.cwt.utility.validation.StringValue;

public class ArmyType extends ObjectType {

  @StringValue(minLength = 3, maxLength = 20)
  public String name;
}
