package org.wolftec.cwt.model.sheets.loaders;

import org.wolftec.cwt.model.GenericDataObject;
import org.wolftec.cwt.model.gameround.objecttypes.FieldType;
import org.wolftec.cwt.model.sheets.SheetSet;

public class TileTypeLoader extends AbstractSheetLoader<FieldType> {

  public TileTypeLoader(SheetSet<FieldType> db) {
    super(db);
  }

  @Override
  public String forPath() {
    return "tiles";
  }

  @Override
  public Class<FieldType> getSheetClass() {
    return FieldType.class;
  }

  @Override
  public void hydrate(GenericDataObject data, FieldType sheet) {
    sheet.defense = data.read("defense");
    sheet.visionBlocker = data.readNullable("visionBlocker", false);
  }
}
