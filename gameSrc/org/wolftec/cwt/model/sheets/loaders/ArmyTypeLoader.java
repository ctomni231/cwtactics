package org.wolftec.cwt.model.sheets.loaders;

import org.stjs.javascript.Map;
import org.wolftec.cwt.model.sheets.SheetDatabase;
import org.wolftec.cwt.model.sheets.types.ArmyType;

public class ArmyTypeLoader extends AbstractSheetLoader<ArmyType>
{

  @Override
  public String forPath()
  {
    return "armies";
  }

  @Override
  public SheetDatabase<ArmyType> getDatabase()
  {
    return db.armies;
  }

  @Override
  public Class<ArmyType> getSheetClass()
  {
    return ArmyType.class;
  }

  @Override
  public void hydrate(Map<String, Object> data, ArmyType sheet)
  {
    sheet.color = read(data, "color");
    sheet.name = read(data, "name");
  }
}
