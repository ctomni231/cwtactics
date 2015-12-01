package org.wolftec.cwt.model.sheets.loaders;

import org.wolftec.cwt.model.GenericDataObject;
import org.wolftec.cwt.model.gameround.objecttypes.MoveType;
import org.wolftec.cwt.model.sheets.SheetSet;

public class MoveTypeLoader extends AbstractSheetLoader<MoveType> {

  public MoveTypeLoader(SheetSet<MoveType> db) {
    super(db);
  }

  @Override
  public String forPath() {
    return "movetypes";
  }

  @Override
  public Class<MoveType> getSheetClass() {
    return MoveType.class;
  }

  @Override
  public void hydrate(GenericDataObject data, MoveType sheet) {
    sheet.costs = data.read("costs");
  }
}
