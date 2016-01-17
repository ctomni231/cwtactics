package org.wolftec.cwt.model.persistence;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.logic.LifecycleLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.sheets.SheetManager;
import org.wolftec.cwt.serialization.SavegameHandler;
import org.wolftec.cwt.util.ObjectUtil;

public class ModelSaver implements SavegameHandler<Map<String, String>>
{

  private ModelManager model;
  private LifecycleLogic life;
  private SheetManager sheets;

  private Log log;

  @Override
  public void onGameLoad(Map<String, String> data)
  {
    log.info("loading game model");

    life.destroyEverything();

    model.mapHeight = ObjectUtil.readProperty(data, "mph");
    model.mapWidth = ObjectUtil.readProperty(data, "mpw");
    model.weather = sheets.weathers.get("WSUN");
    model.weatherLeftDays = 4;

    model.forEachTile((x, y, tile) ->
    {
      tile.type = null;
      tile.unit = null;
      tile.property = null;

      Array<Array<Integer>> map = ObjectUtil.readProperty(data, "map");
      Array<String> types = ObjectUtil.readProperty(data, "typeMap");
      if (x < model.mapWidth && y < model.mapHeight)
      {
        int tileCode = map.$get(x).$get(y);
        String tileType = types.$get(tileCode);

        tile.type = sheets.tiles.get(tileType);
      }
    });

    model.forEachPlayer((index, player) ->
    {
      int players = ObjectUtil.readProperty(data, "player");
      if (index >= players)
      {
        player.clientControlled = false;
        player.team = Constants.INACTIVE;
      }
      else
      {
        player.clientControlled = true;
        player.team = index;
      }

      player.coA = null;
      player.gold = 999999;
      player.manpower = 999999;
    });

    model.forEachProperty((index, property) ->
    {

      property.points = 20; /* TODO */

      int players = ObjectUtil.readProperty(data, "player");
      if (index >= players)
      {
        property.owner = null;/* TODO */
        property.type = null;

      }
      else
      {
        property.type = sheets.properties.get(((Array<Array<String>>) ObjectUtil.readProperty(data,
                                                                                              "prps")).$get(index).$get(3));
        property.points = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "prps")).$get(index).$get(4);
        property.owner = model.getPlayer(((Array<Array<Integer>>) ObjectUtil.readProperty(data,
                                                                                          "prps")).$get(index).$get(5));

        int px = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "prps")).$get(index).$get(1);
        int py = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "prps")).$get(index).$get(2);
        model.getTile(px, py).property = property;
      }
    });

    model.forEachUnit((index, unit) ->
    {
      if (index >= ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "units")).$length())
      {
        unit.owner = null; /* TODO */

      }
      else
      {
        unit.type = sheets.units.get(((Array<Array<String>>) ObjectUtil.readProperty(data,
                                                                                     "units")).$get(index).$get(1));

        unit.hp = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "units")).$get(index).$get(4);
        unit.ammo = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "units")).$get(index).$get(5);
        unit.fuel = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "units")).$get(index).$get(6);

        unit.owner = model.getPlayer(((Array<Array<Integer>>) ObjectUtil.readProperty(data,
                                                                                      "units")).$get(index).$get(8));

        int ux = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "units")).$get(index).$get(2);
        int uy = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "units")).$get(index).$get(3);
        model.getTile(ux, uy).unit = unit;
      }
    });
  }

  @Override
  public void onGameSave(Map<String, String> data)
  {
    log.info("saving game model");
  }

}
