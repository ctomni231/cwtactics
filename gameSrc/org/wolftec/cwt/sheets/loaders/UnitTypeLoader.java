package org.wolftec.cwt.sheets.loaders;

import org.wolftec.cwt.sheets.SheetDatabase;
import org.wolftec.cwt.sheets.SheetManager;
import org.wolftec.cwt.sheets.UnitType;

public class UnitTypeLoader extends SheetLoader<UnitType> {
  private SheetManager db;

  @Override
  public String forPath() {
    return "units";
  }

  @Override
  SheetDatabase<UnitType> getDatabase() {
    return db.units;
  }
}
