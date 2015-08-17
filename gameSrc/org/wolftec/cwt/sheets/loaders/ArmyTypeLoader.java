package org.wolftec.cwt.sheets.loaders;

import org.stjs.javascript.Map;
import org.wolftec.cwt.ErrorManager;
import org.wolftec.cwt.sheets.ArmyType;
import org.wolftec.cwt.sheets.SheetDatabase;
import org.wolftec.cwt.sheets.SheetManager;

public class ArmyTypeLoader extends SheetLoader<ArmyType> {

  SheetManager db;
  ErrorManager errors;

  @Override
  public String forPath() {
    return "armies";
  }

  @Override
  public SheetDatabase<ArmyType> getDatabase() {
    return db.armies;
  }

  @Override
  public Class<ArmyType> getSheetClass() {
    return ArmyType.class;
  }

  @Override
  public void hydrate(Map<String, Object> data, ArmyType sheet) {
    sheet.color = read(data, "color");
    sheet.name = read(data, "name");
  }
}
