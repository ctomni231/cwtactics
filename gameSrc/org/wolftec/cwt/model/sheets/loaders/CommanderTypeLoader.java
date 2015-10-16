package org.wolftec.cwt.model.sheets.loaders;

import org.stjs.javascript.Map;
import org.wolftec.cwt.model.sheets.SheetDatabase;
import org.wolftec.cwt.model.sheets.types.CommanderType;

public class CommanderTypeLoader extends AbstractSheetLoader<CommanderType> {

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
