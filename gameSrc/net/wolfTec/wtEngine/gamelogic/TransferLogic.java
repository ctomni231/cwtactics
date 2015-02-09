package net.wolfTec.wtEngine.gamelogic;

import net.wolfTec.wtEngine.model.Player;
import net.wolfTec.wtEngine.model.Property;
import net.wolfTec.wtEngine.model.Unit;

public interface TransferLogic extends BaseLogic, TransportLogic {

  /**
   *
   * @param unit
   * @returns {boolean}
   */
  default boolean canTransferUnit(Unit unit) {
    return !hasLoads(unit);
  }

  /**
   *
   * @param unit
   * @param player
   */
  default void transferUnitToPlayer(Unit unit, Player player) {
    Player origPlayer = unit.getOwner();

    origPlayer.numberOfUnits--;
    unit.setOwner(player);
    player.numberOfUnits++;

    // remove vision when unit transfers to an enemy team
    if (origPlayer.team != player.team) {
      model.searchUnit(unit, this.changeVision_, null, origPlayer);
    }
  }

  /*
   * var changeVision_ = function (x, y, object, oldOwner) { if (object
   * instanceof model.Unit) { cwt.Fog.removeUnitVision(x, y, oldOwner);
   * cwt.Fog.addUnitVision(x, y, object.owner); } else {
   * cwt.Fog.removePropertyVision(x, y, oldOwner); cwt.Fog.addPropertyVision(x,
   * y, object.owner); } };
   */
  /**
   *
   * @param property
   * @returns {boolean}
   */
  default boolean canTransferProperty(Property property) {
    return (property.type.notTransferable != true);
  }

  /**
   * 
   * @param property
   * @param player
   */
  default void transferPropertyToPlayer(Property property, Player player) {
    Player origPlayer = property.owner;
    property.owner = player;

    // remove vision when unit transfers to an enemy team
    if (origPlayer.team != player.team) {
      // TODO
      model.searchProperty(property, changeVision_, null, origPlayer);
    }
  }

  /**
   * 
   * @param source
   * @param target
   * @param money
   */
  default void transferMoney(Player source, Player target, int money) {
    source.gold += money;
    target.gold -= money;
  }
}
