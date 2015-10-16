package org.wolftec.cwt.model.sheets.loaders;

import org.stjs.javascript.Map;
import org.wolftec.cwt.model.sheets.SheetDatabase;
import org.wolftec.cwt.model.sheets.types.TileType;

public class TileTypeLoader extends AbstractSheetLoader<TileType> {

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
