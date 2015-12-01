package org.wolftec.cwt.model.savegame;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.annotations.AsyncCallback;
import org.wolftec.cwt.core.annotations.AsyncOperation;
import org.wolftec.cwt.core.annotations.MayRaisesError;
import org.wolftec.cwt.core.javascript.JsUtil;
import org.wolftec.cwt.core.javascript.ObjectUtil;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.log.LogFactory;
import org.wolftec.cwt.core.persistence.FolderStorage;
import org.wolftec.cwt.model.GenericDataObject;
import org.wolftec.cwt.model.gameround.Battlefield;
import org.wolftec.cwt.model.sheets.SheetDatabase;
import org.wolftec.cwt.model.tags.Tags;
import org.wolftec.cwt.model.tags.TagValue;

public class GameSaver {

  public static class GameSave {
    public int mpw;
    public int mph;
  }

  private Log LOG;
  private FolderStorage saveDir;
  private final SheetDatabase typeDB;
  private final Tags cfg;

  public GameSaver(SheetDatabase typeDB, Tags cfg) {
    LOG = LogFactory.byClass(GameSaver.class);
    saveDir = new FolderStorage("saves/");

    this.typeDB = typeDB;
    this.cfg = cfg;
  }

  @AsyncOperation
  @MayRaisesError("when save file does not exists or is corrupted")
  public void loadGame(String saveName, Battlefield game, @AsyncCallback Callback0 onFinished, @AsyncCallback Callback1<String> onFail) {
    LOG.info("loading save " + saveName);

    saveDir.readFile(saveName, (SaveData data) -> {

      GenericDataObject cfgData = new GenericDataObject(data.gametags);
      cfg.forEachConfig((cfgValue) -> {
        if (isNotAppCfg(cfgValue)) {
          cfgValue.value = cfgData.readNullable(cfgValue.key, cfgValue.def);
        }
      });

      game.map.mapHeight = ObjectUtil.readProperty(data, "mph");
      game.map.mapWidth = ObjectUtil.readProperty(data, "mpw");
      game.weather.changeWeather("WSUN", 4);

      game.map.forEachTile((x, y, tile) -> {
        tile.type = null;
        tile.unit = null;
        tile.property = null;

        Array<Array<Integer>> map = ObjectUtil.readProperty(data, "map");
        Array<String> types = ObjectUtil.readProperty(data, "typeMap");
        if (x < game.map.mapWidth && y < game.map.mapHeight) {
          int tileCode = map.$get(x).$get(y);
          String tileType = types.$get(tileCode);
          tile.type = typeDB.tiles.get(tileType);
        }
      });

      game.players.forEachPlayer((index, player) -> {
        int players = ObjectUtil.readProperty(data, "player");
        if (index >= players) {
          player.clientControlled = false;
          player.team = Constants.INACTIVE;
        } else {
          player.clientControlled = true;
          player.team = index;
        }

        player.commander.coA = null;
        player.gold = 999999;
        player.manpower = 999999;
      });

      game.properties.dropPropertiesOfPlayer(game.players.getPlayer(0));
      game.properties.dropPropertiesOfPlayer(game.players.getPlayer(1));
      game.properties.dropPropertiesOfPlayer(game.players.getPlayer(2));
      game.properties.dropPropertiesOfPlayer(game.players.getPlayer(3));

      game.properties.forEachProperty((index, property) -> {

        property.capture.points = 20; /* TODO */

        int players = ObjectUtil.readProperty(data, "player");
        if (index >= players) {
          property.owners.setOwner(null);
          property.type = null;

        } else {
          property.type = typeDB.properties.get(((Array<Array<String>>) ObjectUtil.readProperty(data, "prps")).$get(index).$get(3));
          property.capture.points = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "prps")).$get(index).$get(4);
          property.owners.setOwner(game.players.getPlayer(((Array<Array<Integer>>) ObjectUtil.readProperty(data, "prps")).$get(index).$get(5)));

          int px = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "prps")).$get(index).$get(1);
          int py = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "prps")).$get(index).$get(2);
          game.map.getTile(px, py).property = property;
        }
      });

      game.units.forEachUnit((index, unit) -> {
        if (index >= ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "units")).$length()) {
          unit.owners.setOwner(null); /* TODO */

        } else {
          unit.type = typeDB.units.get(((Array<Array<String>>) ObjectUtil.readProperty(data, "units")).$get(index).$get(1));

          unit.live.hp = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "units")).$get(index).$get(4);
          unit.supplies.ammo = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "units")).$get(index).$get(5);
          unit.supplies.fuel = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "units")).$get(index).$get(6);

          unit.owners.setOwner(game.players.getPlayer(((Array<Array<Integer>>) ObjectUtil.readProperty(data, "units")).$get(index).$get(8)));

          int ux = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "units")).$get(index).$get(2);
          int uy = ((Array<Array<Integer>>) ObjectUtil.readProperty(data, "units")).$get(index).$get(3);
          game.map.getTile(ux, uy).unit = unit;
        }
      });

    } , JsUtil.throwErrorCallback());
  }

  @AsyncOperation
  public void onGameSave(String saveName, Battlefield game, @AsyncCallback Callback0 onFinished, @AsyncCallback Callback1<String> onFail) {
    LOG.info("saving game as " + saveName + "..");

    SaveData save = new SaveData();

    GenericDataObject cfgData = new GenericDataObject(save.gametags);
    cfg.forEachConfig((cfgValue) -> {
      if (isNotAppCfg(cfgValue)) {
        cfgData.write(cfgValue.key, cfgValue.value);
      }
    });

    // FIXME game --> save
    saveDir.writeFile(saveName, save, () -> {
      LOG.info("..success");
      // FIXME

    } , JsUtil.throwErrorCallback());
  }

  private boolean isNotAppCfg(TagValue cfgValue) {
    return !cfgValue.key.startsWith("app.");
  }

}
