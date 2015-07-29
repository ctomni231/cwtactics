package org.wolftec.cwt.dl;

import org.stjs.javascript.JSCollections;
import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.logic.CannonLogic;
import org.wolftec.cwt.sheets.MoveType;
import org.wolftec.cwt.sheets.PropertyType;
import org.wolftec.cwt.sheets.SheetManager;
import org.wolftec.cwt.sheets.UnitType;

public class DefaultTypes implements Injectable, Loader {

  private SheetManager sheets;

  @Override
  public int priority() {
    return 9;
  }

  @Override
  public void onLoad() {

    MoveType noMove = new MoveType();
    noMove.ID = "NOMV";
    noMove.costs = JSCollections.$map();
    noMove.costs.$put("*", -1);
    sheets.movetypes.registerSheet(noMove);

    PropertyType invisibleProperty = new PropertyType();
    invisibleProperty.ID = "INVP";
    invisibleProperty.defense = 0;
    invisibleProperty.vision = 0;
    invisibleProperty.capturePoints = 1;
    invisibleProperty.visionBlocker = true;
    sheets.properties.registerSheet(invisibleProperty);

    UnitType invisibleUnit = new UnitType();
    invisibleUnit.ID = "INVU";
    invisibleUnit.costs = -1;
    invisibleUnit.range = 0;
    invisibleUnit.movetype = "NOMV";
    invisibleUnit.vision = 1;
    invisibleUnit.fuel = 0;
    invisibleUnit.ammo = 0;
    sheets.units.registerSheet(invisibleUnit);

    UnitType laserUnit = new UnitType();
    laserUnit.ID = CannonLogic.LASER_UNIT_ID;
    laserUnit.costs = -1;
    laserUnit.range = 0;
    laserUnit.movetype = "NOMV";
    laserUnit.vision = 1;
    laserUnit.fuel = 0;
    laserUnit.ammo = 0;
    sheets.units.registerSheet(laserUnit);

    UnitType cannonUnit = new UnitType();
    cannonUnit.ID = CannonLogic.CANNON_UNIT_ID;
    cannonUnit.costs = -1;
    cannonUnit.range = 0;
    cannonUnit.movetype = "NOMV";
    cannonUnit.vision = 1;
    cannonUnit.fuel = 0;
    cannonUnit.ammo = 0;
    sheets.units.registerSheet(cannonUnit);
  }
}
