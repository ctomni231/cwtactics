package org.wolftec.cwtactics.gameold.domain.types;

import org.wolftec.wCore.validation.DataObject;
import org.wolftec.wCore.validation.validators.StringValue;

@DataObject
public class ArmyType extends ObjectType {

  @StringValue(minLength = 3, maxLength = 20)
  public String name;
}
