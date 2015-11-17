package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.model.tags.TagValue;

public class LivingObtainer extends Specialization<Player> {

  private TagValue noUnitsLeftLoose;

  @Override
  public void onConstruction() {
    noUnitsLeftLoose = new TagValue("game.loose.whenNoUnitLeft", 0, 1, 0);
  }

  /**
   * @param prop
   * @return true when a loose of this property causes a loose of the game round
   */
  public boolean isCriticalProperty(Property prop) {
    return prop.type.looseAfterCaptured;
  }

  public void destroyEverything() {

    model.forEachTile((x, y, tile) -> {
      tile.type = null;
      if (NullUtil.isPresent(tile.unit)) {
        destroyUnit(x, y);
      }
      tile.property = null;
    });

    model.forEachPlayer((index, player) -> {
      player.clientControlled = true;
      player.team = index;
      player.coA = null;
      player.gold = 999999;
      player.manpower = 999999;
    });

    model.forEachProperty((index, property) -> {
      property.points = 20; /* TODO */
      property.owner = null;
      property.type = null;
    });

    model.day = 0;
    model.gameTimeElapsed = 0;
    model.gameTimeLimit = 0;
    model.turnTimeElapsed = 0;
    model.turnTimeLimit = 0;
    model.mapHeight = 0;
    model.mapWidth = 0;
    model.turnOwner = model.getPlayer(0);
    model.lastClientPlayer = model.getPlayer(0);
    model.weather.type = null;
    model.weather.leftDays = 0;
  }
}
