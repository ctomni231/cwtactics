package org.wolftec.cwt.model.sheets.loaders;

import org.stjs.javascript.Map;
import org.wolftec.cwt.model.sheets.SheetDatabase;
import org.wolftec.cwt.model.sheets.types.MoveType;

public class MoveTypeLoader extends AbstractSheetLoader<MoveType>
{

  @Override
  public String forPath()
  {
    return "movetypes";
  }

  @Override
  public SheetDatabase<MoveType> getDatabase()
  {
    return db.movetypes;
  }

  @Override
  public Class<MoveType> getSheetClass()
  {
    return MoveType.class;
  }

  @Override
  public void hydrate(Map<String, Object> data, MoveType sheet)
  {
    sheet.costs = read(data, "costs");
  }
}
