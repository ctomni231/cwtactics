package org.wolfTec.cwt.game.persistence.beans;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.wolfTec.cwt.game.persistence.model.SaveGameHandler;
import org.wolfTec.wolfTecEngine.beans.CreatedType;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.beans.ManagedComponent;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolfTec.wolfTecEngine.persistence.annotations.FolderPath;
import org.wolfTec.wolfTecEngine.vfs.Vfs;

/**
 * Save game handler, used to load and save game files.
 */
@ManagedComponent
public class SaveGameManagerBean {

  @CreatedType
  private Logger log;

  @CreatedType
  @FolderPath("/saves")
  private Vfs storage;

  @Injected
  private Array<SaveGameHandler<Object>> handlers;

  /**
   * Loads a save game and initializes a new game round.
   * 
   * @param name
   *          name of the save game
   * @param callback
   */
  public void loadSave(String name, Callback0 callback) {
    storage.readFile(name, (data) -> {
      Object savegame = data.value;
      for (int i = 0; i < handlers.$length(); i++) {
        Object handlerData = null; // TODO
        handlers.$get(i).onLoadGame(handlerData);
      }

      callback.$invoke();
    });
  }

  /**
   * Saves the current active game round.
   * 
   * @param name
   *          name of the save game
   * @param callback
   */
  public void saveGame(String name, Callback0 callback) {
    Map<String, Object> savegame = JSCollections.$map();
    for (int i = 0; i < handlers.$length(); i++) {
      Object handlerData = handlers.$get(i).onSaveGame();
      // TODO
    }

    storage.writeFile(name, savegame, (data, err) -> {
      if (err != null) {
        log.warn("Could not save game data");
      }

      callback.$invoke();
    });
  }

  // TODO
  // var saveData = {};
  //
  // saveData.mpw = model.mapWidth;
  // saveData.mph = model.mapHeight;
  // saveData.map = [];
  // saveData.prps = [];
  // saveData.units = [];
  //
  // // generates ID map
  // var mostIdsMap = {};
  // var mostIdsMapCurIndex = 0;
  // for (var x = 0, xe = model.mapWidth; x < xe; x++) {
  //
  // saveData.map[x] = [];
  // for (var y = 0, ye = model.mapHeight; y < ye; y++) {
  // var type = model.mapData[x][y].type.ID;
  //
  // // create number for type
  // if (!mostIdsMap.hasOwnProperty(type)) {
  // mostIdsMap[type] = mostIdsMapCurIndex;
  // mostIdsMapCurIndex++;
  // }
  //
  // saveData.map[x][y] = mostIdsMap[type];
  //
  // // saveGameConfig property
  // var prop = model.mapData[x][y].property;
  // if (prop) {
  // saveData.prps.push([
  // model.properties.indexOf(prop),
  // x,
  // y,
  // prop.type.ID,
  // prop.capturePoints,
  // prop.owner.id
  // ]);
  // }
  //
  // // saveGameConfig unit
  // var unit = model.mapData[x][y].unit;
  // if (unit) {
  // saveData.units.push([
  // model.units.indexOf(unit),
  // unit.type.ID,
  // x,
  // y,
  // unit.hp,
  // unit.ammo,
  // unit.fuel,
  // unit.loadedIn,
  // unit.owner.id,
  // unit.canAct,
  // unit.hidden
  // ]);
  // }
  // }
  // }
  //
  // // generate type map
  // saveData.typeMap = [];
  // var typeKeys = Object.keys(mostIdsMap);
  // for (var i = 0, e = typeKeys.length; i < e; i++) {
  // saveData.typeMap[mostIdsMap[typeKeys[i]]] = typeKeys[i];
  // }
  //
  // saveData.wth = model.weather.ID;
  // saveData.day = model.day;
  // saveData.trOw = model.turnOwner.id;
  // saveData.gmTm = model.gameTimeElapsed;
  // saveData.tnTm = model.turnTimeElapsed;
  //
  // saveData.cfg = {};
  // for (var i = 0, e = config.gameConfigNames.length; i < e; i++) {
  // var key = config.gameConfigNames[i];
  // saveData.cfg[key] = config.Config.getValue(key);
  // }
  //
  // storage.set("SAVE_"+name, JSON.stringify(saveData), cb);

