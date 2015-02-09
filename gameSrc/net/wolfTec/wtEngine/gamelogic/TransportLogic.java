package net.wolfTec.wtEngine.gamelogic;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.model.Player;
import net.wolfTec.wtEngine.model.Unit;

public interface TransportLogic extends BaseLogic {

  /**
   * @return true if the unit with id tid is a transporter, else false.
   */
  default boolean isTransportUnit(Unit unit) {
    return (unit.getType().maxloads > 0);
  }

  /**
   * Has a transporter unit with id tid loaded units?
   * 
   * @return {boolean} true if yes, else false.
   */
  default boolean hasLoads(Unit unit) {
    for (int i = 0, e = Constants.MAX_UNITS; i < e; i++) {
      if (unit == getGameRound().getUnit(i).getLoadedIn()) return true;
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
  default boolean canLoadUnit(Unit transporter, Unit load) {
    return (transporter.getType().canload.indexOf(load.getType().movetype) != -1);
  }

  /**
   * Loads the unit with id lid into a transporter with the id tid.
   *
   * @param {Unit} transporter
   * @param {Unit} load
   */
  default void loadUnit(Unit transporter, Unit load) {
    if (load == transporter) {
      throw new IllegalArgumentException("SameUnit");
    }
    if (load.getLoadedIn() != null) {
      throw new IllegalArgumentException("AlreadyLoaded");
    }

    load.setLoadedIn(transporter);
  }

  /**
   * Unloads the unit with id lid from a transporter with the id tid.
   *
   * @param {Unit} transport
   * @param {Unit} load
   */
  default void unloadUnit(Unit transporter, Unit load) {
    if (load.getLoadedIn() != transporter) {
      throw new IllegalArgumentException("NotLoadedInTransporter");
    }

    load.setLoadedIn(null);
  }
  
  /**
   * Returns true if a transporter unit can unload one of it's loads at a given position.
   * This functions understands the given pos as possible position for the transporter.
   *
   * @param {Unit} transporter
   * @param {Number} x
   * @param {Number} y
   * @return {boolean}
   */
  default boolean canUnloadSomethingAt(Unit transporter, int x, int y) {
      Player pid = transporter.getOwner();
      Unit unit;

      // TODO if (constants.DEBUG) assert(isTransportUnit(transporter));
      for (int i = 0, e = Constants.MAX_UNITS; i < e; i++) {

          unit = getGameRound().getUnit(i);
          if (unit.getLoadedIn() == transporter) {
              var moveType = sheets.getSheet(sheets.TYPE_MOVETYPE, unit.type.movetype);

              if (move.canTypeMoveTo(moveType, x - 1, y)) return true;
              if (move.canTypeMoveTo(moveType, x + 1, y)) return true;
              if (move.canTypeMoveTo(moveType, x, y - 1)) return true;
              if (move.canTypeMoveTo(moveType, x, y + 1)) return true;
          }
      }

      return false;
  }
}
