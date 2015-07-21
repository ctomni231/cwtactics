package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.game.components.Buyable;
import org.wolftec.cwtactics.game.components.Factory;
import org.wolftec.cwtactics.game.components.Owner;
import org.wolftec.cwtactics.game.components.Position;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.error.IllegalGameData;
import org.wolftec.cwtactics.game.events.gameround.BuildUnit;
import org.wolftec.cwtactics.game.events.gameround.UnitProduced;

public class FactorySystem implements System, BuildUnit {

  private Log                  log;
  private Asserter             asserter;

  private IllegalGameData      illegalGameDataExc;
  private UnitProduced         producedEvent;

  private Components<Buyable>  buyables;
  private Components<Factory>  factories;
  private Components<Owner>    owners;
  private Components<Position> positions;

  @Override
  public void onBuildUnit(String factory, String type) {
    Factory factoryData = factories.get(factory);

    checkBuildData(type, factoryData);

    String unit = "XYSAS"; // TODO FIIIIIIIX IT !!!!

    Owner unitOwner = owners.acquire(unit);
    Owner factoryOwner = owners.get(factory);
    Position unitPos = positions.acquire(unit);
    Position factoryPos = positions.get(factory);

    unitOwner.owner = factoryOwner.owner;
    unitPos.x = factoryPos.x;
    unitPos.y = factoryPos.y;

    // em.setEntityPrototype(unit, type); // TODO FIIIIIIIX IT !!!!

    log.info("produced a unit [ID:" + unit + ", Type: " + type + "]");

    producedEvent.onUnitProduced(unit, type, unitPos.x, unitPos.y);
  }

  private void checkBuildData(String type, Factory factoryData) {
    if (factoryData == null) {
      illegalGameDataExc.onIllegalGameData("NotAFactory");

    } else if (factoryData.builds.indexOf(type) == -1) {
      illegalGameDataExc.onIllegalGameData("TypeIsNotProcuceAble");
    }
  }
}
