package net.wolfTec.wtEngine;

import net.wolfTec.wtEngine.model.MoveType;
import net.wolfTec.wtEngine.model.ObjectType;
import net.wolfTec.wtEngine.model.PropertyType;
import net.wolfTec.wtEngine.model.TypeDatabase;
import net.wolfTec.wtEngine.model.UnitType;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.wolfTec.utility.BeanFactory;

/**
 * Central mediator (monolithic). Every service, data holder etc. can be
 * accessed by this object. A direct access between modules should be disallowed
 * to prevent strict coupling.
 */
public abstract class Game {

  public String getVersion () {
    return Constants.VERSION;
  }
  
	/**
     *
     */
	public static final String	CANNON_UNIT_INV	= "CANNON_UNIT_INV";

	/**
     *
     */
	public static final String	LASER_UNIT_INV	= "LASER_UNIT_INV";

	/**
     *
     */
	public static final String	PROP_INV				= "PROP_INV";

	@SuppressWarnings("unchecked") private static void registerDefaultObjects() {
		MoveType noMove = new MoveType();
		noMove.costs = JSCollections.$map("*", -1);
		noMove.ID = "NO_MOVE";
		((TypeDatabase<MoveType>) getBean("moveTypeDb")).registerSheetByObject(noMove);

		PropertyType invProperty = new PropertyType();
		invProperty.ID = PROP_INV;
		invProperty.defense = 0;
		invProperty.vision = 0;
		invProperty.visionBlocker = true;
		invProperty.capturePoints = 1;
		((TypeDatabase<PropertyType>) getBean("propertyTypeDb")).registerSheetByObject(invProperty);

		UnitType cannonUnit = new UnitType();
		cannonUnit.ID = CANNON_UNIT_INV;
		cannonUnit.cost = -1;
		cannonUnit.range = 0;
		cannonUnit.movetype = "NO_MOVE";
		cannonUnit.fuel = 0;
		cannonUnit.vision = 1;
		cannonUnit.ammo = 0;
		((TypeDatabase<UnitType>) getBean("unitTypeDb")).registerSheetByObject(cannonUnit);

		UnitType laserUnit = new UnitType();
		laserUnit.ID = LASER_UNIT_INV;
		laserUnit.cost = -1;
		laserUnit.range = 0;
		laserUnit.movetype = "NO_MOVE";
		laserUnit.fuel = 0;
		laserUnit.vision = 1;
		laserUnit.ammo = 0;
		((TypeDatabase<UnitType>) getBean("unitTypeDb")).registerSheetByObject(laserUnit);
	}

	/**
	 * Creates a database object for a given object type class.
	 *
	 * @param clazz
	 *          Type sheet class
	 * @param <T>
	 *          type that extends ObjectType
	 * @return Database object
	 */
	private static <T extends ObjectType> TypeDatabase<T> generateDatabase(final Class<T> clazz) {
		return new TypeDatabase<T>() {
			@Override public T parseJSON(String data) {
				return JSGlobal.stjs.parseJSON(data, clazz);
			}
		};
	}

	public static BeanFactory engine;
	
	public static void main(String[] args) {
	  
	  // create engine
	  engine = new BeanFactory();
	  
	  // start
	}

}
