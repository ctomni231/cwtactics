package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.game.components.BattleSupplies;
import org.wolftec.cwtactics.game.components.FighterPrimaryWeapon;
import org.wolftec.cwtactics.game.components.MovingSupplies;
import org.wolftec.cwtactics.game.components.Funds;
import org.wolftec.cwtactics.game.components.MovingAbility;
import org.wolftec.cwtactics.game.components.Owner;
import org.wolftec.cwtactics.game.components.Player;
import org.wolftec.cwtactics.game.components.Position;
import org.wolftec.cwtactics.game.components.SupplierAbility;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.SupplyNeighbors;
import org.wolftec.cwtactics.game.events.gameround.TurnStarts;
import org.wolftec.cwtactics.game.events.loading.LoadPropertyType;
import org.wolftec.cwtactics.game.events.loading.LoadUnitType;

public class SupplySystem implements System, LoadUnitType, LoadPropertyType, TurnStarts, SupplyNeighbors {

  private Asserter                         asserter;

  private Components<Owner>                owners;
  private Components<Funds>                funds;
  private Components<Player>               players;
  private Components<Position>             positions;
  private Components<SupplierAbility>      suppliers;
  private Components<MovingAbility>              movables;
  private Components<MovingSupplies>            fuelOwners;
  private Components<BattleSupplies>            ammoOwners;
  private Components<FighterPrimaryWeapon> primaryWeapons;

  @Override
  public void onSupplyNeighbors(String supplier) {
    String player = owners.get(supplier).owner;
    Position supplierPos = positions.get(supplier);

    supplyNeightbors(player, supplier, supplierPos);
  }

  @Override
  public void onTurnStarts(String player, int turn) {
    doResupply(player);
    doGiveFunds(player);
  }

  private void doGiveFunds(String player) {
    Player playerData = players.get(player);
    funds.each((entity, funds) -> playerData.gold += funds.amount);
  }

  private void doResupply(String player) {
    suppliers.each((entity, supplier) -> {
      Position supplierPos = positions.get(entity);
      if (movables.has(entity)) {

        // movable things are units
        supplyNeightbors(player, entity, supplierPos);

      } else {

        // non movable things are properties
        resupplyUnitAt(supplierPos.x, supplierPos.y, entity, player);
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
    movables.each((entity, unit) -> {

      Position unitPos = positions.get(entity);
      if (unitPos.x == x && unitPos.y == y) {
        SupplierAbility supAb = suppliers.get(supplier);

        if (supAb.refillLoads) {

          if (primaryWeapons.has(entity)) {
            ammoOwners.get(entity).amount = primaryWeapons.get(entity).ammo;
          }
          fuelOwners.get(entity).fuel = movables.get(entity).fuel;
        }
      }
    });
  }

  @Override
  public void onLoadUnitType(String entity, Object data) {
    if (suppliers.isComponentInRootData(data)) {
      SupplierAbility supplier = suppliers.acquireWithRootData(entity, data);
      asserter.inspectValue("Supplier.refillLoads of " + entity, supplier.refillLoads).isBoolean();
      asserter.inspectValue("Supplier.supplies of " + entity, supplier.supplies).forEachArrayValue((target) -> {
        asserter.isEntityId();
      });
    }
  }

  @Override
  public void onLoadPropertyType(String entity, Object data) {
    if (suppliers.isComponentInRootData(data)) {
      SupplierAbility supplier = suppliers.acquireWithRootData(entity, data);
      asserter.inspectValue("Supplier.refillLoads of " + entity, supplier.refillLoads).isBoolean();
      asserter.inspectValue("Supplier.supplies of " + entity, supplier.supplies).forEachArrayValue((target) -> {
        asserter.isEntityId();
      });

      Funds funder = funds.acquireWithRootData(entity, data);
      asserter.inspectValue("Funds.amount of " + entity, funder.amount).isIntWithinRange(0, 999999);
    }
  }
}