  // public void initMap (Object gameData, boolean isSave, Callback0 callback) {
  // var property;
  // var unit;
  //
  // model.mapWidth = gameData.mpw;
  // model.mapHeight = gameData.mph;
  //
  // // map
  // for (var x = 0, xe = model.mapWidth; x < xe; x++) {
  // for (var y = 0, ye = model.mapHeight; y < ye; y++) {
  // model.mapData[x][y].type =
  // sheets.tiles.sheets[gameData.typeMap[gameData.map[x][y]]];
  // }
  // }
  //
  // // prepare properties
  // for (var i = 0, e = model.properties.length; i < e; i++) {
  // property = model.properties[i];
  // if (property) {
  // property.owner = null;
  // property.type = null;
  // property.capturePoints = 20;
  // }
  // }
  //
  // // saved properties
  // for (var i = 0, e = gameData.prps.length; i < e; i++) {
  // var propData = gameData.prps[i];
  //
  // // copy data into model
  // property = model.properties[propData[0]];
  // property.type = sheets.properties.sheets[propData[3]];
  // property.capturePoints = propData[4];
  // property.owner = (propData[5] != constants.INACTIVE) ?
  // model.players[propData[5]] : null;
  // model.mapData[propData[1]][propData[2]].property = property;
  // }
  //
  // // prepare units
  // for (var i = 0, e = model.units.length; i < e; i++) {
  // unit = model.units[i];
  // if (unit) {
  // unit.owner = null;
  // unit.canAct = false;
  // }
  // }
  //
  // // saved units
  // for (var i = 0, e = gameData.units.length; i < e; i++) {
  // var unitData = gameData.units[i];
  //
  // // copy data into model
  // unit = model.units[unitData[0]];
  // unit.type = sheets.units.sheets[unitData[1]];
  // unit.hp = unitData[4];
  // unit.ammo = unitData[5];
  // unit.fuel = unitData[6];
  // unit.loadedIn = (unitData[7] != constants.INACTIVE) ?
  // model.units[unitData[7]] : null;
  // unit.owner = model.players[unitData[8]];
  // unit.canAct = (unitData.length >= 10 && typeof unitData[9] === "boolean") ?
  // unitData[9] : true;
  // unit.hidden = (unitData.length >= 11 && typeof unitData[10] === "boolean")
  // ? unitData[10] : false;
  // model.mapData[unitData[2]][unitData[3]].unit = unit;
  // }
  //
  // // reset player data
  // for (var i = 0, e = model.players.length; i < e; i++) {
  // var player = model.players[i];
  // player.name = null;
  // player.gold = 0;
  // player.manpower = 999999;
  // player.team = (i <= gameData.player - 1) ? i : constants.NOT_AVAILABLE;
  // }
  //
  // // grab saveGameConfig game data
  // if (isSave) {
  // for (var i = 0, e = gameData.players.length; i < e; i++) {
  // var playerData = gameData.players[i];
  //
  // // set player data
  // var player = model.players[playerData[0]];
  // player.name = playerData[1];
  // player.gold = playerData[2];
  // player.team = playerData[3];
  // player.manpower = playerData[4];
  // }
  // }
  //
  // model.weather = sheets.defaultWeather;
  // model.turnOwner = model.players[0];
  // model.day = 0;
  //
  // if (isSave) {
  // model.weather = sheets.weathers.sheets[gameData.wth];
  // model.turnOwner = model.players[gameData.trOw];
  // model.day = data.day;
  // model.gameTimeElapsed = data.gmTm;
  // model.turnTimeElapsed = data.tnTm;
  // }
  //
  // config.resetValues();
  // if (isSave && data.cfg) {
  // for (var i = 0, e = config.gameConfigNames.length; i < e; i++) {
  // var key = config.gameConfigNames[i];
  // if (data.cfg[key]) {
  // config.getConfig(key).setValue(data.cfg[key]);
  // }
  // }
  // }
  //
  // // invoke callback
  // callback();
  // }

}
