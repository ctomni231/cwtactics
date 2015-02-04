package net.wolfTec.wtEngine.model;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.WolfTecEngine;
import net.wolfTec.wtEngine.assets.AssetItem;
import net.wolfTec.wtEngine.assets.AssetLoader;
import net.wolfTec.wtEngine.assets.AssetType;
import net.wolfTec.wtEngine.base.EngineInitializationListener;
import net.wolfTec.wtEngine.base.EngineOptions;
import net.wolfTec.wtEngine.log.Logger;
import net.wolfTec.wtEngine.persistence.StorageBean;
import net.wolfTec.wtEngine.utility.BrowserHelperBean;
import net.wolfTec.wtEngine.utility.ExternalRequestOptions;
import net.wolfTec.wtEngine.utility.ReadOnlyJsArray;

import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;

@Namespace("cwt") public class ObjectTypesBean implements EngineInitializationListener, AssetLoader {

  private Logger log;
  private BrowserHelperBean browserUtil;
  private StorageBean storage;

  private TypeDatabase<ArmyType> armyTypes;
  private TypeDatabase<MoveType> moveTypes;
  private TypeDatabase<UnitType> unitTypes;
  private TypeDatabase<TileType> tileTypes;
  private TypeDatabase<WeatherType> weatherTypes;
  private TypeDatabase<PropertyType> propertyTypes;
  private TypeDatabase<CoType> commanderTypes;
  private Modification modification;

  @Override public void onEngineInit(EngineOptions options, WolfTecEngine engine) {

  }

  @Override public void cacheAsset(AssetItem item, Object data, Callback0 callback) {
    if (item.type == AssetType.MODIFICATION) {
      storage.set(item.name, data, browserUtil.bindCallback((storageEntry, error) -> {
        if (error != null) {
          log.error("CachingModificationException");
        } else {
          callback.$invoke();
        }
      }, this)); 
    }
  }

  @Override public void loadAsset(AssetItem item, Object data, Callback0 callback) {
    if (item.type == AssetType.MODIFICATION) {
      this.modification = (Modification) data;
    }
  }

  @Override public void grabAsset(AssetItem item, Callback1<Object> callback) {
    if (item.type == AssetType.MODIFICATION) {
      ExternalRequestOptions data = new ExternalRequestOptions();

      data.json = true;
      data.path = Constants.DEFAULT_MOD_PATH;

      data.success = browserUtil.bindCallback((mod) -> {
        callback.$invoke(mod);
      }, this);

      data.error = browserUtil.bindCallback((error) -> {
        log.error("ModificationLoadException"); 
      }, this);

      browserUtil.doHttpRequest(data);
    }
  }

  public void registerSheet(String id, ObjectType sheet) {
    log.error("not implemented yet");
  }

  public ArmyType getArmyType(String id) {
    log.error("not implemented yet");
    return null;
  }

  public MoveType getMoveType(String id) {
    log.error("not implemented yet");
    return null;
  }

  public UnitType getUnitType(String id) {
    log.error("not implemented yet");
    return null;
  }

  public TileType getArmy(String id) {
    log.error("not implemented yet");
    return null;
  }

  public WeatherType getWeather(String id) {
    log.error("not implemented yet");
    return null;
  }

  public PropertyType getPropertyType(String id) {
    log.error("not implemented yet");
    return null;
  }

  public CoType getCommanderType(String id) {
    log.error("not implemented yet");
    return null;
  }

  public ReadOnlyJsArray<ArmyType> getArmyTypes() {
    log.error("not implemented yet");
    return null;
  }

  public ReadOnlyJsArray<MoveType> getMoveTypes() {
    log.error("not implemented yet");
    return null;
  }

  public ReadOnlyJsArray<UnitType> getUnitTypes() {
    log.error("not implemented yet");
    return null;
  }

  public ReadOnlyJsArray<TileType> getArmies() {
    log.error("not implemented yet");
    return null;
  }

  public ReadOnlyJsArray<WeatherType> getWeathers() {
    log.error("not implemented yet");
    return null;
  }

  public ReadOnlyJsArray<PropertyType> getPropertyTypes() {
    log.error("not implemented yet");
    return null;
  }

  public ReadOnlyJsArray<CoType> getCommanderTypes() {
    log.error("not implemented yet");
    return null;
  }

  /**
   * 
   * @return the current active modification
   */
  public Modification getModificationData() {
    return modification;
  }
}
