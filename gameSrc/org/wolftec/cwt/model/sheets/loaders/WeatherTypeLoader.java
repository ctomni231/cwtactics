package org.wolftec.cwt.model.sheets.loaders;

import org.stjs.javascript.Map;
import org.wolftec.cwt.model.sheets.SheetDatabase;
import org.wolftec.cwt.model.sheets.types.WeatherType;

public class WeatherTypeLoader extends AbstractSheetLoader<WeatherType>
{

  @Override
  public String forPath()
  {
    return "weathers";
  }

  @Override
  public SheetDatabase<WeatherType> getDatabase()
  {
    return db.weathers;
  }

  @Override
  public Class<WeatherType> getSheetClass()
  {
    return WeatherType.class;
  }

  @Override
  public void hydrate(Map<String, Object> data, WeatherType sheet)
  {
    sheet.defaultWeather = readNullable(data, "defaultWeather", false);
  }
}
