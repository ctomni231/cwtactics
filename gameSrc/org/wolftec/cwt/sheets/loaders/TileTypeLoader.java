package org.wolftec.cwt.sheets.loaders;

import org.wolftec.cwt.sheets.SheetDatabase;
import org.wolftec.cwt.sheets.SheetManager;
import org.wolftec.cwt.sheets.TileType;

public class TileTypeLoader extends SheetLoader<TileType> {
  private SheetManager db;

  @Override
  public String forPath() {
    return "tiles";
  }

  @Override
  SheetDatabase<TileType> getDatabase() {
    return db.tiles;
  }
}
