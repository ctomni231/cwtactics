package org.wolfTec.cwt.game.model.types;

import javax.jws.Oneway;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.assets.AssetItem;
import org.wolfTec.cwt.game.assets.AssetLoader;
import org.wolfTec.cwt.game.assets.AssetType;
import org.wolfTec.cwt.game.log.Logger;
import org.wolfTec.cwt.game.model.Modification;
import org.wolfTec.cwt.game.persistence.StorageBean;
import org.wolfTec.cwt.game.persistence.StorageEntry;
import org.wolfTec.cwt.game.utility.BrowserHelperBean;
import org.wolfTec.cwt.game.utility.ExternalRequestOptions;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.Injected;
import org.wolfTec.cwt.utility.beans.InjectedByFactory;
import org.wolfTec.cwt.utility.beans.PostInitialization;
import org.wolfTec.cwt.utility.container.ImmutableArray;

@Bean
public class ObjectTypesBean implements AssetLoader {

  @InjectedByFactory
  private Logger log;
  @Injected
  private BrowserHelperBean browserUtil;
  @Injected
  private StorageBean storage;

  private TypeDatabase<ArmyType> armyTypes;
  private TypeDatabase<MoveType> moveTypes;
  private TypeDatabase<UnitType> unitTypes;
  private TypeDatabase<TileType> tileTypes;
  private TypeDatabase<WeatherType> weatherTypes;
  private TypeDatabase<PropertyType> propertyTypes;
  private TypeDatabase<CoType> commanderTypes;
  private Modification modification;

  @PostInitialization
  public void init() {
    MoveType noMove = new MoveType();
    noMove.costs = JSCollections.$map("*", -1);
    noMove.ID = EngineGlobals.NO_MOVE;
    registerSheet(MoveType.class, noMove);

    PropertyType invProperty = new PropertyType();
    invProperty.ID = EngineGlobals.PROP_INV;
    invProperty.defense = 0;
    invProperty.vision = 0;
    invProperty.visionBlocker = true;
    invProperty.capturePoints = 1;
    registerSheet(PropertyType.class, invProperty);

    UnitType cannonUnit = new UnitType();
    cannonUnit.ID = EngineGlobals.CANNON_UNIT_INV;
    cannonUnit.cost = -1;
    cannonUnit.range = 0;
    cannonUnit.movetype = EngineGlobals.NO_MOVE;
    cannonUnit.fuel = 0;
    cannonUnit.vision = 1;
    cannonUnit.ammo = 0;
    registerSheet(PropertyType.class, cannonUnit);

    UnitType laserUnit = new UnitType();
    laserUnit.ID = EngineGlobals.LASER_UNIT_INV;
    laserUnit.cost = -1;
    laserUnit.range = 0;
    laserUnit.movetype = EngineGlobals.NO_MOVE;
    laserUnit.fuel = 0;
    laserUnit.vision = 1;
    laserUnit.ammo = 0;
    registerSheet(UnitType.class, laserUnit);
  }

  @Override
  public void loadAsset(StorageBean storage, AssetItem item, Callback0 callback) {
    if (item.type == AssetType.MODIFICATION) {
      storage.get(item.name, (StorageEntry<Modification> entry) -> {
        this.modification = entry.value;
      });
    }
  }

  @Override
  public void grabAsset(StorageBean storage, AssetItem item, Callback0 callback) {
    if (item.type == AssetType.MODIFICATION) {
      ExternalRequestOptions data = new ExternalRequestOptions();

      data.json = true;
      data.path = EngineGlobals.DEFAULT_MOD_PATH;

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

  public <T extends ObjectType> void registerSheet(Class<T> type, ObjectType sheet) {
    log.error("not implemented yet"); // TODO
  }

  public ArmyType getArmyType(String id) {
    log.error("not implemented yet"); // TODO
    return null;
  }

  public MoveType getMoveType(String id) {
    log.error("not implemented yet"); // TODO
    return null;
  }

  public UnitType getUnitType(String id) {
    log.error("not implemented yet"); // TODO
    return null;
  }

  public TileType getArmy(String id) {
    log.error("not implemented yet"); // TODO
    return null;
  }

  public WeatherType getWeather(String id) {
    log.error("not implemented yet"); // TODO
    return null;
  }

  public PropertyType getPropertyType(String id) {
    log.error("not implemented yet"); // TODO
    return null;
  }

  public CoType getCommanderType(String id) {
    log.error("not implemented yet"); // TODO
    return null;
  }

  public ImmutableArray<ArmyType> getArmyTypes() {
    log.error("not implemented yet"); // TODO
    return null;
  }

  public ImmutableArray<MoveType> getMoveTypes() {
    log.error("not implemented yet"); // TODO
    return null;
  }

  public ImmutableArray<UnitType> getUnitTypes() {
    log.error("not implemented yet"); // TODO
    return null;
  }

  public ImmutableArray<TileType> getArmies() {
    log.error("not implemented yet"); // TODO
    return null;
  }

  public ImmutableArray<WeatherType> getWeathers() {
    log.error("not implemented yet"); // TODO
    return null;
  }

  public ImmutableArray<PropertyType> getPropertyTypes() {
    log.error("not implemented yet"); // TODO
    return null;
  }

  public ImmutableArray<CoType> getCommanderTypes() {
    log.error("not implemented yet"); // TODO
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
