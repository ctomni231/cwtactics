package org.wolftec.cwt.model.sheets.loaders;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.model.sheets.SheetDatabase;
import org.wolftec.cwt.model.sheets.types.UnitType;
import org.wolftec.cwt.util.NullUtil;

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

    Map<String, Object> suicideData = NullUtil.getOrElseByProvider((Map<String, Object>) data.$get("suicide"), () -> {
      Map<String, Object> map = JSCollections.$map();
      map.$put("damage", 0);
      map.$put("range", 0);
      return map;
    });

    Map<String, Object> supplyData = NullUtil.getOrElseByProvider((Map<String, Object>) data.$get("supply"), () -> {
      Map<String, Object> map = JSCollections.$map();
      map.$put("supplier", false);
      return map;
    });

    Map<String, Object> attackData = NullUtil.getOrElseByProvider((Map<String, Object>) data.$get("attack"), () -> {
      Map<String, Object> map = JSCollections.$map();
      map.$put("minrange", -1);
      map.$put("maxrange", -1);
      return map;
    });

    Map<String, Object> laserDataMap = NullUtil.getOrElseByProvider((Map<String, Object>) data.$get("damage"), () -> {
      Map<String, Object> map = JSCollections.$map();
      map.$put("damage", 0);
      return map;
    });

    sheet.range = read(data, "range");
    sheet.vision = read(data, "vision");
    sheet.fuel = read(data, "fuel");
    sheet.ammo = read(data, "ammo");
    sheet.movetype = read(data, "movetype");
    sheet.maxloads = readNullable(data, "maxloads", 0);
    sheet.captures = readNullable(data, "captures", false);
    sheet.blocked = readNullable(data, "blocked", false);
    sheet.stealth = readNullable(data, "stealth", false);
    sheet.costs = readNullable(data, "costs", Constants.INACTIVE);
    sheet.dailyFuelDrain = readNullable(data, "dailyFuelDrain", 0);
    sheet.dailyFuelDrainHidden = readNullable(data, "dailyFuelDrainHidden", 0);
    sheet.canload = readNullable(data, "canload", JSCollections.$array());
    sheet.suicide.damage = read(suicideData, "damage");
    sheet.suicide.range = read(suicideData, "range");
    sheet.supply.supplier = readNullable(supplyData, "supplier", true);
    sheet.attack.main_wp = readNullable(attackData, "main_wp", JSCollections.$map());
    sheet.attack.sec_wp = readNullable(attackData, "sec_wp", JSCollections.$map());
    sheet.attack.minrange = readNullable(attackData, "minrange", 1);
    sheet.attack.maxrange = readNullable(attackData, "maxrange", 1);
    sheet.laser.damage = read(laserDataMap, "damage");

  }
}
