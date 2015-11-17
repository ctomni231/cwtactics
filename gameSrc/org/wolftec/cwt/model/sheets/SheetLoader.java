package org.wolftec.cwt.model.sheets;

import org.wolftec.cwt.model.sheets.loaders.ArmyTypeLoader;
import org.wolftec.cwt.model.sheets.loaders.CommanderTypeLoader;
import org.wolftec.cwt.model.sheets.loaders.MoveTypeLoader;
import org.wolftec.cwt.model.sheets.loaders.PropertyTypeLoader;
import org.wolftec.cwt.model.sheets.loaders.TileTypeLoader;
import org.wolftec.cwt.model.sheets.loaders.UnitTypeLoader;
import org.wolftec.cwt.model.sheets.loaders.WeatherTypeLoader;

/**
 * Holds all object types of the game.
 */
public class SheetLoader {

  public final WeatherTypeLoader weather;
  public final MoveTypeLoader movetype;
  public final ArmyTypeLoader army;
  public final PropertyTypeLoader property;
  public final TileTypeLoader tile;
  public final CommanderTypeLoader commander;
  public final UnitTypeLoader unit;

  public SheetLoader() {
    weather = new WeatherTypeLoader();
    movetype = new MoveTypeLoader();
    army = new ArmyTypeLoader();
    property = new PropertyTypeLoader();
    tile = new TileTypeLoader();
    commander = new CommanderTypeLoader();
    unit = new UnitTypeLoader();
  }
}
