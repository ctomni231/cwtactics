package org.wolfTec.cwt.game.gamemodel.bean;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.gamemodel.model.ArmyType;
import org.wolfTec.cwt.game.gamemodel.model.CoType;
import org.wolfTec.cwt.game.gamemodel.model.MoveType;
import org.wolfTec.cwt.game.gamemodel.model.ObjectType;
import org.wolfTec.cwt.game.gamemodel.model.PropertyType;
import org.wolfTec.cwt.game.gamemodel.model.TileType;
import org.wolfTec.cwt.game.gamemodel.model.UnitType;
import org.wolfTec.cwt.game.gamemodel.model.WeatherType;
import org.wolfTec.wolfTecEngine.components.Injected;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.components.ManagedConstruction;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolfTec.wolfTecEngine.util.BrowserUtil;
import org.wolfTec.wolfTecEngine.vfs.VirtualFilesystemManager;

@ManagedComponent
public class ObjectTypesBean {

  @ManagedConstruction
  private Logger log;

  @Injected
  private VirtualFilesystemManager fs;

  private Map<String, ArmyType> armyTypes;
  private Array<ArmyType> armyTypeList;

  private Map<String, MoveType> moveTypes;
  private Array<MoveType> movetypesList;

  private Map<String, UnitType> unitTypes;
  private Array<UnitType> unitTypeList;

  private Map<String, TileType> tileTypes;
  private Array<TileType> tileTypeList;

  private Map<String, WeatherType> weatherTypes;
  private Array<WeatherType> weatherTypeList;

  private Map<String, PropertyType> propertyTypes;
  private Array<PropertyType> propertyTypeList;

  private Map<String, CoType> commanderTypes;
  private Array<CoType> commanderTypeList;

  public ArmyType getArmyType(String id) {
    return armyTypes.$get(id);
  }

  public Array<ArmyType> getArmyTypes() {
    return armyTypeList;
  }

  public CoType getCommanderType(String id) {
    return commanderTypes.$get(id);
  }

  public Array<CoType> getCommanderTypes() {
    return commanderTypeList;
  }

  public MoveType getMoveType(String id) {
    return moveTypes.$get(id);
  }

  public Array<MoveType> getMoveTypes() {
    return movetypesList;
  }

  public PropertyType getPropertyType(String id) {
    return propertyTypes.$get(id);
  }

  public Array<PropertyType> getPropertyTypes() {
    return propertyTypeList;
  }

  public TileType getTileType(String id) {
    return tileTypes.$get(id);
  }

  public Array<TileType> getTileTypes() {
    return tileTypeList;
  }

  public UnitType getUnitType(String id) {
    return unitTypes.$get(id);
  }

  public Array<UnitType> getUnitTypes() {
    return unitTypeList;
  }

  public WeatherType getWeather(String id) {
    return weatherTypes.$get(id);
  }

  public Array<WeatherType> getWeathers() {
    return weatherTypeList;
  }

  private <T extends ObjectType> Callback1<Callback0> loadAll(VirtualFilesystemManager fs,
      Map<String, T> typeMap, Array<T> typelist) {

    return (cb) -> {
      fs.readFiles((Array<VfsEntityDescriptor<T>> files) -> {
        for (int i = 0; i < files.$length(); i++) {
          T type = files.$get(i).value;
          typeMap.$put(type.ID, type);
          typelist.push(type);
        }
        cb.$invoke();
      });
    };
  }

  public void loadData(Callback0 cb) {
    Array<Callback1<Callback0>> steps = JSCollections.$array();
    
    steps.push(loadAll(armyFs, armyTypes, armyTypeList));
    steps.push(loadAll(movetypeFs, moveTypes, movetypesList));
    steps.push(loadAll(tileFs, tileTypes, tileTypeList));
    steps.push(loadAll(propertyFs, propertyTypes, propertyTypeList));
    steps.push(loadAll(unitFs, unitTypes, unitTypeList));
    steps.push(loadAll(weatherFs, weatherTypes, weatherTypeList));
    steps.push(loadAll(commanderFs, commanderTypes, commanderTypeList));

    BrowserUtil.executeSeries(steps, () -> {

      // register some default types

        MoveType noMove = new MoveType();
        noMove.costs = JSCollections.$map("*", -1);
        noMove.ID = EngineGlobals.NO_MOVE;
        moveTypes.$put(noMove.ID, noMove);
        movetypesList.push(noMove);

        PropertyType invProperty = new PropertyType();
        invProperty.ID = EngineGlobals.PROP_INV;
        invProperty.defense = 0;
        invProperty.vision = 0;
        invProperty.visionBlocker = true;
        invProperty.capturePoints = 1;
        propertyTypes.$put(invProperty.ID, invProperty);
        propertyTypeList.push(invProperty);

        UnitType cannonUnit = new UnitType();
        cannonUnit.ID = EngineGlobals.CANNON_UNIT_INV;
        cannonUnit.cost = -1;
        cannonUnit.range = 0;
        cannonUnit.movetype = EngineGlobals.NO_MOVE;
        cannonUnit.fuel = 0;
        cannonUnit.vision = 1;
        cannonUnit.ammo = 0;
        unitTypes.$put(cannonUnit.ID, cannonUnit);
        unitTypeList.push(cannonUnit);

        UnitType laserUnit = new UnitType();
        laserUnit.ID = EngineGlobals.LASER_UNIT_INV;
        laserUnit.cost = -1;
        laserUnit.range = 0;
        laserUnit.movetype = EngineGlobals.NO_MOVE;
        laserUnit.fuel = 0;
        laserUnit.vision = 1;
        laserUnit.ammo = 0;
        unitTypes.$put(laserUnit.ID, laserUnit);
        unitTypeList.push(laserUnit);

        cb.$invoke();
      });
  }
}
