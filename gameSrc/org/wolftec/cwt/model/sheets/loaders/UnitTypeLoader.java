package org.wolftec.cwt.model.sheets.loaders;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.model.GenericDataObject;
import org.wolftec.cwt.model.gameround.objecttypes.UnitType;
import org.wolftec.cwt.model.sheets.SheetSet;

public class UnitTypeLoader extends AbstractSheetLoader<UnitType> {

  public UnitTypeLoader(SheetSet<UnitType> db) {
    super(db);
  }

  @Override
  public String forPath() {
    return "units";
  }

  @Override
  public Class<UnitType> getSheetClass() {
    return UnitType.class;
  }

  @Override
  public void hydrate(GenericDataObject data, UnitType sheet) {

    GenericDataObject suicideData = data.readComplexNullableByProvider("suicide", () -> {
      Map<String, Object> map = JSCollections.$map();
      map.$put("damage", 0);
      map.$put("range", 0);
      return map;
    });

    GenericDataObject supplyData = data.readComplexNullableByProvider("supply", () -> {
      Map<String, Object> map = JSCollections.$map();
      map.$put("supplier", false);
      return map;
    });

    GenericDataObject attackData = data.readComplexNullableByProvider("attack", () -> {
      Map<String, Object> map = JSCollections.$map();
      map.$put("minrange", -1);
      map.$put("maxrange", -1);
      return map;
    });

    GenericDataObject laserDataMap = data.readComplexNullableByProvider("damage", () -> {
      Map<String, Object> map = JSCollections.$map();
      map.$put("damage", 0);
      return map;
    });

    sheet.range = data.read("range");
    sheet.vision = data.read("vision");
    sheet.fuel = data.read("fuel");
    sheet.ammo = data.read("ammo");
    sheet.movetype = data.read("movetype");
    sheet.maxloads = data.readNullable("maxloads", 0);
    sheet.captures = data.readNullable("captures", false);
    sheet.blocked = data.readNullable("blocked", false);
    sheet.stealth = data.readNullable("stealth", false);
    sheet.costs = data.readNullable("costs", Constants.INACTIVE);
    sheet.dailyFuelDrain = data.readNullable("dailyFuelDrain", 0);
    sheet.dailyFuelDrainHidden = data.readNullable("dailyFuelDrainHidden", 0);
    sheet.canload = data.readNullable("canload", JSCollections.$array());

    sheet.suicide.damage = suicideData.read("damage");
    sheet.suicide.range = suicideData.read("range");

    sheet.supply.supplier = supplyData.readNullable("supplier", true);

    sheet.attack.main_wp = attackData.readNullable("main_wp", JSCollections.$map());
    sheet.attack.sec_wp = attackData.readNullable("sec_wp", JSCollections.$map());
    sheet.attack.minrange = attackData.readNullable("minrange", 1);
    sheet.attack.maxrange = attackData.readNullable("maxrange", 1);

    sheet.laser.damage = laserDataMap.read("damage");

  }
}
