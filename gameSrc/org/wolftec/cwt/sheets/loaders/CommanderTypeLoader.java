package org.wolftec.cwt.sheets.loaders;

import org.wolftec.cwt.sheets.CommanderType;
import org.wolftec.cwt.sheets.SheetDatabase;
import org.wolftec.cwt.sheets.SheetManager;

public class CommanderTypeLoader extends SheetLoader<CommanderType> {
  private SheetManager db;

  @Override
  public String forPath() {
    return "cos";
  }

  @Override
  SheetDatabase<CommanderType> getDatabase() {
    return db.commanders;
  }
}
