package org.wolftec.cwt.logic;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.functions.Callback2;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Property;
import org.wolftec.cwt.model.sheets.SheetManager;
import org.wolftec.cwt.model.sheets.types.UnitType;
import org.wolftec.cwt.tags.Configurable;
import org.wolftec.cwt.tags.Configuration;

public class FactoryLogic implements ManagedClass, Configurable
{

  private LifecycleLogic lifecycle;
  private SheetManager   sheets;
  private ModelManager   model;

  private Configuration unitLimit;

  @Override
  public void onConstruction()
  {
    unitLimit = new Configuration("game.limits.unitsPerPlayer", 0, Constants.MAX_UNITS, 0, 5);
  }

  //
  // Returns **true** when the given **property** is a factory, else **false**.
  //
  public boolean isFactory(Property property)
  {
    return property.type.builds.$length() > 0;
  }

  //
  // Returns **true** when the given **property** is a factory and can produce
  // something technically, else **false**.
  //
  public boolean canProduce(Property property)
  {

    // check left manpower
    if (property.owner.manpower == 0)
    {
      return false;
    }

    // check unit limit and left slots
    int count = property.owner.numberOfUnits;
    int uLimit = JSGlobal.$or(unitLimit.value, 9999999);
    if (count >= uLimit || count >= Constants.MAX_UNITS)
    {
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
  public void buildUnit(Property factory, String type)
  {
    UnitType sheet = sheets.units.get(type);

    factory.owner.manpower--;
    factory.owner.gold -= sheet.costs;

    model.searchProperty(factory, (fx, fy, fac) -> lifecycle.createUnitAtPosition(fx, fy, fac.owner, type));
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
  public void generateBuildMenu(Property factory, Callback2<String, Boolean> buildCb)
  {
    int gold = factory.owner.gold;
    Array<String> bList = factory.type.builds;
    sheets.units.forEach((key, type) ->
    {
      if (bList.indexOf(type.movetype) == -1 && bList.indexOf(type.ID) == -1)
      {
        return;
      }

      if (type.blocked)
      {
        return;
      }

      buildCb.$invoke(key, (type.costs <= gold));
    });
  }
}
