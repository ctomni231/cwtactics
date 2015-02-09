package net.wolfTec.cwt.model;

import net.wolfTec.cwt.Constants;
import net.wolfTec.cwt.assets.AssetItem;
import net.wolfTec.cwt.assets.AssetLoader;
import net.wolfTec.cwt.assets.AssetType;
import net.wolfTec.cwt.log.Logger;
import net.wolfTec.cwt.persistence.StorageBean;
import net.wolfTec.cwt.persistence.StorageEntry;
import net.wolfTec.cwt.utility.BrowserHelperBean;
import net.wolfTec.cwt.utility.ExternalRequestOptions;
import net.wolfTec.cwt.utility.ReadOnlyJsArray;

import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolfTec.utility.Bean;
import org.wolfTec.utility.Injected;
import org.wolfTec.utility.InjectedByFactory;
import org.wolfTec.utility.PostInitialization;

@Bean public class ObjectTypesBean implements AssetLoader {

  @InjectedByFactory private Logger log;
  @Injected private BrowserHelperBean browserUtil;
  @Injected private StorageBean storage;

  private TypeDatabase<ArmyType> armyTypes;
  private TypeDatabase<MoveType> moveTypes;
  private TypeDatabase<UnitType> unitTypes;
  private TypeDatabase<TileType> tileTypes;
  private TypeDatabase<WeatherType> weatherTypes;
  private TypeDatabase<PropertyType> propertyTypes;
  private TypeDatabase<CoType> commanderTypes;
  private Modification modification;

  @PostInitialization public void init() {

  }

  @Override public void loadAsset(StorageBean storage, AssetItem item, Callback0 callback) {
    if (item.type == AssetType.MODIFICATION) {
      storage.get(item.name, (StorageEntry<Modification> entry) -> {
        this.modification = entry.value;
      });
    }
  }

  @Override public void grabAsset(StorageBean storage, AssetItem item, Callback0 callback) {
    if (item.type == AssetType.MODIFICATION) {
      ExternalRequestOptions data = new ExternalRequestOptions();

      data.json = true;
      data.path = Constants.DEFAULT_MOD_PATH;

      data.success = (mod) -> {
        storage.set(item.name, mod, (storageEntry, error) -> {
          if (error != null) {
            log.error("SavingModificationException");
            
          } else {
            callback.$invoke();
          }
        }); 
      };

      data.error = (error) -> log.error("ModificationLoadException");

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
