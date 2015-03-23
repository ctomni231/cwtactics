package org.wolftec.cwtactics.game.logic;

import org.wolftec.core.Injected;
import org.wolftec.cwtactics.game.domain.model.Player;
import org.wolftec.cwtactics.game.domain.model.Property;
import org.wolftec.cwtactics.game.domain.model.Unit;

public class TransferLogic {

  @Injected
  private TransportLogic transport;

  @Injected
  private ObjectFinderBean finder;

  @Injected
  private FogLogic fog;

  /**
   *
   * @param unit
   * @returns {boolean}
   */
  public boolean canTransferUnit(Unit unit) {
    return !transport.hasLoads(unit);
  }

  /**
   *
   * @param unit
   * @param player
   */
  public void transferUnitToPlayer(Unit unit, Player player) {
    Player origPlayer = unit.owner;

    origPlayer.numberOfUnits--;
    unit.owner = player;
    player.numberOfUnits++;

    if (origPlayer.team != player.team) {
      int posMark = finder.findUnit(unit);
      int x = finder.getX(posMark);
      int y = finder.getY(posMark);

      fog.removeUnitVision(x, y, origPlayer);
      fog.addUnitVision(x, y, player); 
    }
  }

  /**
   *
   * @param property
   * @returns {boolean}
   */
  public boolean canTransferProperty(Property property) {
    return (property.type.notTransferable != true);
  }

  /**
   * 
   * @param property
   * @param player
   */
  public void transferPropertyToPlayer(Property property, Player player) {
    Player origPlayer = property.owner;
    property.owner = player;

    if (origPlayer.team != player.team) {
      int posMark = finder.findProperty(property);
      int x = finder.getX(posMark);
      int y = finder.getY(posMark);

      fog.removePropertyVision(x, y, origPlayer);
      fog.addPropertyVision(x, y, player); 
    }
  }

  /**
   * 
   * @param source
   * @param target
   * @param money
   */
  public void transferMoney(Player source, Player target, int money) {
    source.gold += money;
    target.gold -= money;
  }
}
