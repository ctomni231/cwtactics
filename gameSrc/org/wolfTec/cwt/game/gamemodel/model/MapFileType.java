package org.wolfTec.cwt.game.gamemodel.model;

import org.wolftec.validation.IntValue;
import org.wolftec.validation.StringValue;

public class MapFileType {

  @StringValue(minLength = 4, maxLength = 32)
  public String mapName;

  @IntValue(min = 2, max = 4)
  public int maxPlayers;
}
