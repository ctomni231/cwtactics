package net.wolfTec;

import net.wolfTec.actions.ActionInvoker;
import net.wolfTec.ai.AiHandler;
import net.wolfTec.bridges.ObjectAdapter;
import net.wolfTec.dataTransfer.DataTransferHandler;
import net.wolfTec.database.*;
import net.wolfTec.input.InputHandler;
import net.wolfTec.input.backends.GamePad;
import net.wolfTec.input.backends.Keyboard;
import net.wolfTec.input.backends.Mouse;
import net.wolfTec.loading.LoadingHandler;
import net.wolfTec.model.Config;
import net.wolfTec.model.GameRound;
import net.wolfTec.network.MessageRouter;
import net.wolfTec.renderer.RenderingContext;
import net.wolfTec.renderer.SpriteDatabase;
import net.wolfTec.renderer.TileVariantCalculator;
import net.wolfTec.model.GameRoundSetup;
import net.wolfTec.states.StateData;
import net.wolfTec.states.Statemachine;
import net.wolfTec.utility.Audio;
import net.wolfTec.utility.Debug;
import net.wolfTec.utility.Features;
import net.wolfTec.utility.Localization;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.functions.Callback1;

/**
 * Central mediator (monolithic). Every service, data holder etc. can be accessed by this object. A direct access
 * between modules should be disallowed to prevent strict coupling.
 */
public abstract class CustomWarsTactics {

    /**
     *
     */
    public static final String LOG_HEADER = Constants.logHeader("cwtMediator");

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

    /**
     *
     */
    public static final org.stjs.javascript.Map<String, Config> configs;

    /**
     * Database for property types.
     */
    public static final Database<PropertyType> propertyTypeDb;

    /**
     * Database for weather types.
     */
    public static final Database<WeatherType> weatherTypeDb;

    /**
     * Database for army types.
     */
    public static final Database<ArmyType> armyTypeDb;

    /**
     * Database for unit types.
     */
    public static final Database<UnitType> unitTypeDb;

    /**
     * Database for move types.
     */
    public static final Database<MoveType> moveTypeDb;

    /**
     * Database for tile types.
     */
    public static final Database<TileType> tileTypeDb;

    /**
     * Database for commander types.
     */
    public static final Database<CoType> coTypeDb;

    /**
     * First map (the map on the primary screen)
     */
    public static final GameRound gameround;

    /**
     * Central action invoker
     */
    public static final ActionInvoker actionInvoker;

    /**
     *
     */
    public static final InputHandler inputHandler;

    /**
     *
     */
    public static final TileVariantCalculator variantCalculator;

    /**
     *
     */
    public static final MessageRouter netMessageRouter;

    /**
     *
     */
    public static final Statemachine gameWorkflow;

    /**
     *
     */
    public static final Localization i18n;

    /**
     *
     */
    public static final AiHandler ai;

    /**
     *
     */
    public static final LoadingHandler loadingHandler;

    /**
     * Audio backend.
     */
    public static final Audio audioHandler;

    /**
     * Simple object that holds the status of the supported features of the current active web browser.
     */
    public static final Features features;

    /**
     *
     */
    public static final SpriteDatabase spriteDb;

    /**
     *
     */
    public static final StateData gameWorkflowData;

    /**
     *
     */
    public static final GameRoundSetup gameRoundSetup;

    public static final RenderingContext renderCtx;
    
    public static final DataTransferHandler dataTransfer;

    // Construction of the mediator
    static {
        Debug.logInfo(LOG_HEADER, "Initialize...");

        Debug.logInfo(LOG_HEADER, "Setup database objects");
        unitTypeDb = generateDatabase(UnitType.class);
        propertyTypeDb = generateDatabase(PropertyType.class);
        weatherTypeDb = generateDatabase(WeatherType.class);
        armyTypeDb = generateDatabase(ArmyType.class);
        moveTypeDb = generateDatabase(MoveType.class);
        tileTypeDb = generateDatabase(TileType.class);
        coTypeDb = generateDatabase(CoType.class);
        registerDefaultObjects();

        Debug.logInfo(LOG_HEADER, "Setup game model");
        gameround = new GameRound();

        Debug.logInfo(LOG_HEADER, "Setup services");
        actionInvoker = new ActionInvoker(Constants.ACTION_POOL_SIZE);
        variantCalculator = new TileVariantCalculator();
        netMessageRouter = new MessageRouter();
        loadingHandler = new LoadingHandler();
        gameRoundSetup = new GameRoundSetup();
        gameWorkflowData = new StateData();
        renderCtx = new RenderingContext();
        gameWorkflow = new Statemachine();
        inputHandler = new InputHandler();
        spriteDb = new SpriteDatabase();
        audioHandler = new Audio();
        features = new Features();
        i18n = new Localization();
        ai = new AiHandler();
        dataTransfer = new DataTransferHandler();

        Debug.logInfo(LOG_HEADER, "Setup input backends");
        inputHandler.backends.$put("keyboards",
                Keyboard.createBackend(inputHandler, ((Element) ((Object) Global.window.document))));
        inputHandler.backends.$put("mouse",
                Mouse.createBackend(inputHandler, null));
        inputHandler.backends.$put("gamepad",
                GamePad.createBackend(inputHandler));

        Debug.logInfo(LOG_HEADER, "Setup configuration");
        configs = JSCollections.$map();
        initConfigParameters();

        Debug.logInfo(LOG_HEADER, "...done");
    }

