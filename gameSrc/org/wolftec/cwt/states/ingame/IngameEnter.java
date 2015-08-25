package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.model.GameMode;
import org.wolftec.cwt.model.MapManager;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.sheets.SheetManager;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.StateManager;
import org.wolftec.cwt.system.Option;

public class IngameEnter extends AbstractState {

  private ModelManager model;
  private StateManager states;
  private SheetManager sheets;
  private MapManager   maps;

  @Override
  public void onEnter(Option<Class<? extends AbstractState>> previous) {
    maps.loadMap("testmap.json", (mapData) -> {

      model.day = 0;
      model.gameMode = GameMode.GAME_MODE_AW2;
      model.gameTimeElapsed = 0;
      model.gameTimeLimit = 0;
      model.turnTimeElapsed = 0;
      model.turnTimeLimit = 0;
      model.mapHeight = mapData.mph;
      model.mapWidth = mapData.mph;
      model.turnOwner = model.getPlayer(0);
      model.lastClientPlayer = model.getPlayer(0);
      model.weather = sheets.weathers.get("WSUN");
      model.weatherLeftDays = 4;

      model.forEachTile((x, y, tile) -> {
        tile.unit = null;
        tile.property = null;
      });

      model.forEachPlayer((index, player) -> {
        if (index >= mapData.player) {
          player.clientControlled = false;
          player.team = Constants.INACTIVE;
        } else {
          player.clientControlled = true;
          player.team = index;
        }

        player.coA = null;
        player.gold = 999999;
        player.manpower = 999999;
      });

      model.forEachUnit((index, unit) -> {
        if (index >= mapData.units.$length()) {
          unit.owner = null; /* TODO */
        } else {
          // 0, "TNTK", 2, 2, 99, 1, 20, -1, 0
          unit.type = sheets.units.get((String) mapData.units.$get(index).$get(1));

          model.getTile((int) mapData.units.$get(index).$get(2), (int) mapData.units.$get(index).$get(3)).unit = unit;

          unit.hp = (int) mapData.units.$get(index).$get(4);
          unit.ammo = (int) mapData.units.$get(index).$get(5);
          unit.fuel = (int) mapData.units.$get(index).$get(6);

          unit.owner = model.getPlayer((int) mapData.units.$get(index).$get(8));
        }
      });

      states.changeState(IdleState.class);
    });
  }

  @Override
  public Option<Class<? extends AbstractState>> update(int delta) {
    return NO_TRANSITION;
  }
}
