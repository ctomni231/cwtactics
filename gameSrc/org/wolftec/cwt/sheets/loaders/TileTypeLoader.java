package org.wolftec.cwt.sheets.loaders;

import org.stjs.javascript.Map;
import org.wolftec.cwt.ErrorManager;
import org.wolftec.cwt.sheets.SheetDatabase;
import org.wolftec.cwt.sheets.SheetManager;
import org.wolftec.cwt.sheets.TileType;

public class TileTypeLoader extends SheetLoader<TileType> {

  SheetManager db;
  ErrorManager errors;

  @Override
  public String forPath() {
    return "tiles";
  }

  @Override
  public SheetDatabase<TileType> getDatabase() {
    return db.tiles;
  }

  @Override
  public Class<TileType> getSheetClass() {
    return TileType.class;
  }

  @Override
  public void hydrate(Map<String, Object> data, TileType sheet) {
    sheet.defense = read(data, "defense");
    sheet.visionBlocker = readNullable(data, "visionBlocker", false);
  }
}
