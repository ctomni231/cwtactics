package org.wolfTec.cwt.game.model.types;

import org.wolfTec.wolfTecEngine.data.IntValue;
import org.wolfTec.wolfTecEngine.data.StringValue;

public class MapFileType {

  @StringValue(minLength = 4, maxLength = 32)
  public String mapName;

  @IntValue(min = 2, max = 4)
  public int maxPlayers;
}
