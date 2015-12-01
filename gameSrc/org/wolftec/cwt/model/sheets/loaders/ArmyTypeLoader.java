package org.wolftec.cwt.model.sheets.loaders;

import org.wolftec.cwt.model.GenericDataObject;
import org.wolftec.cwt.model.gameround.objecttypes.ArmyType;
import org.wolftec.cwt.model.sheets.SheetSet;

public class ArmyTypeLoader extends AbstractSheetLoader<ArmyType> {

  public ArmyTypeLoader(SheetSet<ArmyType> db) {
    super(db);
  }

  @Override
  public String forPath() {
    return "armies";
  }

  @Override
  public Class<ArmyType> getSheetClass() {
    return ArmyType.class;
  }

  @Override
  public void hydrate(GenericDataObject data, ArmyType sheet) {
    sheet.color = data.read("color");
    sheet.name = data.read("name");
  }
}
