package org.wolftec.cwt.sheets.loaders;

import org.stjs.javascript.Map;
import org.wolftec.cwt.ErrorManager;
import org.wolftec.cwt.sheets.CommanderType;
import org.wolftec.cwt.sheets.SheetDatabase;
import org.wolftec.cwt.sheets.SheetManager;

public class CommanderTypeLoader extends AbstractSheetLoader<CommanderType> {

  SheetManager db;
  ErrorManager errors;

  @Override
  public String forPath() {
    return "cos";
  }

  @Override
  public SheetDatabase<CommanderType> getDatabase() {
    return db.commanders;
  }

  @Override
  public Class<CommanderType> getSheetClass() {
    return CommanderType.class;
  }

  @Override
  public void hydrate(Map<String, Object> data, CommanderType sheet) {
    sheet.coStars = read(data, "copStars");
    sheet.scoStars = read(data, "scopStars");
  }
}
