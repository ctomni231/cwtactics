package org.wolftec.cwt.sheets.loaders;

import org.stjs.javascript.Map;
import org.wolftec.cwt.ErrorManager;
import org.wolftec.cwt.sheets.MoveType;
import org.wolftec.cwt.sheets.SheetDatabase;
import org.wolftec.cwt.sheets.SheetManager;

public class MoveTypeLoader extends AbstractSheetLoader<MoveType> {

  SheetManager db;
  ErrorManager errors;

  @Override
  public String forPath() {
    return "movetypes";
  }

  @Override
  public SheetDatabase<MoveType> getDatabase() {
    return db.movetypes;
  }

  @Override
  public Class<MoveType> getSheetClass() {
    return MoveType.class;
  }

  @Override
  public void hydrate(Map<String, Object> data, MoveType sheet) {
    sheet.costs = read(data, "costs");
  }
}
