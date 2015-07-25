package org.wolftec.cwt.logic;

import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.model.Property;
import org.wolftec.cwt.model.Unit;
import org.wolftec.cwt.sheets.PropertyType;
import org.wolftec.cwt.sheets.SheetManager;

public class SiloLogic implements Injectable {

  private ModelManager model;
  private SheetManager sheets;

  //
  // Returns true if a property id is a rocket silo. A rocket silo has the
  // ability to fire a rocket to a
  // position with an impact.
  //
  public boolean isRocketSilo(Property property) {
    return (property.type.rocketsilo != null);
  }

  //
  // Returns **true** when a silo **property** can be triggered by a given
  // **unit**. If not, **false** will be returned.
  //
  public boolean canBeFiredBy(Property property, Unit unit) {
    return (property.type.rocketsilo.fireable.indexOf(unit.type.ID) > -1);
  }

  //
  // Returns **true** if a given silo **property** can be fired to a given
  // position (**x**,**y**). If not, **false**
  // will be returned.
  //
  public boolean canBeFiredTo(Property property, int x, int y) {
    return (model.isValidPosition(x, y));
  }

  //
  // Fires a rocket from a given rocket silo at position (**x**,**y**) to a
  // given target
  // position (**tx**,**ty**) and inflicts damage to all units in the range of
  // the explosion. The health of the units
  // will be never lower as 9 health after the explosion.
  //
  public void fireSilo(int x, int y, int tx, int ty) {
    Property silo = model.getTile(x, y).property;

    // change silo type to empty
    PropertyType type = silo.type;
    silo.type = sheets.properties.get(type.rocketsilo.changeTo);

    int damage = Unit.pointsToHealth(type.rocketsilo.damage);
    int range = type.rocketsilo.range;

    model.doInRange(tx, ty, range, (cx, cy, tile, crange) -> {
      Unit unit = tile.unit;
      if (unit != null) {
        unit.takeDamage(damage, 9);
      }
      return true;
    });
  }
}
