package org.wolfTec.cwt.game.gamemodel.model;

import org.wolfTec.validation.IntValue;
import org.wolfTec.validation.StringValue;

public class MapFileType {

  @StringValue(minLength = 4, maxLength = 32)
  public String mapName;

  @IntValue(min = 2, max = 4)
  public int maxPlayers;
}
