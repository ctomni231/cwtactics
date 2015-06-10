package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.localforage.LocalForage;
import org.wolftec.cwtactics.engine.localforage.LocalForageConfig;
import org.wolftec.cwtactics.engine.playground.Playground;
import org.wolftec.cwtactics.engine.playground.Playground.AssetEntry;
import org.wolftec.cwtactics.engine.util.BrowserUtil;
import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.old.ObjectType;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;
import org.wolftec.cwtactics.game.event.SystemStartEvent;

public class DataLoadingSystem implements ConstructedClass, SystemStartEvent {

  private Log log;
  private EntityManager em;
  private EventEmitter ev;

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
    loadFolder(gameContainer, "modifications/cwt/tiles", LoadEntityEvent.TYPE_TILE_DATA);
    loadFolder(gameContainer, "modifications/cwt/props", LoadEntityEvent.TYPE_PROPERTY_DATA);
    loadFolder(gameContainer, "modifications/cwt/movetypes", LoadEntityEvent.TYPE_MOVETYPE_DATA);
    loadFolder(gameContainer, "modifications/cwt/units", LoadEntityEvent.TYPE_UNIT_DATA);
    loadFolder(gameContainer, "modifications/cwt/weathers", LoadEntityEvent.TYPE_WEATHER_DATA);
    // loadFolder(gameContainer, "modifications/cwt/cos",
    // LoadEntityEvent.TYPE_CO_DATA);
    loadFolder(gameContainer, "modifications/cwt/armies", LoadEntityEvent.TYPE_ARMY_DATA);
  }

  private void loadFolder(Playground gameContainer, String folder, String type) {
    log.info("loading data from folder " + folder);

    AssetEntry data = gameContainer.getAssetEntry("__filelist__.json", folder, "json");
    LocalForage.localforage.getItem(data.path, (err, value) -> {
      if (value == null) {
        BrowserUtil.requestJsonFile(data.url, (objData, error) -> {
          loadRemoteFolderByContentList(gameContainer, folder, (Array<String>) objData, type);
        });

      } else {
        loadCachedFolderByContentList(gameContainer, folder, (Array<String>) value, type);
        // TODO typecheck
      }
    });
  }

  private <T extends ObjectType> void loadRemoteFolderByContentList(Playground game, String folder, Array<String> content, String type) {
    JsUtil.forEachArrayValue(content, (index, id) -> {
      AssetEntry data = game.getAssetEntry(id, folder, "json");

      game.loader.add(data.key);

      log.info("grabbed value from " + data.url);

      BrowserUtil.requestJsonFile(data.url, (objData, error) -> {
        log.info("parsing and validating " + data.key);

        String entity = em.acquireEntityWithId(JSObjectAdapter.$get(objData, "ID").toString());
        ev.publish(LoadEntityEvent.class).onLoadEntity(entity, type, objData);

        LocalForage.localforage.setItem(data.key, objData, (err, savedData) -> {
          game.loader.success(data.key);
        });
      });
    });
  }

  private <T extends ObjectType> void loadCachedFolderByContentList(Playground game, String folder, Array<String> content, String type) {
    JsUtil.forEachArrayValue(content, (index, id) -> {
      AssetEntry data = game.getAssetEntry(id, folder, "json");

      game.loader.add(data.key);

      LocalForage.localforage.getItem(data.key, (err, value) -> {
        log.info("grabbed value from the cache");

        String entity = em.acquireEntityWithId(JSObjectAdapter.$get(value, "ID").toString());
        ev.publish(LoadEntityEvent.class).onLoadEntity(entity, type, value);

        game.loader.success(data.key);
      });
    });
  }
}
