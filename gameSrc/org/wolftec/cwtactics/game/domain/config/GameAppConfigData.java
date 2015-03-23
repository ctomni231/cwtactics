package org.wolftec.cwtactics.game.domain.config;

import org.wolftec.validation.DataObject;
import org.wolftec.validation.validators.BooleanValue;

@DataObject
public class GameAppConfigData {

  @BooleanValue(defaultValue = false)
  public boolean fastClickMode;

  @BooleanValue(defaultValue = false)
  public boolean forceTouch;

  @BooleanValue(defaultValue = true)
  public boolean animatedTiles;
}
