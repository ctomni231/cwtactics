package net.wolfTec;

import net.wolfTec.database.*;
import net.wolfTec.utility.Debug;
import org.stjs.javascript.stjs.STJS;

/**
 * Central mediator class
 */
public class CustomWarsTactics {

    public static final Database<PropertyType> propertyTypeDb;
    public static final Database<WeatherType> weatherTypeDb;
    public static final Database<ArmyType> armyTypeDb;
    public static final Database<UnitType> unitTypeDb;
    public static final Database<MoveType> moveTypeDb;
    public static final Database<TileType> tileTypeDb;
    public static final Database<CoType> coTypeDb;

    static {
        final STJS helper = new STJS();

        unitTypeDb = generateDatabase(helper, UnitType.class);
        propertyTypeDb = generateDatabase(helper, PropertyType.class);
        weatherTypeDb = generateDatabase(helper, WeatherType.class);
        armyTypeDb = generateDatabase(helper, ArmyType.class);
        moveTypeDb = generateDatabase(helper, MoveType.class);
        tileTypeDb = generateDatabase(helper, TileType.class);
        coTypeDb = generateDatabase(helper, CoType.class);
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
