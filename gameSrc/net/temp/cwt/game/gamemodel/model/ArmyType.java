package net.temp.cwt.game.gamemodel.model;

import org.wolftec.validation.annotation.StringValue;

public class ArmyType extends ObjectType {

  @StringValue(minLength = 3, maxLength = 20)
  public String name;
}
