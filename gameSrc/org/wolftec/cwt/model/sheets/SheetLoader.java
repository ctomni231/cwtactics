package org.wolftec.cwt.model.sheets;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.annotations.AsyncCallback;
import org.wolftec.cwt.core.annotations.AsyncOperation;
import org.wolftec.cwt.core.collection.ListUtil;
import org.wolftec.cwt.core.javascript.JsUtil;
import org.wolftec.cwt.model.sheets.loaders.AbstractSheetLoader;
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

  public SheetLoader(SheetDatabase typeDb) {
    weather = new WeatherTypeLoader(typeDb.weathers);
    movetype = new MoveTypeLoader(typeDb.movetypes);
    army = new ArmyTypeLoader(typeDb.armies);
    property = new PropertyTypeLoader(typeDb.properties);
    tile = new TileTypeLoader(typeDb.tiles);
    commander = new CommanderTypeLoader(typeDb.commanders);
    unit = new UnitTypeLoader(typeDb.units);
  }

  @AsyncOperation
  public void load(@AsyncCallback Callback0 onFinish) {
    Array<AbstractSheetLoader> loaders = JSCollections.$array();
    loaders.push(weather);
    loaders.push(movetype);
    loaders.push(army);
    loaders.push(property);
    loaders.push(tile);
    loaders.push(commander);
    loaders.push(unit);

    ListUtil.forEachArrayValueAsync(loaders, (index, loader, next) -> {
      loader.grabData(next, JsUtil.throwErrorCallback());
    } , onFinish);
  }
}
