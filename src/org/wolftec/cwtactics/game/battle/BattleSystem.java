package org.wolftec.cwtactics.game.battle;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.gameround.UnitCreated;
import org.wolftec.cwtactics.game.event.gameround.UnitDestroyed;
import org.wolftec.cwtactics.game.event.loading.LoadPropertyType;
import org.wolftec.cwtactics.game.event.loading.LoadTileType;
import org.wolftec.cwtactics.game.event.loading.LoadUnitType;
import org.wolftec.cwtactics.game.living.Living;

/**
 * The {@link BattleSystem} allows players to use units with the battle ability
 * to fight against other entities with the living ability.
 */
public class BattleSystem implements System, UnitCreated, UnitDestroyed, LoadUnitType, LoadPropertyType, LoadTileType {

  private Asserter                           asserter;

  private Components<Living>                 livings;
  private Components<FighterPrimaryWeapon>   primaryWeapons;
  private Components<FighterSecondaryWeapon> secondaryWeapons;
  private Components<RangedFighter>          rangedFigthers;
  private Components<Defense>                defenses;

  @Override
  public void onUnitCreated(String unitEntity) {
    livings.acquire(unitEntity).hp = Constants.UNIT_HEALTH;
  }

  @Override
  public void onUnitDestroyed(String unitEntity) {
    livings.release(unitEntity);
  }

  @Override
  public void onLoadUnitType(String entity, Object data) {
    if (primaryWeapons.isComponentInRootData(data)) {
      FighterPrimaryWeapon primWp = primaryWeapons.acquireWithRootData(entity, data);
      asserter.inspectValue("FPW.ammo of " + entity, primWp.ammo).isIntWithinRange(0, 10);
    }

    if (rangedFigthers.isComponentInRootData(data)) {
      RangedFighter rangFig = rangedFigthers.acquireWithRootData(entity, data);
      asserter.inspectValue("RF.minRange of " + entity, rangFig.minRange).isIntWithinRange(0, Constants.MAX_SELECTION_RANGE - 1);
      asserter.inspectValue("RF.maxrange of " + entity, rangFig.maxRange).isIntWithinRange(rangFig.minRange + 1, Constants.MAX_SELECTION_RANGE);
      asserter.inspectValue("FPW and RF exists together of " + entity, primaryWeapons.has(entity)).isTrue();
    }

    if (secondaryWeapons.isComponentInRootData(data)) {
      secondaryWeapons.acquireWithRootData(entity, data);
    }
  }

  @Override
  public void onLoadPropertyType(String entity, Object data) {
    Defense defense = defenses.acquireWithRootData(entity, data);
    asserter.inspectValue("DF.defense of " + entity, defense.defense).isIntWithinRange(0, 9);
  }

  @Override
  public void onLoadTileType(String entity, Object data) {
    Defense defense = defenses.acquireWithRootData(entity, data);
    asserter.inspectValue("DF.defense of " + entity, defense.defense).isIntWithinRange(0, 9);
  }

  private boolean isDirectFighter(String entity) {
    return !isIndirectFighter(entity);
  }

  private boolean isIndirectFighter(String entity) {
    return rangedFigthers.get(entity) != null;
  }

  private boolean isBallisticFither(String entity) {
    RangedFighter range = rangedFigthers.get(entity);
    return range != null && range.minRange == 1;
  }
}
