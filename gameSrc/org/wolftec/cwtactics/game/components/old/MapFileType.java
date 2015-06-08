package org.wolftec.cwtactics.game.components.old;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.engine.ischeck.Is;

public class MapFileType extends ObjectType {

  // @StringValue(minLength = 4, maxLength = 32)
  public String mapName;
  public int maxPlayers;

  @Override
  protected void validateData(Array<String> errors) {
    checkExpression(Is.is.string(mapName), errors, "mapName");
    checkExpression(Is.is.integer(maxPlayers) && Is.is.within(maxPlayers, 2, 4), errors, "maxPlayers");
  }

  @Override
  public void grabDataFromMap(Map<String, Object> data) {
    mapName = grabMapValue(data, "mapName", null);
    maxPlayers = grabMapValue(data, "maxPlayers", -1);
  }
}
