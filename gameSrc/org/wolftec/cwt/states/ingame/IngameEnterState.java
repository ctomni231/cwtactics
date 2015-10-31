package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.logic.features.TurnLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.ModelResetter;
import org.wolftec.cwt.model.persistence.MapData;
import org.wolftec.cwt.model.persistence.MapManager;
import org.wolftec.cwt.model.sheets.SheetManager;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.StateFlowData;
import org.wolftec.cwt.states.UiDataMapConfiguration;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.system.InputProvider;
import org.wolftec.cwt.util.JsUtil;

public class IngameEnterState extends AbstractState {

  private ModelResetter modelReset;
  private ModelManager model;
  private SheetManager sheets;
  private MapManager maps;
  private UserInteractionData uiData;

  private TurnLogic turnLogic;

  private UiDataMapConfiguration mapData;

  private boolean loaded;

  @Override
  public void onEnter(StateFlowData transition) {
    loaded = false;
    // TODO
    mapData.selectedMap = "testmap.json";

    maps.loadMap(mapData.selectedMap, (data) -> {
      try {
        cleanModel(data);
        prepareModel(mapData);

        uiData.cursorX = 0;
        uiData.cursorY = 0;

        loaded = true;
      } catch (Exception e) {
        JsUtil.throwError("Could not load map (" + e + ")");
      }
    });
  }

  @Override
  public void update(StateFlowData transition, int delta, InputProvider input) {
    if (loaded) {
      transition.setTransitionTo("IngameIdleState");
    }
  }

  private void prepareModel(UiDataMapConfiguration data) {
    turnLogic.startsTurn(model.turnOwner);
  }

  private void cleanModel(MapData mapData) {
    model.day = 0;
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
      tile.type = null;
      tile.unit = null;
      tile.property = null;

      if (x < mapData.mpw && y < mapData.mph) {
        int tileCode = mapData.map.$get(x).$get(y);
        String tileType = mapData.typeMap.$get(tileCode);

        tile.type = sheets.tiles.get(tileType);
      }
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

    model.forEachProperty((index, property) -> {

      property.points = 20; /* TODO */

      if (index >= mapData.player) {
        property.owner = null;/* TODO */
        property.type = null;

      } else {
        property.type = sheets.properties.get((String) mapData.prps.$get(index).$get(3));
        property.points = (int) mapData.prps.$get(index).$get(4);
        property.owner = model.getPlayer((int) mapData.prps.$get(index).$get(5));

        int px = (int) mapData.prps.$get(index).$get(1);
        int py = (int) mapData.prps.$get(index).$get(2);
        model.getTile(px, py).property = property;
      }
    });

    model.forEachUnit((index, unit) -> {
      if (index >= mapData.units.$length()) {
        unit.owner = null; /* TODO */

      } else {
        unit.type = sheets.units.get((String) mapData.units.$get(index).$get(1));

        unit.hp = (int) mapData.units.$get(index).$get(4);
        unit.ammo = (int) mapData.units.$get(index).$get(5);
        unit.fuel = (int) mapData.units.$get(index).$get(6);

        unit.owner = model.getPlayer((int) mapData.units.$get(index).$get(8));

        int ux = (int) mapData.units.$get(index).$get(2);
        int uy = (int) mapData.units.$get(index).$get(3);
        model.getTile(ux, uy).unit = unit;
      }
    });
  }
}
