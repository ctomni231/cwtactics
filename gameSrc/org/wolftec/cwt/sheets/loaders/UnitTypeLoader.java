package org.wolftec.cwt.sheets.loaders;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.sheets.SheetDatabase;
import org.wolftec.cwt.sheets.UnitType;
import org.wolftec.cwt.system.Maybe;

public class UnitTypeLoader extends AbstractSheetLoader<UnitType> {

  @Override
  public String forPath() {
    return "units";
  }

  @Override
  public SheetDatabase<UnitType> getDatabase() {
    return db.units;
  }

  @Override
  public Class<UnitType> getSheetClass() {
    return UnitType.class;
  }

  @Override
  public void hydrate(Map<String, Object> data, UnitType sheet) {
    sheet.range = read(data, "range");
    sheet.vision = read(data, "vision");
    sheet.fuel = read(data, "fuel");
    sheet.ammo = read(data, "ammo");
    sheet.movetype = read(data, "movetype");

    sheet.maxloads = readNullable(data, "maxloads", 0);
    sheet.captures = readNullable(data, "captures", 0);
    sheet.blocked = readNullable(data, "blocked", false);
    sheet.costs = readNullable(data, "costs", Constants.INACTIVE);
    sheet.dailyFuelDrain = readNullable(data, "dailyFuelDrain", 0);
    sheet.dailyFuelDrainHidden = readNullable(data, "dailyFuelDrainHidden", 0);
    sheet.canload = readNullable(data, "canload", JSCollections.$array());

    Maybe.of(data.$get("suicide")).ifPresentOrElseDo((subData) -> {
      Map<String, Object> subDataMap = (Map<String, Object>) subData;

      sheet.suicide.damage = read(subDataMap, "damage");
      sheet.suicide.range = read(subDataMap, "range");
    } , () -> {
      sheet.suicide.damage = 0;
      sheet.suicide.range = 0;
    });

    Maybe.of(data.$get("attack")).ifPresentOrElseDo((subData) -> {
      Map<String, Object> subDataMap = (Map<String, Object>) subData;

      sheet.attack.main_wp = readNullable(subDataMap, "maxrange", JSCollections.$map());
      sheet.attack.sec_wp = readNullable(subDataMap, "maxrange", JSCollections.$map());
      sheet.attack.minrange = readNullable(subDataMap, "minrange", 1);
      sheet.attack.maxrange = readNullable(subDataMap, "maxrange", 1);

    } , () -> {
      sheet.attack.main_wp = JSCollections.$map();
      sheet.attack.sec_wp = JSCollections.$map();
      sheet.attack.minrange = 1;
      sheet.attack.maxrange = 1;
    });

    Maybe.of(data.$get("supply")).ifPresentOrElseDo((subData) -> {
      sheet.supply.supplier = true;
    } , () -> {
      sheet.supply.supplier = false;
    });
  }
}
