package org.wolftec.cwt.sheets.loaders;

import org.stjs.javascript.Map;
import org.wolftec.cwt.ErrorManager;
import org.wolftec.cwt.sheets.SheetDatabase;
import org.wolftec.cwt.sheets.SheetManager;
import org.wolftec.cwt.sheets.WeatherType;

public class WeatherTypeLoader extends AbstractSheetLoader<WeatherType> {

  SheetManager db;
  ErrorManager errors;

  @Override
  public String forPath() {
    return "weathers";
  }

  @Override
  public SheetDatabase<WeatherType> getDatabase() {
    return db.weathers;
  }

  @Override
  public Class<WeatherType> getSheetClass() {
    return WeatherType.class;
  }

  @Override
  public void hydrate(Map<String, Object> data, WeatherType sheet) {
    sheet.defaultWeather = readNullable(data, "defaultWeather", false);
  }
}
