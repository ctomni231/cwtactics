package org.wolftec.cwtactics.game.domain.types;

import org.wolftec.validation.DataObject;
import org.wolftec.validation.validators.StringValue;

@DataObject
public class ArmyType extends ObjectType {

  @StringValue(minLength = 3, maxLength = 20)
  public String name;
}
