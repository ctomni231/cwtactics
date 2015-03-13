package net.temp.cwt.game.gamemodel.model;

import org.wolftec.validation.annotation.IntValue;
import org.wolftec.validation.annotation.StringValue;

public class MapFileType {

  @StringValue(minLength = 4, maxLength = 32)
  public String mapName;

  @IntValue(min = 2, max = 4)
  public int maxPlayers;
}
