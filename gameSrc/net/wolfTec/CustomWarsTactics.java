package net.wolfTec;

import net.wolfTec.actions.ActionInvoker;
import net.wolfTec.database.*;
import net.wolfTec.model.Map;
import net.wolfTec.network.MessageRouter;
import net.wolfTec.renderer.TileVariantCalculator;
import net.wolfTec.utility.Debug;
import org.stjs.javascript.stjs.STJS;

/**
 * Central mediator class
 */
public class CustomWarsTactics {

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
    public static final Map map;

    /**
     * Central action invoker
     */
    public static final ActionInvoker actionInvoker;

    public static final TileVariantCalculator variantCalculator;

    public static final MessageRouter netMessageRouter;

    // Construction of the mediator
    static {
        final STJS helper = new STJS();

        unitTypeDb = generateDatabase(helper, UnitType.class);
        propertyTypeDb = generateDatabase(helper, PropertyType.class);
        weatherTypeDb = generateDatabase(helper, WeatherType.class);
        armyTypeDb = generateDatabase(helper, ArmyType.class);
        moveTypeDb = generateDatabase(helper, MoveType.class);
        tileTypeDb = generateDatabase(helper, TileType.class);
        coTypeDb = generateDatabase(helper, CoType.class);

        map = new Map(Constants.MAX_MAP_WIDTH, Constants.MAX_MAP_HEIGHT);

        actionInvoker = new ActionInvoker(Constants.ACTION_POOL_SIZE);
        variantCalculator = new TileVariantCalculator();
        netMessageRouter = new MessageRouter();
    }

    /**
     * Creates a database object for a given object type class.
     *
     * @param helper
     * @param clazz
     * @param <T>
     * @return
     */
    private static <T extends ObjectType> Database generateDatabase(final STJS helper, final Class<T> clazz) {
        Debug.logInfo("Generating database for " + clazz.getSimpleName());

        return new Database<T>() {
            @Override public T parseJSON(String data) {
                return helper.parseJSON(data, clazz);
            }
        };
    }

    public static void main (String[] args) {
        Debug.logInfo("Starting CustomWars: Tactics " + Constants.VERSION);
    }
}
