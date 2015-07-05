package org.wolftec.cwtactics.game.system.game;

import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.game.AmmoDepot;
import org.wolftec.cwtactics.game.components.game.FighterPrimaryWeapon;
import org.wolftec.cwtactics.game.components.game.FuelDepot;
import org.wolftec.cwtactics.game.components.game.Funds;
import org.wolftec.cwtactics.game.components.game.Movable;
import org.wolftec.cwtactics.game.components.game.Owner;
import org.wolftec.cwtactics.game.components.game.Player;
import org.wolftec.cwtactics.game.components.game.Position;
import org.wolftec.cwtactics.game.components.game.SupplierAbility;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.game.supply.SupplyNeighbors;
import org.wolftec.cwtactics.game.event.game.turn.TurnStart;
import org.wolftec.cwtactics.game.event.persistence.LoadPropertyType;
import org.wolftec.cwtactics.game.event.persistence.LoadUnitType;

public class SupplySystem implements System, LoadUnitType, LoadPropertyType, TurnStart, SupplyNeighbors {

  private EntityManager em;
  private Asserter asserter;

  @Override
  public void onSupplyNeighbors(String supplier) {
    String player = em.getComponent(supplier, Owner.class).owner;
    Position supplierPos = em.getComponent(supplier, Position.class);

    supplyNeightbors(player, supplier, supplierPos);
  }

  @Override
  public void onTurnStart(String player, int turn) {
    doResupply(player);
    doGiveFunds(player);
  }

  private void doGiveFunds(String player) {
    Player playerData = em.getComponent(player, Player.class);
    em.getEntitiesWithComponentType(Funds.class).$forEach((prop) -> {
      Funds funds = em.getComponent(prop, Funds.class);
      playerData.gold += funds.amount;
    });
  }

  private void doResupply(String player) {
    em.getEntitiesWithComponentType(SupplierAbility.class).$forEach((supplier) -> {
      Position supplierPos = em.getComponent(supplier, Position.class);

      if (em.hasEntityComponent(supplier, Movable.class)) {
        // movable things are units
        supplyNeightbors(player, supplier, supplierPos);

      } else {

        // non movable things are properties
        resupplyUnitAt(supplierPos.x, supplierPos.y, supplier, player);
      }
    });
  }

  private void supplyNeightbors(String player, String supplier, Position supplierPos) {
    resupplyUnitAt(supplierPos.x, supplierPos.y + 1, supplier, player);
    resupplyUnitAt(supplierPos.x, supplierPos.y - 1, supplier, player);
    resupplyUnitAt(supplierPos.x + 1, supplierPos.y, supplier, player);
    resupplyUnitAt(supplierPos.x - 1, supplierPos.y, supplier, player);
  }

  private void resupplyUnitAt(int x, int y, String supplier, String expectedOwner) {
    // TODO better search!
    em.getEntitiesWithComponentType(Movable.class).$forEach((unit) -> {
      Position unitPos = em.getComponent(unit, Position.class);
      if (unitPos.x == x && unitPos.y == y) {
        SupplierAbility supAb = em.getComponent(supplier, SupplierAbility.class);

        if (supAb.refillLoads) {

          FighterPrimaryWeapon primWp = em.getComponent(unit, FighterPrimaryWeapon.class);
          if (primWp != null) {
            AmmoDepot ammo = em.getComponent(unit, AmmoDepot.class);
            ammo.amount = primWp.ammo;
          }

          Movable movable = em.getComponent(unit, Movable.class);
          FuelDepot fuel = em.getComponent(unit, FuelDepot.class);
          fuel.amount = movable.fuel;
        }
      }
    });
  }

  @Override
  public void onLoadUnitType(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, SupplierAbility.class, (supplier) -> {
      asserter.inspectValue("Supplier.refillLoads of " + entity, supplier.refillLoads).isBoolean();
      asserter.inspectValue("Supplier.supplies of " + entity, supplier.supplies).forEachArrayValue((target) -> {
        asserter.isEntityId();
      });
    });
  }

  @Override
  public void onLoadPropertyType(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, SupplierAbility.class, (supplier) -> {
      asserter.inspectValue("Supplier.refillLoads of " + entity, supplier.refillLoads).isBoolean();
      asserter.inspectValue("Supplier.supplies of " + entity, supplier.supplies).forEachArrayValue((target) -> {
        asserter.isEntityId();
      });
      em.tryAcquireComponentFromDataSuccessCb(entity, data, Funds.class, (funds) -> {
        asserter.inspectValue("Funds.amount of " + entity, funds.amount).isIntWithinRange(0, 999999);
      });
    });
  }
}
