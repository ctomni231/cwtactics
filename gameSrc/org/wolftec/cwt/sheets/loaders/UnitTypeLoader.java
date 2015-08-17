package org.wolftec.cwt.sheets.loaders;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.ErrorManager;
import org.wolftec.cwt.sheets.AttackType;
import org.wolftec.cwt.sheets.SheetDatabase;
import org.wolftec.cwt.sheets.SheetManager;
import org.wolftec.cwt.sheets.SuicideType;
import org.wolftec.cwt.sheets.SupplierType;
import org.wolftec.cwt.sheets.UnitType;
import org.wolftec.cwt.system.Maybe;

public class UnitTypeLoader extends SheetLoader<UnitType> {

  SheetManager db;
  ErrorManager errors;

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

    sheet.suicide = new SuicideType();
    Maybe.of(data.$get("laser")).ifPresent((subData) -> {
      Map<String, Object> subDataMap = (Map<String, Object>) subData;

      sheet.suicide.damage = read(subDataMap, "damage");
      sheet.suicide.range = read(subDataMap, "range");
    });

    sheet.attack = new AttackType();
    Maybe.of(data.$get("laser")).ifPresent((subData) -> {
      Map<String, Object> subDataMap = (Map<String, Object>) subData;

      sheet.attack.main_wp = readNullable(subDataMap, "maxrange", JSCollections.$map());
      sheet.attack.sec_wp = readNullable(subDataMap, "maxrange", JSCollections.$map());
      sheet.attack.minrange = readNullable(subDataMap, "minrange", 1);
      sheet.attack.maxrange = readNullable(subDataMap, "maxrange", 1);
    });

    sheet.supply = new SupplierType();
    Maybe.of(data.$get("laser")).ifPresent((subData) -> {
    });
  }
}
