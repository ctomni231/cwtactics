package org.wolftec.cwt.model.savegame;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.ObjectUtil;
import org.wolftec.cwt.core.annotations.AsyncCallback;
import org.wolftec.cwt.core.annotations.AsyncOperation;
import org.wolftec.cwt.core.annotations.MayRaisesError;
import org.wolftec.cwt.core.javascript.JsUtil;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.log.LogFactory;
import org.wolftec.cwt.core.persistence.FolderStorage;
import org.wolftec.cwt.model.gameround.Battlefield;

public class GameSaver {

  public static class GameSave {
    public int mpw;
    public int mph;
  }

  private Log LOG;
  private FolderStorage saveDir;

  public GameSaver() {
    LOG = LogFactory.byClass(GameSaver.class);
    saveDir = new FolderStorage("saves/");
  }

  @AsyncOperation
  @MayRaisesError("when save file does not exists or is corrupted")
  public void loadGame(String saveName, Battlefield game, @AsyncCallback Callback0 onFinished, @AsyncCallback Callback1<String> onFail) {
    LOG.info("loading save " + saveName);
    saveDir.readFile(saveName, (saveData) -> {

    } , JsUtil.throwErrorCallback());

    life.destroyEverything();

    model.mapHeight = ObjectUtil.readProperty(data, "mph");
    model.mapWidth = ObjectUtil.readProperty(data, "mpw");
    model.weather.type = sheets.weathers.get("WSUN");
    model.weather.leftDays = 4;

    model.forEachTile((x, y, tile) -> {
      tile.type = null;
      tile.unit = null;
      tile.property = null;

      Array<Array<Integer>> map = ObjectUtil.readProperty(data, "map");
      Array<String> types = ObjectUtil.readProperty(data, "typeMap");
      if (x < model.mapWidth && y < model.mapHeight) {
        int tileCode = map.$get(x).$get(y);
        String tileType = types.$get(tileCode);

        tile.type = sheets.tiles.get(tileType);
      }
    });

    model.forEachPlayer((index, player) -> {
      int players = ObjectUtil.readProperty(data, "player");
      if (index >= players) {
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

      int players = ObjectUtil.readProperty(data, "player");
      if (index >= players) {
        property.owner = null;/* TODO */
        property.type = null;

      } else {
        property.type = sheets.properties.get(((Array<Array<String>>) ObjectUtil.readProperty(data, "prps")).$get(index).$get(3));
        property.points = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "prps")).$get(index).$get(4);
        property.owner = model.getPlayer(((Array<Array<Integer>>) ObjectUtil.readProperty(data, "prps")).$get(index).$get(5));

        int px = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "prps")).$get(index).$get(1);
        int py = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "prps")).$get(index).$get(2);
        model.getTile(px, py).property = property;
      }
    });

    model.forEachUnit((index, unit) -> {
      if (index >= ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "units")).$length()) {
        unit.owner = null; /* TODO */

      } else {
        unit.type = sheets.units.get(((Array<Array<String>>) ObjectUtil.readProperty(data, "units")).$get(index).$get(1));

        unit.hp = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "units")).$get(index).$get(4);
        unit.ammo = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "units")).$get(index).$get(5);
        unit.fuel = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "units")).$get(index).$get(6);

        unit.owner = model.getPlayer(((Array<Array<Integer>>) ObjectUtil.readProperty(data, "units")).$get(index).$get(8));

        int ux = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "units")).$get(index).$get(2);
        int uy = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "units")).$get(index).$get(3);
        model.getTile(ux, uy).unit = unit;
      }
    });
  }

  @AsyncOperation
  public void onGameSave(String saveName, Battlefield game, @AsyncCallback Callback0 onFinished, @AsyncCallback Callback1<String> onFail) {
    LOG.info("saving game as " + saveName + "..");
    SaveData save = new SaveData();
    // FIXME game --> save
    saveDir.writeFile(saveName, save, () -> {
      LOG.info("..success");
      // FIXME

    } , JsUtil.throwErrorCallback());
  }

}
