package org.wolftec.cwtactics.game.logic;

import org.stjs.javascript.JSGlobal;
import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;
import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.cwtactics.game.domain.managers.TypeManager;
import org.wolftec.cwtactics.game.domain.model.GameManager;
import org.wolftec.cwtactics.game.domain.model.Unit;
import org.wolftec.cwtactics.game.domain.types.MoveType;

@ManagedComponent
public class TransportLogic {

  @Injected
  private GameManager gameround;
  @Injected
  private TypeManager types;
  @Injected
  private MoveLogic move;

  /**
   * @return true if the unit with id tid is a transporter, else false.
   */
  public boolean isTransportUnit(Unit unit) {
    return (unit.type.maxloads > 0);
  }

  /**
   * Has a transporter unit with id tid loaded units?
   * 
   * @return {boolean} true if yes, else false.
   */
  public boolean hasLoads(Unit unit) {
    for (int i = 0, e = EngineGlobals.MAX_UNITS; i < e; i++) {
      if (unit == gameround.getUnit(i).loadedIn) return true;
    }
    return false;
  }

  /**
   * Returns true if a transporter with id tid can loadGameConfig the unit with
   * the id lid. This function also calculates the resulting weight if the
   * transporter would loadGameConfig the unit. If the calculated weight is
   * greater than the maximum loadable weight false will be returned.
   *
   * @param transporter
   * @param load
   * @return {boolean}
   */
  public boolean canLoadUnit(Unit transporter, Unit load) {
    return (transporter.type.canload.indexOf(load.type.movetype) != -1);
  }

  /**
   * Loads the unit with id lid into a transporter with the id tid.
   *
   * @param {Unit} transporter
   * @param {Unit} load
   */
  public void loadUnit(Unit transporter, Unit load) {
    if (load == transporter) {
      JSGlobal.stjs.exception("SameUnit");
    }
    if (load.loadedIn != null) {
      JSGlobal.stjs.exception("AlreadyLoaded");
    }

    load.loadedIn = transporter;
  }

  /**
   * Unloads the unit with id lid from a transporter with the id tid.
   *
   * @param {Unit} transport
   * @param {Unit} load
   */
  public void unloadUnit(Unit transporter, Unit load) {
    if (load.loadedIn != transporter) {
      JSGlobal.stjs.exception("NotLoadedInTransporter");
    }

    load.loadedIn = null;
  }

  /**
   * Returns true if a transporter unit can unload one of it's loads at a given
   * position. This functions understands the given pos as possible position for
   * the transporter.
   *
   * @param {Unit} transporter
   * @param {Number} x
   * @param {Number} y
   * @return {boolean}
   */
  public boolean canUnloadSomethingAt(Unit transporter, int x, int y) {
    Unit unit;

    // TODO if (constants.DEBUG) assert(isTransportUnit(transporter));
    for (int i = 0, e = EngineGlobals.MAX_UNITS; i < e; i++) {

      unit = gameround.getUnit(i);
      if (unit.loadedIn == transporter) {
        MoveType moveType = types.getMoveType(unit.type.movetype);

        if (move.canTypeMoveTo(moveType, x - 1, y)) return true;
        if (move.canTypeMoveTo(moveType, x + 1, y)) return true;
        if (move.canTypeMoveTo(moveType, x, y - 1)) return true;
        if (move.canTypeMoveTo(moveType, x, y + 1)) return true;
      }
    }

    return false;
  }
}
