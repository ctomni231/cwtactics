package org.wolftec.cwt.logic;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSGlobal;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.config.OptionsManager;
import org.wolftec.cwt.core.InformationList;
import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.model.Property;
import org.wolftec.cwt.sheets.SheetManager;
import org.wolftec.cwt.sheets.UnitType;

public class FactoryLogic implements Injectable {

  private OptionsManager options;
  private LifecycleLogic lifecycle;
  private SheetManager   sheets;
  private ModelManager   model;

  //
  // Returns **true** when the given **property** is a factory, else **false**.
  //
  public boolean isFactory(Property property) {
    return (property.type.builds != null);
  }

  //
  // Returns **true** when the given **property** is a factory and can produce
  // something technically, else **false**.
  //
  public boolean canProduce(Property property) {

    // check left manpower
    if (property.owner == null || property.owner.manpower == 0) {
      return false;
    }

    // check unit limit and left slots
    int count = property.owner.numberOfUnits;
    int uLimit = JSGlobal.$or(options.unitLimit.value, 9999999);
    if (count >= uLimit || count >= Constants.MAX_UNITS) {
      return false;
    }

    return true;
  }

  /**
   * Constructs a unit with **type** in a **factory** for the owner of the
   * factory. The owner must have at least one of his unit slots free to do
   * this.
   * 
   * @param factory
   * @param type
   */
  public void buildUnit(Property factory, String type) {
    UnitType sheet = sheets.units.get(type);

    factory.owner.manpower--;
    factory.owner.gold -= sheet.costs;

    model.searchProperty(factory, (fx, fy, fac) -> lifecycle.createUnit(fx, fy, fac.owner, type));
  }

  /**
   * Generates the build menu for a **factory** and puts the build able unit
   * type ID's into a **menu**. If **markDisabled** is enabled then the function
   * will add types that temporary aren't produce able (e.g. due lack of money)
   * but marked as disabled.
   * 
   * @param factory
   * @param info
   * @param markDisabled
   */
  public void generateBuildMenu(Property factory, InformationList info, boolean markDisabled) {
    int gold = factory.owner.gold;
    Array<String> bList = factory.type.builds;
    sheets.units.forEach((key, type) -> {
      if (bList.indexOf(type.movetype) == -1) {
        return;
      }

      if (type.blocked) {
        return;
      }

      if (type.costs <= gold || markDisabled) {
        info.addInfo(key, (type.costs <= gold));
      }
    });
  }
}
