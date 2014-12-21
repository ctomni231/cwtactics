package net.wolfTec;

import net.wolfTec.action.ActionInvoker;
import net.wolfTec.ai.AiHandler;
import net.wolfTec.dataTransfer.ConfigTransfer;
import net.wolfTec.dataTransfer.ImageTransfer;
import net.wolfTec.dataTransfer.MapTransfer;
import net.wolfTec.dataTransfer.ModTransfer;
import net.wolfTec.dataTransfer.URLParameterTransfer;
import net.wolfTec.input.InputHandler;
import net.wolfTec.loading.LoadingHandler;
import net.wolfTec.model.GameRound;
import net.wolfTec.model.GameRoundSetup;
import net.wolfTec.network.MessageRouter;
import net.wolfTec.renderer.RenderingContext;
import net.wolfTec.renderer.SpriteDatabase;
import net.wolfTec.renderer.TileVariantCalculator;
import net.wolfTec.states.StateData;
import net.wolfTec.states.Statemachine;
import net.wolfTec.types.ArmyType;
import net.wolfTec.types.CoType;
import net.wolfTec.types.Database;
import net.wolfTec.types.MoveType;
import net.wolfTec.types.ObjectType;
import net.wolfTec.types.PropertyType;
import net.wolfTec.types.TileType;
import net.wolfTec.types.UnitType;
import net.wolfTec.types.WeatherType;
import net.wolfTec.utility.Audio;
import net.wolfTec.utility.Debug;
import net.wolfTec.utility.Features;
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
	public static final String LOG_HEADER = Constants.LOG_MEDIATOR;

	/**
     *
     */
	public static final String CANNON_UNIT_INV = "CANNON_UNIT_INV";

	/**
     *
     */
	public static final String LASER_UNIT_INV = "LASER_UNIT_INV";

	/**
     *
     */
	public static final String PROP_INV = "PROP_INV";

	@SuppressWarnings("unchecked")
  private static void registerDefaultObjects() {
		MoveType noMove = new MoveType();
		noMove.costs = JSCollections.$map("*", -1);
		noMove.ID = "NO_MOVE";
		((Database<MoveType>) getBean("moveTypeDb")).registerSheetByObject(noMove);

		PropertyType invProperty = new PropertyType();
		invProperty.ID = PROP_INV;
		invProperty.defense = 0;
		invProperty.vision = 0;
		invProperty.visionBlocker = true;
		invProperty.capturePoints = 1;
		((Database<PropertyType>) getBean("propertyTypeDb")).registerSheetByObject(invProperty);

		UnitType cannonUnit = new UnitType();
		cannonUnit.ID = CANNON_UNIT_INV;
		cannonUnit.cost = -1;
		cannonUnit.range = 0;
		cannonUnit.movetype = "NO_MOVE";
		cannonUnit.fuel = 0;
		cannonUnit.vision = 1;
		cannonUnit.ammo = 0;
		((Database<UnitType>) getBean("unitTypeDb")).registerSheetByObject(cannonUnit);

		UnitType laserUnit = new UnitType();
		laserUnit.ID = LASER_UNIT_INV;
		laserUnit.cost = -1;
		laserUnit.range = 0;
		laserUnit.movetype = "NO_MOVE";
		laserUnit.fuel = 0;
		laserUnit.vision = 1;
		laserUnit.ammo = 0;
		((Database<UnitType>) getBean("unitTypeDb")).registerSheetByObject(laserUnit);
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
	private static <T extends ObjectType> Database<T> generateDatabase(final Class<T> clazz) {
		Debug.logInfo(LOG_HEADER, "Generating database for " + clazz.getSimpleName());
		return new Database<T>() {
			@Override public T parseJSON(String data) {
				return JSGlobal.stjs.parseJSON(data, clazz);
			}
		};
	}

	private static Map<String, Object> beans;

	private static void initBeans() {
		Debug.logInfo(LOG_HEADER, "Initialize bean objects");
		beans = JSCollections.$map();

		// create application beans
		beans.$put("unitTypeDb", generateDatabase(UnitType.class));
		beans.$put("propertyTypeDb", generateDatabase(PropertyType.class));
		beans.$put("weatherTypeDb", generateDatabase(WeatherType.class));
		beans.$put("armyTypeDb", generateDatabase(ArmyType.class));
		beans.$put("moveTypeDb", generateDatabase(MoveType.class));
		beans.$put("tileTypeDb", generateDatabase(TileType.class));
		beans.$put("coTypeDb", generateDatabase(CoType.class));
		
		beans.$put("gameround", new GameRound());
		beans.$put("gameRoundSetup", new GameRoundSetup());
		
		beans.$put("actionInvoker", new ActionInvoker(Constants.ACTION_POOL_SIZE));
		beans.$put("variantCalculator", new TileVariantCalculator());
		beans.$put("netMessageRouter", new MessageRouter());
		beans.$put("loadingHandler", new LoadingHandler());
		beans.$put("gameWorkflowData", new StateData());
		beans.$put("renderCtx", new RenderingContext());
		beans.$put("gameWorkflow", new Statemachine());
		beans.$put("inputHandler", new InputHandler());
		beans.$put("spriteDb", new SpriteDatabase());
		beans.$put("audioHandler", new Audio());
		beans.$put("features", new Features());
		beans.$put("i18n", new Localization());
		beans.$put("ai", new AiHandler());
		
		beans.$put("imageDto", new ImageTransfer());
		beans.$put("mapDto", new MapTransfer());
		beans.$put("modDto", new ModTransfer());
		beans.$put("configDto", new ConfigTransfer());
		beans.$put("urlParameterDto", new URLParameterTransfer());
	}

	/**
	 * <strong>Note: </strong> This function is low level and contains real JS
	 * code.
	 */
	private static void solveBeanDependencies() {
		Debug.logInfo(LOG_HEADER, "Inject dependencies into beans");

		Array<String> beanNames = JSObjectAdapter.$js("Object.keys(this.beans)");
		for (String name : beanNames) {

			@SuppressWarnings("unused")
      Object bean = beans.$get(name);
			Array<String> beanProperties = JSObjectAdapter.$js("Object.keys(bean)");
			for (String property : beanProperties) {
				if (property.indexOf("$") == 0) {
					JSObjectAdapter.$js("bean[property] = this.beans[property.slice(1)]");
				}
			}
		}
	}

	/**
	 * @param name
	 *          name of the bean
	 * @throws Exception
	 *           when the bean with the given name does not exists
	 * @return a bean for a given name
	 */
	@SuppressWarnings("unchecked")
  public static <T> T getBean(String name) {
		if (!JSObjectAdapter.hasOwnProperty(beans, name)) {
			Debug.logCritical(LOG_HEADER, "unknown bean with name " + name);
		}

		return (T) beans.$get(name);
	}

	public static void main(String[] args) {
		Debug.logInfo(LOG_HEADER, "Starting CustomWars: Tactics " + Constants.VERSION);
		
		initBeans();
		solveBeanDependencies();
		registerDefaultObjects();
	}

}
