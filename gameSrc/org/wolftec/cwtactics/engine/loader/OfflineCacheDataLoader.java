package org.wolftec.cwtactics.engine.loader;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.components.ConstructedClass;
import org.wolftec.cwtactics.engine.components.ConstructedFactory;
import org.wolftec.cwtactics.engine.localforage.LocalForage;
import org.wolftec.cwtactics.engine.localforage.LocalForageConfig;
import org.wolftec.cwtactics.engine.playground.Playground;
import org.wolftec.cwtactics.engine.playground.Playground.AssetEntry;
import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.data.ObjectType;
import org.wolftec.cwtactics.game.service.BrowserService;
import org.wolftec.cwtactics.game.service.GameDataService;

public class OfflineCacheDataLoader implements ConstructedClass {
  // TODO naming
  @Override
  public void onConstruction() {
    info("initializing cache loader");

    LocalForageConfig config = new LocalForageConfig();
    config.driver = JSCollections.$array(LocalForage.localforage.INDEXEDDB, LocalForage.localforage.WEBSQL);
    config.name = Constants.OFFLINE_DB_NAME;
    config.size = Constants.OFFLINE_DB_SIZE;
    LocalForage.localforage.config(config);
  }

  public void loadFolderData(Playground game, String folder, Class<? extends ObjectType> dataClass) {
    info("loading data from folder " + folder);
    AssetEntry data = game.getAssetEntry("__filelist__.json", folder, "json");
    LocalForage.localforage.getItem(data.path, (err, value) -> {
      if (value == null) {
        ConstructedFactory.getObject(BrowserService.class).doXmlHttpRequest(data.url, null, (objData, error) -> {
          loadRemoteFolderByContentList(game, folder, (Array<String>) JSGlobal.JSON.parse((String) objData), dataClass);
        });
      } else {
        loadCachedFolderByContentList(game, folder, (Array<String>) value, dataClass); // TODO
        // typecheck
      }
    });

  }

  private <T extends ObjectType> void loadRemoteFolderByContentList(Playground game, String folder, Array<String> content, Class<T> dataClass) {
    JsUtil.forEachArrayValue(content, (index, id) -> {
      AssetEntry data = game.getAssetEntry(id, folder, "json");

      game.loader.add(data.key);

      info("grabbed value from " + data.url);
      ConstructedFactory.getObject(BrowserService.class).doXmlHttpRequest(data.url, null, (objData, error) -> {
        info("parsing and validating " + data.key);
        T type = JSGlobal.stjs.typefy((T) JSGlobal.JSON.parse((String) objData), dataClass);
        ConstructedFactory.getObject(GameDataService.class).registerDataType(type);
        info("putting " + data.key + " into the cache");
        LocalForage.localforage.setItem(data.key, type, (errInner, valueInner) -> {
          game.loader.success(data.key);
        });
      });
    });
  }

  private <T extends ObjectType> void loadCachedFolderByContentList(Playground game, String folder, Array<String> content, Class<T> dataClass) {
    JsUtil.forEachArrayValue(content, (index, id) -> {
      AssetEntry data = game.getAssetEntry(id, folder, "json");

      game.loader.add(data.key);

      LocalForage.localforage.getItem(data.key, (err, value) -> {
        info("grabbed value from the cache");
        T type = JSGlobal.stjs.typefy((T) value, dataClass);
        ConstructedFactory.getObject(GameDataService.class).registerDataType(type);
        game.loader.success(data.key);
      });
    });
  }
}
