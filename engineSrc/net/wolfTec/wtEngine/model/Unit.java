package net.wolfTec.wtEngine.model;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.annotation.Template;

@Namespace("cwt") public class Unit implements PlayerObject {

	private int				hp;
	private int				ammo;
	private int				fuel;
	private boolean		hidden;
	private boolean		canAct;

	private Unit			loadedIn;
	private UnitType	type;
	private Player		owner;

	/**
	 * @param type
	 */
	public void initByType(UnitType type) {
		this.setType(type);
		this.setHp(99);
		this.setAmmo(type.ammo);
		this.setFuel(type.fuel);
		this.setHidden(false);
		this.setLoadedIn(null);
		this.setCanAct(false);
	}

	@Template("toProperty") public int getHp() {
		return hp;
	}

	@Template("toProperty") public void setHp(int hp) {
		this.hp = hp;
	}

	@Template("toProperty") public int getAmmo() {
		return ammo;
	}

	@Template("toProperty") public void setAmmo(int ammo) {
		this.ammo = ammo;
	}

	@Template("toProperty") public int getFuel() {
		return fuel;
	}

	@Template("toProperty") public void setFuel(int fuel) {
		this.fuel = fuel;
	}

	@Template("toProperty") public boolean isHidden() {
		return hidden;
	}

	@Template("toProperty") public void setHidden(boolean hidden) {
		this.hidden = hidden;
	}

	@Template("toProperty") public boolean isCanAct() {
		return canAct;
	}

	@Template("toProperty") public void setCanAct(boolean canAct) {
		this.canAct = canAct;
	}

	@Template("toProperty") public Unit getLoadedIn() {
		return loadedIn;
	}

	@Template("toProperty") public void setLoadedIn(Unit loadedIn) {
		this.loadedIn = loadedIn;
	}

	@Template("toProperty") public UnitType getType() {
		return type;
	}

	@Template("toProperty") public void setType(UnitType type) {
		this.type = type;
	}

	@Template("toProperty") public void setOwner(Player owner) {
		this.owner = owner;
	}

	/**
	 * @return {boolean} true when hp is greater than 0 else false
	 */
	public boolean isAlive() {
		return this.getHp() > 0;
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
}
