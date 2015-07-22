package org.wolftec.cwt.sheets;

import org.wolftec.cwt.core.Injectable;

public class SheetManager implements Injectable {

  public final SheetDatabase<WeatherType>   weathers;
  public final SheetDatabase<MoveType>      movetypes;
  public final SheetDatabase<ArmyType>      armies;
  public final SheetDatabase<PropertyType>  properties;
  public final SheetDatabase<TileType>      tiles;
  public final SheetDatabase<CommanderType> commanders;
  public final SheetDatabase<UnitType>      units;

  public SheetManager() {
    tiles = new SheetDatabase<TileType>();
    units = new SheetDatabase<UnitType>();
    armies = new SheetDatabase<ArmyType>();
    weathers = new SheetDatabase<WeatherType>();
    movetypes = new SheetDatabase<MoveType>();
    properties = new SheetDatabase<PropertyType>();
    commanders = new SheetDatabase<CommanderType>();
  }
}
