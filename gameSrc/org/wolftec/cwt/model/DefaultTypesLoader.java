package org.wolftec.cwt.model;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.core.loading.GameLoader;
import org.wolftec.cwt.logic.CannonLogic;
import org.wolftec.cwt.logic.LaserLogic;
import org.wolftec.cwt.sheets.MoveType;
import org.wolftec.cwt.sheets.PropertyType;
import org.wolftec.cwt.sheets.SheetManager;
import org.wolftec.cwt.sheets.UnitType;
import org.wolftec.cwt.system.Log;

public class DefaultTypesLoader implements Injectable, GameLoader {

  private SheetManager sheets;
  private Log          log;

  @Override
  public int priority() {
    return 1;
  }

  @Override
  public void onLoad(Callback0 done) {
    log.info("adding internal object types");

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
    laserUnit.ID = LaserLogic.LASER_UNIT_ID;
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

    done.$invoke();
  }
}
