package org.wolftec.cwt.logic;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.model.Unit;
import org.wolftec.cwt.sheets.MoveType;
import org.wolftec.cwt.sheets.SheetManager;

public class TransportLogic implements Injectable {

  private ModelManager model;
  private SheetManager sheets;
  private MoveLogic    move;

  /**
   * @param {Unit} unit
   * @return true if the unit with id tid is a transporter, else false.
   */
  public boolean isTransportUnit(Unit unit) {
    return (unit.type.maxloads > 0);
  }

  /**
   * Has a transporter unit with id tid loaded units?
   *
   * @param {Unit} unit
   * @return {boolean} true if yes, else false.
   */
  public boolean hasLoads(Unit unit) {
    int transporterId = model.getUnitId(unit);
    for (int i = 0, e = Constants.MAX_UNITS * Constants.MAX_PLAYER; i < e; i++) {
      if (unit.loadedIn == transporterId) {
        return true;
      }
    }

    return false;
  }

  /**
   * Returns true if a transporter with id tid can load the unit with the id
   * lid. This function also calculates the resulting weight if the transporter
   * would load the unit. If the calculated weight is greater than the maximum
   * loadable weight false will be returned.
   *
   * @param {Unit} transporter
   * @param {Unit} load
   * @return {boolean}
   */
  public boolean canLoadUnit(Unit transporter, Unit load) {
    return (transporter.type.canload.indexOf(sheets.movetypes.get(load.type.movetype).ID) != -1);
  }

  /**
   * Loads the unit with id lid into a transporter with the id tid.
   *
   * @param {Unit} transporter
   * @param {Unit} load
   */
  public void load(Unit transporter, Unit load) {
    if (load == transporter) {
      JsUtil.throwError("LoadException: same unit");
    }
    if (load.loadedIn != Constants.INACTIVE) {
      JsUtil.throwError("LoadException: unit already loaded");
    }

    load.loadedIn = model.getUnitId(transporter);
  }

  /**
   * Unloads the unit with id lid from a transporter with the id tid.
   *
   * @param {Unit} transport
   * @param {Unit} load
   */
  public void unload(Unit transporter, Unit load) {
    if (load.loadedIn != model.getUnitId(transporter)) {
      JsUtil.throwError("UnloadException: not in transporter");
    }

    load.loadedIn = Constants.INACTIVE;
  }

  /**
   * Returns true if a transporter unit can unload one of it's loads at a given
   * position. This functions understands the given position as possible
   * position for the transporter.
   *
   * @param {Unit} transporter
   * @param {Number} x
   * @param {Number} y
   * @return {boolean}
   */
  public boolean canUnloadSomethingAt(Unit transporter, int x, int y) {
    int pid = transporter.owner.id;
    int tid = model.getUnitId(transporter);
    Unit unit;

    for (int i = 0, e = Constants.MAX_UNITS * Constants.MAX_PLAYER; i < e; i++) {

      unit = model.getUnit(i);
      if (unit.loadedIn == tid) {
        MoveType moveType = sheets.movetypes.get(unit.type.movetype);

        if (move.canTypeMoveTo(moveType, x - 1, y)) return true;
        if (move.canTypeMoveTo(moveType, x + 1, y)) return true;
        if (move.canTypeMoveTo(moveType, x, y - 1)) return true;
        if (move.canTypeMoveTo(moveType, x, y + 1)) return true;
      }
    }

    return false;
  }
}
