package org.wolftec.cwt.model.sheets;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.annotations.AsyncCallback;
import org.wolftec.cwt.core.annotations.AsyncOperation;
import org.wolftec.cwt.model.gameround.objecttypes.ArmyType;
import org.wolftec.cwt.model.gameround.objecttypes.CommanderType;
import org.wolftec.cwt.model.gameround.objecttypes.FieldType;
import org.wolftec.cwt.model.gameround.objecttypes.MoveType;
import org.wolftec.cwt.model.gameround.objecttypes.PropertyType;
import org.wolftec.cwt.model.gameround.objecttypes.UnitType;
import org.wolftec.cwt.model.gameround.objecttypes.WeatherType;

/**
 * Holds all object types of the game.
 */
public class SheetDatabase {

  public final SheetSet<WeatherType> weathers;
  public final SheetSet<MoveType> movetypes;
  public final SheetSet<ArmyType> armies;
  public final SheetSet<PropertyType> properties;
  public final SheetSet<FieldType> tiles;
  public final SheetSet<CommanderType> commanders;
  public final SheetSet<UnitType> units;

  public SheetDatabase() {
    tiles = new SheetSet<FieldType>();
    units = new SheetSet<UnitType>();
    armies = new SheetSet<ArmyType>();
    weathers = new SheetSet<WeatherType>();
    movetypes = new SheetSet<MoveType>();
    properties = new SheetSet<PropertyType>();
    commanders = new SheetSet<CommanderType>();
  }

  @AsyncOperation
  public void loadSheets(@AsyncCallback Callback0 onFinish) {
    (new SheetLoader(this)).load(onFinish);
  }
}
