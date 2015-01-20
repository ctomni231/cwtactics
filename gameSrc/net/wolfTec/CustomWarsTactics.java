package net.wolfTec;

import net.wolfTec.ai.AiHandler;
import net.wolfTec.audio.WedAudioBackend;
import net.wolfTec.dataTransfer.ConfigTransfer;
import net.wolfTec.dataTransfer.ImageTransfer;
import net.wolfTec.dataTransfer.MapTransfer;
import net.wolfTec.dataTransfer.ModTransfer;
import net.wolfTec.dataTransfer.URLParameterTransfer;
import net.wolfTec.input.InputHandler;
import net.wolfTec.loading.LoadingHandler;
import net.wolfTec.logic.GameRoundSetup;
import net.wolfTec.model.ArmyType;
import net.wolfTec.model.CoType;
import net.wolfTec.model.GameRound;
import net.wolfTec.model.MoveType;
import net.wolfTec.model.ObjectType;
import net.wolfTec.model.ObjectTypeDatabase;
import net.wolfTec.model.PropertyType;
import net.wolfTec.model.TileType;
import net.wolfTec.model.UnitType;
import net.wolfTec.model.WeatherType;
import net.wolfTec.renderer.RenderingContext;
import net.wolfTec.renderer.SpriteDatabase;
import net.wolfTec.renderer.TileVariantCalculator;
import net.wolfTec.states.StateData;
import net.wolfTec.states.Statemachine;
import net.wolfTec.system.ActionInvoker;
import net.wolfTec.system.Features;
import net.wolfTec.system.MessageRouter;
import net.wolfTec.utility.Debug;
import net.wolfTec.utility.Localization;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;

/**
 * Central mediator (monolithic). Every service, data holder etc. can be
 * accessed by this object. A direct access between modules should be disallowed
 * to prevent strict coupling.
 */
public abstract class CustomWarsTactics {

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
		((ObjectTypeDatabase<MoveType>) getBean("moveTypeDb")).registerSheetByObject(noMove);

		PropertyType invProperty = new PropertyType();
		invProperty.ID = PROP_INV;
		invProperty.defense = 0;
		invProperty.vision = 0;
		invProperty.visionBlocker = true;
		invProperty.capturePoints = 1;
		((ObjectTypeDatabase<PropertyType>) getBean("propertyTypeDb")).registerSheetByObject(invProperty);

		UnitType cannonUnit = new UnitType();
		cannonUnit.ID = CANNON_UNIT_INV;
		cannonUnit.cost = -1;
		cannonUnit.range = 0;
		cannonUnit.movetype = "NO_MOVE";
		cannonUnit.fuel = 0;
		cannonUnit.vision = 1;
		cannonUnit.ammo = 0;
		((ObjectTypeDatabase<UnitType>) getBean("unitTypeDb")).registerSheetByObject(cannonUnit);

		UnitType laserUnit = new UnitType();
		laserUnit.ID = LASER_UNIT_INV;
		laserUnit.cost = -1;
		laserUnit.range = 0;
		laserUnit.movetype = "NO_MOVE";
		laserUnit.fuel = 0;
		laserUnit.vision = 1;
		laserUnit.ammo = 0;
		((ObjectTypeDatabase<UnitType>) getBean("unitTypeDb")).registerSheetByObject(laserUnit);
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
	private static <T extends ObjectType> ObjectTypeDatabase<T> generateDatabase(final Class<T> clazz) {
		return new ObjectTypeDatabase<T>() {
			@Override public T parseJSON(String data) {
				return JSGlobal.stjs.parseJSON(data, clazz);
			}
		};
	}

	private static Map<String, Object>	beans;

	/**
	 * <strong>Note: </strong> This function is low level and contains real JS
	 * code. Modify only if you know what you're doing here.
	 */
	private static void initBeans() {
		beans = JSCollections.$map();

		// search in all classes and convert every class with a $BEAN property into
		// a bean by calling it's constructor with zero arguments.
		Array<String> possibleBeanNames = JSObjectAdapter.$js("Object.keys(this.beans)");
		for (String name : possibleBeanNames) {
			boolean isBean = JSObjectAdapter.$js("cwt[name].$BEAN == true");
			if (isBean) {
				JSObjectAdapter.$js("this.beans[name] = new cwt[name]()");
			}
		}
	}

	/**
	 * <strong>Note: </strong> This function is low level and contains real JS
	 * code. Modify only if you know what you're doing here.
	 */
	private static void solveBeanDependencies() {
		boolean isDebugEnabled = Constants.DEBUG;

		// search in all beans for properties with a leading '$' character. This
		// properties are references to beans. Place the right bean into this
		// property by searching the correct bean type together with the type
		// description of the class.
		Array<String> beanNames = JSObjectAdapter.$js("Object.keys(this.beans)");
		for (String beanName : beanNames) {

			@SuppressWarnings("unused") Object bean = beans.$get(beanName);
			Array<String> beanProperties = JSObjectAdapter.$js("Object.keys(bean)");
			for (String property : beanProperties) {
				if (property.indexOf("$") == 0) {
					if (property != "$BEAN") {
						if (property == "$LOG") {

							// create a custom logger object for the bean object
							JSObjectAdapter.$js("bean.$LOG = LogJS.get({name: \"beanName\", level: \"info\", enabled: isDebugEnabled})");

						} else {

							// grab the class name plus namespace and extract only the class
							// name
							String propertyClass = JSObjectAdapter.$js("bean.constructor.$typeDescription[property]");
							propertyClass = propertyClass.substring(propertyClass.lastIndexOf(".") + 1);

							// inject it
							JSObjectAdapter.$js("bean[property] = this.beans[propertyClass]");
						}
					}
				}
			}
		}
	}

	public static void main(String[] args) {
		initBeans();
		solveBeanDependencies();
		registerDefaultObjects();
	}

}
