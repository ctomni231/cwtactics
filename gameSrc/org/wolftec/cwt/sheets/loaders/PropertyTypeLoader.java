package org.wolftec.cwt.sheets.loaders;

import org.wolftec.cwt.sheets.PropertyType;
import org.wolftec.cwt.sheets.SheetDatabase;
import org.wolftec.cwt.sheets.SheetManager;

public class PropertyTypeLoader extends SheetLoader<PropertyType> {
  private SheetManager db;

  @Override
  public String forPath() {
    return "props";
  }

  @Override
  SheetDatabase<PropertyType> getDatabase() {
    return db.properties;
  }
}
