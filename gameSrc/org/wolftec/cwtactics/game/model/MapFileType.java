package org.wolftec.cwtactics.game.model;

import org.wolftec.validation.validators.IntValue;
import org.wolftec.validation.validators.StringValue;

public class MapFileType {

  @StringValue(minLength = 4, maxLength = 32)
  public String mapName;

  @IntValue(min = 2, max = 4)
  public int maxPlayers;
}
