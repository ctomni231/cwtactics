package org.wolftec.cwtactics.gameold.logic;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSGlobal;
import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.cwtactics.gameold.domain.managers.GameConfigManager;
import org.wolftec.cwtactics.gameold.domain.managers.TypeManager;
import org.wolftec.cwtactics.gameold.domain.menu.ActionMenu;
import org.wolftec.cwtactics.gameold.domain.model.GameManager;
import org.wolftec.cwtactics.gameold.domain.model.Property;
import org.wolftec.cwtactics.gameold.domain.types.UnitType;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;

@ManagedComponent
public class FactoryLogic {

  @Injected
  private GameManager gameround;

  @Injected
  private CaptureLogic capture;

  @Injected
  private GameConfigManager config;

  @Injected
  private LifecycleLogic lifecycle;

  @Injected
  private ObjectFinderBean finder;

  @Injected
  private TypeManager types;

  /**
   * Returns **true** when the given **property** is a factory, else **false**.
   *
   * @return
   */
  public boolean isFactory(Property prop) {
    return (prop.type.builds != JSGlobal.undefined);
  }

  /**
   * Returns **true** when the given **property** is a factory and can produce
   * something technically, else **false**.
   * 
   * @return
   */
  public boolean canProduce(Property prop) {
    if (capture.isNeutral(prop)) return false;

    if (!isFactory(prop)) {
      return false;
    }

    // check left manpower
    if (prop.owner.manpower == 0) {
      return false;
    }

    // check unit limit and left slots
    int unitLimit = config.getConfigValue("unitLimit");
    if (prop.owner.numberOfUnits >= unitLimit
        || prop.owner.numberOfUnits >= EngineGlobals.MAX_UNITS) {
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
  public void buildUnit(Property factory, UnitType type) {
    factory.owner.manpower--;
    factory.owner.gold -= type.cost;

    if (factory.owner.gold < 0 || factory.owner.manpower < 0) {
      throw new IllegalStateException("building unit produces an illegal game state");
    }

    int posMark = finder.findProperty(factory);
    lifecycle.createUnit(finder.getX(posMark), finder.getY(posMark), factory.owner, type);
  }

  /**
   * Generates the build menu for a **factory** and puts the build able unit
   * type ID's into a **menu**. If **markDisabled** is enabled then the function
   * will add types that temporary aren't produce able (e.g. due lack of money)
   * but marked as disabled.
   * 
   * @param factory
   * @param menu
   * @param markDisabled
   */
  public void generateBuildMenu(Property factory, ActionMenu menu, boolean markDisabled) {
    Array<UnitType> unitTypes = types.getUnitTypes();
    Array<String> bList = factory.type.builds;
    int availableGold = factory.owner.gold;

    for (int i = 0, e = unitTypes.$length(); i < e; i++) {
      UnitType type = unitTypes.$get(i);

      if (bList.indexOf(type.movetype) == -1) {
        continue;
      }

      // Is the type blocked ?
      // if (type.blocked) return false; TODO

      if (type.cost <= availableGold || markDisabled) {
        menu.addEntry(type.ID, (type.cost <= availableGold));
      }
    }
  }
}
