package org.wolftec.cwtactics.game.model;

import org.stjs.javascript.annotation.SyntheticType;
import org.wolftec.validation.validators.BooleanValue;

@SyntheticType
public class GameConfigType {

  @BooleanValue(defaultValue = false)
  public boolean fastClickMode;

  @BooleanValue(defaultValue = false)
  public boolean forceTouch;

  @BooleanValue(defaultValue = true)
  public boolean animatedTiles;
}
