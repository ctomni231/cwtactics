package org.wolftec.cwt.model.sheets.loaders;

import org.wolftec.cwt.model.GenericDataObject;
import org.wolftec.cwt.model.gameround.objecttypes.WeatherType;
import org.wolftec.cwt.model.sheets.SheetSet;

public class WeatherTypeLoader extends AbstractSheetLoader<WeatherType> {

  public WeatherTypeLoader(SheetSet<WeatherType> db) {
    super(db);
  }

  @Override
  public String forPath() {
    return "weathers";
  }

  @Override
  public Class<WeatherType> getSheetClass() {
    return WeatherType.class;
  }

  @Override
  public void hydrate(GenericDataObject data, WeatherType sheet) {
    sheet.defaultWeather = data.readNullable("defaultWeather", false);
  }
}
