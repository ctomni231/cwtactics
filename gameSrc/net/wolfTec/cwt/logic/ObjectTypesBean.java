package net.wolfTec.cwt.logic;

import net.wolfTec.cwt.model.ArmyType;
import net.wolfTec.cwt.model.CoType;
import net.wolfTec.cwt.model.MoveType;
import net.wolfTec.cwt.model.ObjectType;
import net.wolfTec.cwt.model.PropertyType;
import net.wolfTec.cwt.model.TileType;
import net.wolfTec.cwt.model.TypeDatabase;
import net.wolfTec.cwt.model.UnitType;
import net.wolfTec.cwt.model.WeatherType;
import net.wolfTec.cwt.util.ReadOnlyJsArray;
import net.wolfTec.system.Logger;

import org.stjs.javascript.annotation.Namespace;

@Namespace("cwt") public class ObjectTypesBean {

  public Logger                      $LOG;

  private TypeDatabase<ArmyType>     armyTypes;
  private TypeDatabase<MoveType>     moveTypes;
  private TypeDatabase<UnitType>     unitTypes;
  private TypeDatabase<TileType>     tileTypes;
  private TypeDatabase<WeatherType>  weatherTypes;
  private TypeDatabase<PropertyType> propertyTypes;
  private TypeDatabase<CoType>       commanderTypes;

  public void registerSheet(String id, ObjectType sheet) {
    $LOG.error("not implemented yet");
  }

  public ArmyType getArmyType(String id) {
    $LOG.error("not implemented yet");
    return null;
  }

  public MoveType getMoveType(String id) {
    $LOG.error("not implemented yet");
    return null;
  }

  public UnitType getUnitType(String id) {
    $LOG.error("not implemented yet");
    return null;
  }

  public TileType getArmy(String id) {
    $LOG.error("not implemented yet");
    return null;
  }

  public WeatherType getWeather(String id) {
    $LOG.error("not implemented yet");
    return null;
  }

  public PropertyType getPropertyType(String id) {
    $LOG.error("not implemented yet");
    return null;
  }

  public CoType getCommanderType(String id) {
    $LOG.error("not implemented yet");
    return null;
  }

  public ReadOnlyJsArray<ArmyType> getArmyTypes() {
    $LOG.error("not implemented yet");
    return null;
  }

  public ReadOnlyJsArray<MoveType> getMoveTypes() {
    $LOG.error("not implemented yet");
    return null;
  }

  public ReadOnlyJsArray<UnitType> getUnitTypes() {
    $LOG.error("not implemented yet");
    return null;
  }

  public ReadOnlyJsArray<TileType> getArmies() {
    $LOG.error("not implemented yet");
    return null;
  }

  public ReadOnlyJsArray<WeatherType> getWeathers() {
    $LOG.error("not implemented yet");
    return null;
  }

  public ReadOnlyJsArray<PropertyType> getPropertyTypes() {
    $LOG.error("not implemented yet");
    return null;
  }

  public ReadOnlyJsArray<CoType> getCommanderTypes() {
    $LOG.error("not implemented yet");
    return null;
  }
}
