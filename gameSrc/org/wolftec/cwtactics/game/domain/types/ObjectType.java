package org.wolftec.cwtactics.game.domain.types;

import org.wolftec.validation.validators.StringValue;

public abstract class ObjectType {

  @StringValue(minLength = 4, maxLength = 4)
  public String ID;
}
