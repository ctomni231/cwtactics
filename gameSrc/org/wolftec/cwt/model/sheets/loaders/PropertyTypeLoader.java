package org.wolftec.cwt.model.sheets.loaders;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwt.core.Option;
import org.wolftec.cwt.model.sheets.SheetDatabase;
import org.wolftec.cwt.model.sheets.types.PropertyType;

public class PropertyTypeLoader extends AbstractSheetLoader<PropertyType> {

  @Override
  public String forPath() {
    return "props";
  }

  @Override
  public SheetDatabase<PropertyType> getDatabase() {
    return db.properties;
  }

  @Override
  public Class<PropertyType> getSheetClass() {
    return PropertyType.class;
  }

  @Override
  public void hydrate(Map<String, Object> data, PropertyType sheet) {

    Map<String, Object> cannonDataMap = Option.ofNullable((Map<String, Object>) data.$get("cannon")).orElseGet(() -> {
      Map<String, Object> map = JSCollections.$map();
      map.$put("damage", 0);
      map.$put("direction", "");
      map.$put("range", 0);
      return map;
    });

    Map<String, Object> siloDataMap = Option.ofNullable((Map<String, Object>) data.$get("rocketsilo")).orElseGet(() -> {
      Map<String, Object> map = JSCollections.$map();
      map.$put("changeTo", "");
      map.$put("damage", 0);
      map.$put("range", 0);
      map.$put("fireable", JSCollections.$array());
      return map;
    });

    sheet.defense = read(data, "defense");
    sheet.vision = read(data, "vision");
    sheet.builds = readNullable(data, "builds", JSCollections.$array());
    sheet.repairs = readNullable(data, "repairs", JSCollections.$array());
    sheet.funds = readNullable(data, "funds", 0);
    sheet.repairAmount = readNullable(data, "repairAmount", 0);
    sheet.visionBlocker = readNullable(data, "visionBlocker", false);
    sheet.looseAfterCaptured = readNullable(data, "looseAfterCaptured", false);
    sheet.notTransferable = readNullable(data, "notTransferable", false);
    sheet.capturable = readNullable(data, "capturePoints", true);
    sheet.changeAfterCaptured = readNullable(data, "changeAfterCaptured", sheet.ID);
    sheet.rocketsilo.changeTo = read(siloDataMap, "changeTo");
    sheet.rocketsilo.damage = read(siloDataMap, "damage");
    sheet.rocketsilo.range = read(siloDataMap, "range");
    sheet.rocketsilo.fireable = read(siloDataMap, "fireable");
    sheet.cannon.damage = read(cannonDataMap, "damage");
    sheet.cannon.direction = read(cannonDataMap, "direction");
    sheet.cannon.range = read(cannonDataMap, "range");
  }
}
