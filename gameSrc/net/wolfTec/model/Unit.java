package net.wolfTec.model;

import net.wolfTec.Constants;
import net.wolfTec.CustomWarsTactics;
import net.wolfTec.bridges.Globals;
import net.wolfTec.database.AttackType;
import net.wolfTec.database.UnitType;
import net.wolfTec.utility.Assert;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.annotation.Namespace;

@Namespace("cwt") public class Unit implements PlayerObject {

	public enum BattleType {

		/**
		 * Direct fire type that can fire from range 1 to 1.
		 */
		DIRECT,

		/**
		 * Indirect fire type that can fire from range 2 to x.
		 */
		INDIRECT,

		/**
		 * Ballistic fire type that can fire from range 1 to x.
		 */
		BALLISTIC,

		/**
		 * Signal for units that cannot attack.
		 */
		NONE
	}

	public int hp;
	public int ammo;
	public int fuel;
	public boolean hidden;
	public boolean canAct;

	public Unit loadedIn = null;
	public UnitType type = null;
	public Player owner;

	/**
	 * @param type
	 */
	public void initByType(UnitType type) {
		this.type = type;
		this.hp = 99;
		this.ammo = type.ammo;
		this.fuel = type.fuel;
		this.hidden = false;
		this.loadedIn = null;
		this.canAct = false;
	}

	/**
	 * Returns **true** when a **unit** can capture a properties, else **false**.
	 *
	 * @return
	 */
	public boolean canCapture() {
		return type.captures > 0;
	}

	/**
	 * @return {boolean}
	 */
	public boolean isInactive() {
		return this.owner == null;
	}

	/**
	 * Damages a unit.
	 *
	 * @param damage
	 * @param minRest
	 */
	public void takeDamage(int damage, int minRest) {
		Assert.greaterEquals(damage, 1);
		Assert.greaterEquals(damage, 0);

		this.hp -= damage;
		if (this.hp < minRest)
			this.hp = minRest;
	}

	/**
	 * Heals an unit. If the unit health will be greater than the maximum health
	 * value then the difference will be added as gold to the owners gold depot.
	 *
	 * @param health
	 * @param diffAsGold
	 */
	public void heal(int health, boolean diffAsGold) {
		this.hp += health;
		if (this.hp > 99) {

			// pay difference of the result health and 100 as
			// gold ( in relation to the unit cost ) to the
			// unit owners gold depot
			if (diffAsGold == true) {
				int diff = this.hp - 99;
				this.owner.gold += JSGlobal.parseInt((this.type.cost * diff) / 100, 10);
			}

			this.hp = 99;
		}
	}

	/**
	 * @return {boolean} true when hp is greater than 0 else false
	 */
	public boolean isAlive() {
		return this.hp > 0;
	}