    private static void registerDefaultObjects() {
        MoveType noMove = new MoveType();
        noMove.costs = JSCollections.$map("*", -1);
        noMove.ID = "NO_MOVE";
        moveTypeDb.registerSheetByObject(noMove);

        PropertyType invProperty = new PropertyType();
        invProperty.ID = PROP_INV;
        invProperty.defense = 0;
        invProperty.vision = 0;
        invProperty.visionBlocker = true;
        invProperty.capturePoints = 1;
        propertyTypeDb.registerSheetByObject(invProperty);

        UnitType cannonUnit = new UnitType();
        cannonUnit.ID = CANNON_UNIT_INV;
        cannonUnit.cost = -1;
        cannonUnit.range = 0;
        cannonUnit.movetype = "NO_MOVE";
        cannonUnit.fuel = 0;
        cannonUnit.vision = 1;
        cannonUnit.ammo = 0;
        unitTypeDb.registerSheetByObject(cannonUnit);

        UnitType laserUnit = new UnitType();
        laserUnit.ID = LASER_UNIT_INV;
        laserUnit.cost = -1;
        laserUnit.range = 0;
        laserUnit.movetype = "NO_MOVE";
        laserUnit.fuel = 0;
        laserUnit.vision = 1;
        laserUnit.ammo = 0;
        unitTypeDb.registerSheetByObject(laserUnit);
    }

    private static void initConfigParameters() {

        // game logic
        configs.$put("fogEnabled", new Config(0, 1, 1, 1));
        configs.$put("daysOfPeace", new Config(0, 50, 0, 1));
        configs.$put("weatherMinDays", new Config(1, 5, 1, 1));
        configs.$put("weatherRandomDays", new Config(0, 5, 4, 1));
        configs.$put("round_dayLimit", new Config(0, 999, 0, 1));
        configs.$put("noUnitsLeftLoose", new Config(0, 1, 0, 1));
        configs.$put("autoSupplyAtTurnStart", new Config(0, 1, 1, 1));
        configs.$put("unitLimit", new Config(0, Constants.MAX_UNITS, 0, 5));
        configs.$put("captureLimit", new Config(0, Constants.MAX_PROPERTIES, 0, 1));
        configs.$put("timer_turnTimeLimit", new Config(0, 60, 0, 1));
        configs.$put("timer_gameTimeLimit", new Config(0, 99999, 0, 5));
        configs.$put("co_getStarCost", new Config(100, 50000, 9000, 100));
        configs.$put("co_getStarCostIncrease", new Config(0, 50000, 1800, 100));
        configs.$put("co_getStarCostIncreaseSteps", new Config(0, 50, 10, 1));
        configs.$put("co_enabledCoPower", new Config(0, 1, 1, 1));

        // app config
        configs.$put("fastClickMode", new Config(0, 1, 0, 1));
        configs.$put("forceTouch", new Config(0, 1, 0, 1));
        configs.$put("animatedTiles", new Config(0, 1, 1, 1));

        gameConfigNames = ObjectAdapter.keys(configs);
    }

    /**
     * Creates a database object for a given object type class.
     *
     * @param clazz  Type sheet class
     * @param <T>    type that extends ObjectType
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

    private static Array<String> gameConfigNames;

    private static Callback1<String> resetConfigObject = new Callback1<String>() {
        @Override
        public void $invoke(String cfgId) {
            configs.$get(cfgId).resetValue();
        }
    };

    /**
     * Resets all registered configuration objects to their default value.
     */
    public static void resetConfiguration() {
        gameConfigNames.forEach(resetConfigObject);
    }

    public static void main(String[] args) {
        Debug.logInfo(LOG_HEADER, "Starting CustomWars: Tactics " + Constants.VERSION);
    }
}
