package org.wolftec.cwt.sheets.loaders;

import org.wolftec.cwt.sheets.SheetDatabase;
import org.wolftec.cwt.sheets.SheetManager;
import org.wolftec.cwt.sheets.WeatherType;

public class WeatherTypeLoader extends SheetLoader<WeatherType> {
  private SheetManager db;

  @Override
  public String forPath() {
    return "weathers";
  }

  @Override
  SheetDatabase<WeatherType> getDatabase() {
    return db.weathers;
  }
}
