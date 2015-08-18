package org.wolftec.cwt.sheets.loaders;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwt.ErrorManager;
import org.wolftec.cwt.sheets.PropertyType;
import org.wolftec.cwt.sheets.SheetDatabase;
import org.wolftec.cwt.sheets.SheetManager;
import org.wolftec.cwt.system.Maybe;

public class PropertyTypeLoader extends AbstractSheetLoader<PropertyType> {

  SheetManager db;
  ErrorManager errors;

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
    sheet.defense = read(data, "defense");
    sheet.vision = read(data, "vision");

    sheet.builds = readNullable(data, "builds", JSCollections.$array());
    sheet.repairs = readNullable(data, "repairs", JSCollections.$array());

    sheet.funds = readNullable(data, "funds", 0);
    sheet.repairAmount = readNullable(data, "repairAmount", 0);
    sheet.visionBlocker = readNullable(data, "visionBlocker", false);
    sheet.looseAfterCaptured = readNullable(data, "looseAfterCaptured", false);
    sheet.notTransferable = readNullable(data, "notTransferable", false);
    sheet.capturePoints = readNullable(data, "capturePoints", 20); /* TODO */
    sheet.changeAfterCaptured = readNullable(data, "changeAfterCaptured", sheet.ID);

    Maybe.of(data.$get("laser")).ifPresentOrElseDo((laserData) -> {
      Map<String, Object> laserDataMap = (Map<String, Object>) laserData;

      sheet.laser.damage = read(laserDataMap, "damage");
    }, () -> {
      sheet.laser.damage = 0;
    });

    Maybe.of(data.$get("cannon")).ifPresentOrElseDo((cannonData) -> {
      Map<String, Object> cannonDataMap = (Map<String, Object>) cannonData;

      sheet.cannon.damage = read(cannonDataMap, "damage");
      sheet.cannon.direction = read(cannonDataMap, "direction");
      sheet.cannon.range = read(cannonDataMap, "range");
    }, () -> {
      sheet.cannon.damage = 0;
      sheet.cannon.direction = "";
      sheet.cannon.range = 0;
    });

    Maybe.of(data.$get("rocketsilo")).ifPresentOrElseDo((siloData) -> {
      Map<String, Object> siloDataMap = (Map<String, Object>) siloData;

      sheet.rocketsilo.changeTo = read(siloDataMap, "changeTo");
      sheet.rocketsilo.damage = read(siloDataMap, "damage");
      sheet.rocketsilo.range = read(siloDataMap, "range");
      sheet.rocketsilo.fireable = read(siloDataMap, "fireable");
    }, () -> {
      sheet.rocketsilo.changeTo = "";
      sheet.rocketsilo.damage = 0;
      sheet.rocketsilo.range = 0;
      sheet.rocketsilo.fireable = JSCollections.$array();
    });
  }
}
