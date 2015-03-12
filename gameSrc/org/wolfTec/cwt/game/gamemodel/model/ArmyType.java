package org.wolfTec.cwt.game.gamemodel.model;

import org.wolftec.validation.StringValue;

public class ArmyType extends ObjectType {

  @StringValue(minLength = 3, maxLength = 20)
  public String name;
}
