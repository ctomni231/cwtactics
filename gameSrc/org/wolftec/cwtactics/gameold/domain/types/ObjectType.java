package org.wolftec.cwtactics.gameold.domain.types;

import org.wolftec.wCore.validation.validators.StringValue;

public abstract class ObjectType {

  @StringValue(minLength = 4, maxLength = 4)
  public String ID;
}
