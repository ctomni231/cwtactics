package org.wolftec.cwt.sheets.loaders;

import org.wolftec.cwt.sheets.ArmyType;
import org.wolftec.cwt.sheets.SheetDatabase;
import org.wolftec.cwt.sheets.SheetManager;

public class ArmyTypeLoader extends SheetLoader<ArmyType> {
  private SheetManager db;

  @Override
  public String forPath() {
    return "armies";
  }

  @Override
  SheetDatabase<ArmyType> getDatabase() {
    return db.armies;
  }
}
