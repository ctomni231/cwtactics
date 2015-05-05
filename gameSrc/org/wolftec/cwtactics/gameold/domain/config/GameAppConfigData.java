package org.wolftec.cwtactics.gameold.domain.config;

import org.wolftec.wCore.validation.DataObject;
import org.wolftec.wCore.validation.validators.BooleanValue;

@DataObject
public class GameAppConfigData {

  @BooleanValue(defaultValue = false)
  public boolean fastClickMode;

  @BooleanValue(defaultValue = false)
  public boolean forceTouch;

  @BooleanValue(defaultValue = true)
  public boolean animatedTiles;
}
