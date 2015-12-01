package org.wolftec.cwt.model.sheets.loaders;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwt.model.GenericDataObject;
import org.wolftec.cwt.model.gameround.objecttypes.PropertyType;
import org.wolftec.cwt.model.sheets.SheetSet;

public class PropertyTypeLoader extends AbstractSheetLoader<PropertyType> {

  public PropertyTypeLoader(SheetSet<PropertyType> db) {
    super(db);
  }

  @Override
  public String forPath() {
    return "props";
  }

  @Override
  public Class<PropertyType> getSheetClass() {
    return PropertyType.class;
  }

  @Override
  public void hydrate(GenericDataObject data, PropertyType sheet) {

    GenericDataObject cannonDataMap = data.readComplexNullableByProvider("cannon", () -> {
      Map<String, Object> map = JSCollections.$map();
      map.$put("damage", 0);
      map.$put("direction", "");
      map.$put("range", 0);
      return map;
    });

    GenericDataObject siloDataMap = data.readComplexNullableByProvider("rocketsilo", () -> {
      Map<String, Object> map = JSCollections.$map();
      map.$put("changeTo", "");
      map.$put("damage", 0);
      map.$put("range", 0);
      map.$put("fireable", JSCollections.$array());
      return map;
    });

    sheet.defense = data.read("defense");
    sheet.vision = data.read("vision");
    sheet.builds = data.readNullable("builds", JSCollections.$array());
    sheet.repairs = data.readNullable("repairs", JSCollections.$array());
    sheet.funds = data.readNullable("funds", 0);
    sheet.repairAmount = data.readNullable("repairAmount", 0);
    sheet.visionBlocker = data.readNullable("visionBlocker", false);
    sheet.looseAfterCaptured = data.readNullable("looseAfterCaptured", false);
    sheet.notTransferable = data.readNullable("notTransferable", false);
    sheet.capturable = data.readNullable("capturePoints", true);
    sheet.changeAfterCaptured = data.readNullable("changeAfterCaptured", sheet.ID);

    sheet.rocketsilo.changeTo = siloDataMap.read("changeTo");
    sheet.rocketsilo.damage = siloDataMap.read("damage");
    sheet.rocketsilo.range = siloDataMap.read("range");
    sheet.rocketsilo.fireable = siloDataMap.read("fireable");

    sheet.cannon.damage = cannonDataMap.read("damage");
    sheet.cannon.direction = cannonDataMap.read("direction");
    sheet.cannon.range = cannonDataMap.read("range");
  }
}
