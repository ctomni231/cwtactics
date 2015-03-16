package org.wolftec.cwtactics.game.model;

import org.wolftec.validation.validators.StringValue;

public class ArmyType extends ObjectType {

  @StringValue(minLength = 3, maxLength = 20)
  public String name;
}
