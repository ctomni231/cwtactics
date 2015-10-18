package org.wolftec.cwt.logic;

import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Unit;

public class ExplodeLogic implements Injectable {

  private LifecycleLogic lifecycle;

  /**
   * Returns true if the unit is capable to self destruct.
   * 
   * @param unit
   * @return
   */
  public boolean canSelfDestruct(Unit unit) {
    return unit.type.suicide.damage > 0 && unit.type.suicide.range > 0;
  }

  /**
   * Returns the health that will be damaged by an explosion of the exploder
   * unit.
   * 
   * @param unit
   * @return
   */
  public int getExplosionDamage(Unit unit) {
    return Unit.pointsToHealth(unit.type.suicide.damage);
  }

  /**
   * Returns the explosion range of the exploder unit.
   * 
   * @param unit
   * @return
   */
  public int getSuicideRange(Unit unit) {
    return unit.type.suicide.range;
  }

  /**
   * Invokes an explosion with a given range at position (x,y). All units in the
   * range will be damaged by the value damage. The health of an unit in range
   * will never be lower than 9 health after the explosion ( means it will have
   * 1HP left).
   * 
   * @param model
   * @param x
   * @param y
   * @param range
   * @param damage
   */
  public void explode(ModelManager model, int x, int y, int range, int damage) {
    lifecycle.destroyUnit(x, y, false);
    model.doInRange(x, y, range, (cx, cy, ctile, crange) -> {
      Unit unit = ctile.unit;
      if (unit != null) {
        unit.takeDamage(damage, 9);
      }
      return true;
    });
  }
}
