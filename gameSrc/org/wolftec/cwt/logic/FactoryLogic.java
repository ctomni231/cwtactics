package org.wolftec.cwt.logic;

import org.stjs.javascript.JSGlobal;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.GameOptions;
import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.model.Property;
import org.wolftec.cwt.sheets.SheetManager;
import org.wolftec.cwt.sheets.UnitType;

public class FactoryLogic implements Injectable {

  private LifecycleLogic lifecycle;
  private SheetManager sheets;
  private ModelManager model;

//
// Returns **true** when the given **property** is a factory, else **false**.
//
public boolean isFactory (Property property) {
  return (property.type.builds != null);
}

//
// Returns **true** when the given **property** is a factory and can produce something technically, else **false**.
//
public boolean canProduce (Property property) {

  // check left manpower
  if (property.owner == null || property.owner.manpower == 0) {
    return false;
  }

  // check unit limit and left slots
  int count = property.owner.numberOfUnits;
  int uLimit = JSGlobal.$or(GameOptions.unitLimit.value, 9999999);
  if (count >= uLimit || count >= Constants.MAX_UNITS) {
    return false;
  }

  return true;
}

//
// Constructs a unit with **type** in a **factory** for the owner of the factory. The owner must have at least one
// of his unit slots free to do this.
//
public void buildUnit (Property factory, String type) {
    UnitType sheet = sheets.units.get(type);

    factory.owner.manpower--;
    factory.owner.gold -= sheet.costs;

    model.searchProperty(factory, (fx, fy, fac) -> lifecycle.createUnit(fx, fy, fac.owner, type));
}

//
// Generates the build menu for a **factory** and puts the build able unit type ID's into a **menu**. If
// **markDisabled** is enabled then the function will add types that temporary aren't produce able (e.g. due
// lack of money) but marked as disabled.
//
public void generateBuildMenu (Property factory, menu, boolean markDisabled) {

  var unitTypes = sheets.units.types;
  var bList = factory.type.builds;
  var gold = factory.owner.gold;

  for (var i = 0, e = unitTypes.length; i < e; i++) {
    var key = unitTypes[i];
    var type = sheets.units.getSheet(key);

    if (bList.indexOf(type.movetype) == -1) continue;

    // Is the tile blocked ?
    if (type.blocked) return false;

    if (type.cost <= gold || markDisabled) {
      menu.addEntry(key, (type.cost <= gold));
    }
  }
}
