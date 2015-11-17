package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.core.NumberUtil;
import org.wolftec.cwt.core.annotations.InjectedPostConstruction;
import org.wolftec.cwt.model.Specialization;

public class Supplies extends Specialization<Unit> {

  private static final double LOW_SUPPLIES_MODIFICATOR = 0.25;

  @InjectedPostConstruction Hidable hide;

  public int ammo;
  public int fuel;

  public void refill() {
    ammo = self.type.ammo;
    fuel = self.type.fuel;
  }

  public void drainFuel() {
    int value = self.type.dailyFuelDrain;
    if (value > 0) {

      /* hidden units may drain more fuel */
      if (hide.hidden && self.type.dailyFuelDrainHidden > 0) {
        value = self.type.dailyFuelDrainHidden;
      }

      fuel -= value;
      if (fuel < 0) {
        fuel = 0;
      }
    }
  }

  public boolean hasNoFuelLeft() {
    return fuel == 0;
  }

  /**
   * Returns true when the unit ammo is lower equals 25%.
   *
   * @return {boolean}
   */
  public boolean hasLowAmmo() {
    int cAmmo = ammo;
    int mAmmo = self.type.ammo;
    return (mAmmo != 0 && cAmmo <= NumberUtil.asInt(mAmmo * LOW_SUPPLIES_MODIFICATOR));
  }

  /**
   * Returns true when the unit fuel is lower equals 25%.
   *
   * @return {boolean}
   */
  public boolean hasLowFuel() {
    int cFuel = fuel;
    int mFuel = self.type.fuel;
    return (cFuel <= NumberUtil.asInt(mFuel * LOW_SUPPLIES_MODIFICATOR));
  }
}
