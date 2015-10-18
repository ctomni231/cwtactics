package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.logic.CaptureLogic;

public class ModelResetter implements Injectable {

  private ModelManager model;

  public void reset() {
    model.day = 0;
    model.gameTimeElapsed = 0;
    model.gameTimeLimit = 0;
    model.turnTimeElapsed = 0;
    model.turnTimeLimit = 0;
    model.mapHeight = 0;
    model.mapWidth = 0;
    model.turnOwner = model.getPlayer(0);
    model.lastClientPlayer = model.getPlayer(0);
    model.weather = null;
    model.weatherLeftDays = 4;

    model.forEachTile((x, y, tile) -> {
      tile.type = null;
      tile.unit = null;
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
      property.points = CaptureLogic.CAPTURE_POINTS;
      property.owner = null;/* TODO */
      property.type = null;
    });

    model.forEachUnit((index, unit) -> {
      unit.owner = null; /* TODO */
    });
  }
}
