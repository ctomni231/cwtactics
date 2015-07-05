package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.functions.Callback2;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.localforage.LocalForage;
import org.wolftec.cwtactics.engine.localforage.LocalForageConfig;
import org.wolftec.cwtactics.engine.playground.Playground;
import org.wolftec.cwtactics.engine.playground.Playground.AssetEntry;
import org.wolftec.cwtactics.engine.util.BrowserUtil;
import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.SystemStartEvent;
import org.wolftec.cwtactics.game.event.persistence.LoadArmyType;
import org.wolftec.cwtactics.game.event.persistence.LoadCommanderType;
import org.wolftec.cwtactics.game.event.persistence.LoadMap;
import org.wolftec.cwtactics.game.event.persistence.LoadMoveType;
import org.wolftec.cwtactics.game.event.persistence.LoadPropertyType;
import org.wolftec.cwtactics.game.event.persistence.LoadTileType;
import org.wolftec.cwtactics.game.event.persistence.LoadUnitType;
import org.wolftec.cwtactics.game.event.persistence.LoadWeatherType;

public class DataLoadingSystem implements System, SystemStartEvent {

  private Log           log;
  private EntityManager em;
  private EventEmitter  ev;

  LoadArmyType          armyLoadEvent;
  LoadPropertyType      propertyLoadEvent;
  LoadTileType          tileLoadEvent;
  LoadUnitType          unitLoadEvent;
  LoadMoveType          moveLoadEvent;
  LoadWeatherType       weatherLoadEvent;
  LoadCommanderType     commanderLoadEvent;
  LoadMap               mapLoadEvent;

  @Override
  public void onConstruction() {
    LocalForageConfig config = new LocalForageConfig();
    config.driver = JSCollections.$array(LocalForage.localforage.INDEXEDDB, LocalForage.localforage.WEBSQL);
    config.name = Constants.OFFLINE_DB_NAME;
    config.size = Constants.OFFLINE_DB_SIZE;
    LocalForage.localforage.config(config);
  }

  @Override
  public void onSystemStartup(Playground gameContainer) {
    loadFolder(gameContainer, "modifications/cwt/tiles", (entity, data) -> tileLoadEvent.onLoadTileType(entity, data));
    loadFolder(gameContainer, "modifications/cwt/props", (entity, data) -> propertyLoadEvent.onLoadPropertyType(entity, data));
    loadFolder(gameContainer, "modifications/cwt/movetypes", (entity, data) -> moveLoadEvent.onLoadMoveType(entity, data));
    loadFolder(gameContainer, "modifications/cwt/units", (entity, data) -> unitLoadEvent.onLoadUnitType(entity, data));
    loadFolder(gameContainer, "modifications/cwt/weathers", (entity, data) -> weatherLoadEvent.onLoadWeatherType(entity, data));
    loadFolder(gameContainer, "modifications/cwt/cos", (entity, data) -> commanderLoadEvent.onLoadCommanderType(entity, data));
    loadFolder(gameContainer, "modifications/cwt/armies", (entity, data) -> armyLoadEvent.onLoadArmyType(entity, data));

    loadFolder(gameContainer, "modifications/cwt/maps", (entity, data) -> mapLoadEvent.onLoadMap(entity, data));
  }

  private void loadFolder(Playground gameContainer, String folder, Callback2<String, Object> callback) {
    log.info("loading data from folder " + folder);

    AssetEntry data = gameContainer.getAssetEntry("__filelist__.json", folder, "json");
    LocalForage.localforage.getItem(data.path, (err, value) -> {
      if (value == null) {
        BrowserUtil.requestJsonFile(data.url, (objData, error) -> {
          loadRemoteFolderByContentList(gameContainer, folder, (Array<String>) objData, callback);
        });

      } else {
        loadCachedFolderByContentList(gameContainer, folder, (Array<String>) value, callback);
        // TODO typecheck
      }
    });
  }

  private void loadRemoteFolderByContentList(Playground game, String folder, Array<String> content, Callback2<String, Object> callback) {

    JsUtil.forEachArrayValue(content, (index, id) -> {
      AssetEntry data = game.getAssetEntry(id, folder, "json");

      game.loader.add(data.key);

      log.info("grabbed value from " + data.url);

      BrowserUtil.requestJsonFile(data.url, (objData, error) -> {
        log.info("parsing and validating " + data.key);

        String entity = JSObjectAdapter.hasOwnProperty(objData, "ID") ? em.acquireEntityWithId(JSObjectAdapter.$get(objData, "ID").toString()) : null;
        callback.$invoke(entity, objData);

        LocalForage.localforage.setItem(data.key, objData, (err, savedData) -> {
          log.info("saved data file " + data.key);
          game.loader.success(data.key);
        });
      });
    });
  }

  private void loadCachedFolderByContentList(Playground game, String folder, Array<String> content, Callback2<String, Object> callback) {
    JsUtil.forEachArrayValue(content, (index, id) -> {
      AssetEntry data = game.getAssetEntry(id, folder, "json");

      game.loader.add(data.key);

      LocalForage.localforage.getItem(data.key, (err, value) -> {
        log.info("grabbed value from the cache");

        String entity = em.acquireEntityWithId(JSObjectAdapter.$get(value, "ID").toString());
        callback.$invoke(entity, value);

        game.loader.success(data.key);
      });
    });
  }
}
