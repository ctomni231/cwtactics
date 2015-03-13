package net.temp.cwt.game.gamemodel.model;

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
