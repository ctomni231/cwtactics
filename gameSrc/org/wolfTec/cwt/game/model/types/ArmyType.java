package org.wolfTec.cwt.game.model.types;

import org.wolfTec.wolfTecEngine.data.StringValue;

public class ArmyType extends ObjectType {

  @StringValue(minLength = 3, maxLength = 20)
  public String name;
}
