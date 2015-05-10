package org.wolftec.cwtactics.engine.loader;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.components.ConstructedClass;
import org.wolftec.cwtactics.engine.components.ConstructedFactory;
import org.wolftec.cwtactics.engine.localforage.LocalForage;
import org.wolftec.cwtactics.engine.localforage.LocalForageConfig;
import org.wolftec.cwtactics.engine.playground.Playground.AssetEntry;
import org.wolftec.cwtactics.game.Cwt;
import org.wolftec.cwtactics.game.data.ArmyType;
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

  public void loadData(Cwt game, GameDataService dataService) {
    info("loading data");

    AssetEntry data = game.getAssetEntry("ORST", "armies", "json");

    game.loader.add(data.key);

    LocalForage.localforage.getItem(data.key, (err, value) -> {
      if (value != null) {
        info("grabbed value from the cache");
        ArmyType type = JSGlobal.stjs.typefy((ArmyType) value, ArmyType.class);
        ConstructedFactory.getObject(GameDataService.class).registerDataType(type);
        game.loader.success(data.key);

      } else {
        info("grabbed value from remote resource location");
        ConstructedFactory.getObject(BrowserService.class).doXmlHttpRequest(data.url, null, (objData, error) -> {
          ArmyType type = JSGlobal.stjs.typefy((ArmyType) JSGlobal.JSON.parse((String) objData), ArmyType.class);
          ConstructedFactory.getObject(GameDataService.class).registerDataType(type);
          info("putting it into the cache");
          LocalForage.localforage.setItem(data.key, type, (errInner, valueInner) -> {
            game.loader.success(data.key);
          });
        });
      }
    });
  }
}
