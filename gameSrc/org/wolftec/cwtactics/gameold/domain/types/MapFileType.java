package org.wolftec.cwtactics.gameold.domain.types;

import org.wolftec.wCore.validation.DataObject;
import org.wolftec.wCore.validation.validators.IntValue;
import org.wolftec.wCore.validation.validators.StringValue;

@DataObject
public class MapFileType {

  @StringValue(minLength = 4, maxLength = 32)
  public String mapName;

  @IntValue(min = 2, max = 4)
  public int maxPlayers;
}
