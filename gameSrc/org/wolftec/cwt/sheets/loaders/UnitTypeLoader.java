package org.wolftec.cwt.sheets.loaders;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.sheets.SheetDatabase;
import org.wolftec.cwt.sheets.UnitType;
import org.wolftec.cwt.system.Option;

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

    Map<String, Object> suicideData = Option.ofNullable((Map<String, Object>) data.$get("suicide")).orElseGet(() -> {
      Map<String, Object> map = JSCollections.$map();
      map.$put("damage", 0);
      map.$put("range", 0);
      return map;
    });

    Map<String, Object> supplyData = Option.ofNullable((Map<String, Object>) data.$get("supply")).orElseGet(() -> {
      Map<String, Object> map = JSCollections.$map();
      map.$put("supplier", false);
      return map;
    });

    Map<String, Object> attackData = Option.ofNullable((Map<String, Object>) data.$get("supply")).orElseGet(() -> {
      Map<String, Object> map = JSCollections.$map();
      return map;
    });

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
    sheet.suicide.damage = read(suicideData, "damage");
    sheet.suicide.range = read(suicideData, "range");
    sheet.supply.supplier = readNullable(supplyData, "supplier", true);
    sheet.attack.main_wp = readNullable(attackData, "maxrange", JSCollections.$map());
    sheet.attack.sec_wp = readNullable(attackData, "maxrange", JSCollections.$map());
    sheet.attack.minrange = readNullable(attackData, "minrange", 1);
    sheet.attack.maxrange = readNullable(attackData, "maxrange", 1);

  }
}
