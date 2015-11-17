package org.wolftec.cwt.model.sheets;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.annotations.AsyncCallback;
import org.wolftec.cwt.core.annotations.AsyncOperation;
import org.wolftec.cwt.model.sheets.types.ArmyType;
import org.wolftec.cwt.model.sheets.types.CommanderType;
import org.wolftec.cwt.model.sheets.types.MoveType;
import org.wolftec.cwt.model.sheets.types.PropertyType;
import org.wolftec.cwt.model.sheets.types.TileType;
import org.wolftec.cwt.model.sheets.types.UnitType;
import org.wolftec.cwt.model.sheets.types.WeatherType;

/**
 * Holds all object types of the game.
 */
public class SheetDatabase {

  public final SheetSet<WeatherType> weathers;
  public final SheetSet<MoveType> movetypes;
  public final SheetSet<ArmyType> armies;
  public final SheetSet<PropertyType> properties;
  public final SheetSet<TileType> tiles;
  public final SheetSet<CommanderType> commanders;
  public final SheetSet<UnitType> units;

  private final SheetLoader objectTypeLoaders;

  public SheetDatabase() {
    tiles = new SheetSet<TileType>();
    units = new SheetSet<UnitType>();
    armies = new SheetSet<ArmyType>();
    weathers = new SheetSet<WeatherType>();
    movetypes = new SheetSet<MoveType>();
    properties = new SheetSet<PropertyType>();
    commanders = new SheetSet<CommanderType>();

    objectTypeLoaders = new SheetLoader();
  }

  @AsyncOperation
  public void loadSheets(@AsyncCallback Callback0 onFinish) {

    onFinish.$invoke();
  }
}
