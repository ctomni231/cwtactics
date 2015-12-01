package org.wolftec.cwt.model.sheets.loaders;

import org.wolftec.cwt.model.GenericDataObject;
import org.wolftec.cwt.model.gameround.objecttypes.CommanderType;
import org.wolftec.cwt.model.sheets.SheetSet;

public class CommanderTypeLoader extends AbstractSheetLoader<CommanderType> {

  public CommanderTypeLoader(SheetSet<CommanderType> db) {
    super(db);
  }

  @Override
  public String forPath() {
    return "cos";
  }

  @Override
  public Class<CommanderType> getSheetClass() {
    return CommanderType.class;
  }

  @Override
  void hydrate(GenericDataObject data, CommanderType sheet) {
    sheet.coStars = data.read("copStars");
    sheet.scoStars = data.read("scopStars");
  }
}
