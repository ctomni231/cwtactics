package org.wolftec.cwt.sheets.loaders;

import org.wolftec.cwt.sheets.MoveType;
import org.wolftec.cwt.sheets.SheetDatabase;
import org.wolftec.cwt.sheets.SheetManager;

public class MoveTypeLoader extends SheetLoader<MoveType> {
  private SheetManager db;

  @Override
  public String forPath() {
    return "movetypes";
  }

  @Override
  SheetDatabase<MoveType> getDatabase() {
    return db.movetypes;
  }
}
