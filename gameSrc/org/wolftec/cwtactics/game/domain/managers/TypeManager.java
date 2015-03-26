package org.wolftec.cwtactics.game.domain.managers;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.cwtactics.game.domain.types.ArmyType;
import org.wolftec.cwtactics.game.domain.types.CoType;
import org.wolftec.cwtactics.game.domain.types.MoveType;
import org.wolftec.cwtactics.game.domain.types.ObjectType;
import org.wolftec.cwtactics.game.domain.types.PropertyType;
import org.wolftec.cwtactics.game.domain.types.TileType;
import org.wolftec.cwtactics.game.domain.types.UnitType;
import org.wolftec.cwtactics.game.domain.types.WeatherType;
import org.wolftec.wCore.core.BrowserUtil;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.core.ManagedConstruction;
import org.wolftec.wCore.log.Logger;
import org.wolftec.wCore.persistence.DataTypeConverter;
import org.wolftec.wCore.persistence.VirtualFilesystemManager;

@ManagedComponent
public class TypeManager {

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

  private <T extends ObjectType> Callback1<Callback0> loadAll(String path,
      DataTypeConverter<T> conv, Map<String, T> typeMap, Array<T> typelist) {

    return (cb) -> {
      fs.readKeys(path + "/*", conv, (err, files) -> {
        if (err != null) {

        }

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

    steps.push(loadAll("/types/army/", new DataTypeConverter<ArmyType>(ArmyType.class), armyTypes,
        armyTypeList));

    steps.push(loadAll("/types/movetype/", new DataTypeConverter<MoveType>(MoveType.class),
        moveTypes, movetypesList));

    steps.push(loadAll("/types/tile/", new DataTypeConverter<TileType>(TileType.class), tileTypes,
        tileTypeList));

    steps.push(loadAll("/types/property/", new DataTypeConverter<PropertyType>(PropertyType.class),
        propertyTypes, propertyTypeList));

    steps.push(loadAll("/types/unit/", new DataTypeConverter<UnitType>(UnitType.class), unitTypes,
        unitTypeList));

    steps.push(loadAll("/types/weather/", new DataTypeConverter<WeatherType>(WeatherType.class),
        weatherTypes, weatherTypeList));

    steps.push(loadAll("/types/co/", new DataTypeConverter<CoType>(CoType.class), commanderTypes,
        commanderTypeList));

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