	/**
	 * Returns true when the unit ammo is lower equals 25%.
	 *
	 * @return {boolean}
	 */
	public boolean hasLowAmmo() {
		int cAmmo = this.ammo;
		int mAmmo = this.type.ammo;
		if (mAmmo != 0 && cAmmo <= (mAmmo * 0.25)) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Returns true when the unit fuel is lower equals 25%.
	 *
	 * @return {boolean}
	 */
	public boolean hasLowFuel() {
		int cFuel = this.fuel;
		int mFuel = this.type.fuel;
		if (cFuel <= (mFuel * 0.25)) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * @returns {boolean}
	 */
	public boolean isCapturing() {
		if (this.loadedIn != null) {
			return false;
		}

		return false;
		/*
		 * if( unit.x >= 0 ){ var property = model.property_posMap[ unit.x ][ unit.y
		 * ]; if( property !== null && property.capturePoints < 20 ){
		 * unitStatus.CAPTURES = true; } else unitStatus.CAPTURES = false; }
		 */
	}

	public void setActable(boolean value) {
		this.canAct = value;
	}

	/**
	 * Converts HP points to a health value.
	 *
	 * @param pt
	 * @example 6 HP -> 60 health 3 HP -> 30 health
	 * @returns {number}
	 */
	public static int pointsToHealth(int pt) {
		return (pt * 10);
	}

	/**
	 * Converts and returns the HP points from the health value of an unit.
	 *
	 * @param health
	 * @example health -> HP 69 -> 7 05 -> 1 50 -> 6 99 -> 10
	 * @returns {number}
	 */
	public static int healthToPoints(int health) {
		return JSGlobal.parseInt(health / 10, 10) + 1;
	}

	/**
	 * Gets the rest of unit health.
	 *
	 * @param health
	 * @returns {number}
	 */
	public static int healthToPointsRest(int health) {
		return health - healthToPoints(health);
	}

	@Override public Player getOwner() {
		return owner;
	}

	/**
	 * Returns true if the **unit** has a main weapon, else false.
	 *
	 * @return
	 */
	public boolean hasMainWeapon() {
		AttackType attack = type.attack;
		return (attack != null && attack.mainWeapon != null);
	}

	/**
	 * Returns true if the **unit** has a secondary weapon, else false.
	 *
	 * @return
	 */
	public boolean hasSecondaryWeapon() {
		AttackType attack = type.attack;
		return (attack != null && attack.secondaryWeapon != null);
	}

	/**
	 * Returns **true** if a given **unit** is an direct unit else **false**.
	 *
	 * @return
	 */
	public boolean isDirect() {
		return getFireType() == BattleType.DIRECT;
	}

	/**
	 * Returns **true** if a given **unit** is an indirect unit ( *e.g. artillery*
	 * ) else **false**.
	 *
	 * @return
	 */
	public boolean isIndirect() {
		return getFireType() == BattleType.INDIRECT;
	}

	/**
	 * Returns **true** if a given **unit** is an ballistic unit ( *e.g.
	 * anti-tank-gun* ) else **false**.
	 *
	 * @return
	 */
	public boolean isBallistic() {
		return getFireType() == BattleType.BALLISTIC;
	}

	/**
	 * Returns **true** if an **attacker** can use it's main weapon against a
	 * **defender**. The distance will not checked in case of an indirect
	 * attacker.
	 *
	 * @param defender
	 * @return
	 */
	public boolean canUseMainWeapon(Unit defender) {
		AttackType attack = type.attack;
		if (attack.mainWeapon != null && ammo > 0) {
			Integer value = attack.mainWeapon.$get(defender.type.ID);
			if (value != null && value > 0) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Returns the fire type of a given **unit**.
	 *
	 * The fire type will be determined by the following situations. All other
	 * situations (which aren't in the following table) aren't allowed due the
	 * game rules.
	 *
	 * Min-Range == 1 => Ballistic Min-Range > 1 => Indirect No Min-Range =>
	 * Direct Only Secondary => Direct
	 *
	 * @return
	 */
	public BattleType getFireType() {
		if (!hasMainWeapon() && !hasSecondaryWeapon()) {
			return BattleType.NONE;
		}

		int min = type.attack.minrange;
		if (min == 1) {
			return BattleType.DIRECT;

		} else {
			return (min > 1 ? BattleType.INDIRECT : BattleType.BALLISTIC);
		}
	}

	/**
	 * @return true if the unit with id tid is a transporter, else false.
	 */
	public boolean isTransportUnit() {
		return (type.maxloads > 0);
	}

	/**
	 * Has a transporter unit with id tid loaded units?
	 * 
	 * @return {boolean} true if yes, else false.
	 */
	public boolean hasLoads() {
		for (int i = 0, e = model.units.length; i < e; i++) {
			if (loadedIn == model.units[i]) {
				return true;
			}
		}

		return false;
	}
	
	/**
	 * Drains fuel of a **unit** if it has the ability of daily fuel usage.
	 *
	 * @param {Unit} unit
	 */
	public void drainFuel() {
	    int v = type.dailyFuelDrain;
	    if (v != Constants.INACTIVE_ID) {
	
	        // hidden units may drain more fuel
	        if (hidden && type.dailyFuelDrainHidden != Constants.INACTIVE_ID) {
	            v = this.type.dailyFuelDrainHidden;
	        }
	
	        this.fuel -= v;
	    }
	}

	/**
	 * Returns **true** when the given **unit** is the mechanical laser trigger,
	 * else **false**.
	 *
	 * @return
	 */
	public boolean isLaser() {
		return (type.ID == CustomWarsTactics.LASER_UNIT_INV);
	}

	/**
	 * Returns **true** if a given **unit** is a cannon trigger unit, else
	 * **false**.
	 *
	 * @return
	 */
	public boolean isCannonUnit() {
		return (type.ID == CustomWarsTactics.CANNON_UNIT_INV);
	}

	/**
	 * @return **true** if a given **unit** is a supplier, else **false**.
	 *
	 * @param {Unit} unit
	 */
	public boolean isSupplier() {
		return type.supply != JSGlobal.undefined;
	}

	/**
	 * Returns **true** if two units can join each other, else **false**. In
	 * general both **source** and **target** has to be units of the same type and
	 * the target must have 9 or less health points. Transporters cannot join each
	 * other when they contain loaded units.
	 *
	 * @param source
	 * @param target
	 * @returns {boolean}
	 */
	public boolean canJoin(Unit target) {
		if (type != target.type) {
			return false;
		}

		// don't increase HP to more then 10
		if (target.hp >= 90) {
			return false;
		}

		// do they have loads?
		if (hasLoads() || target.hasLoads()) {
			return false;
		}

		return true;
	}
}
