package org.wolfTec.cwt.game.model.types;

import org.stjs.javascript.annotation.SyntheticType;
import org.wolfTec.wolfTecEngine.data.BooleanValue;

@SyntheticType
public class GameConfigType {

  @BooleanValue(defaultValue = false)
  public boolean fastClickMode;

  @BooleanValue(defaultValue = false)
  public boolean forceTouch;

  @BooleanValue(defaultValue = true)
  public boolean animatedTiles;
}
