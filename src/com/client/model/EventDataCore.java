package com.client.model;

/**
 * This class is used as event data store, every tag event can ask it's 
 * dependecies from this class, like NUM_OF_ACTIVE_PLAYERS >= 2.
 * <br><br>
 * Public modifications are only allowed to use this communication api for
 * user defined tag scripts.
 * <br><br>
 * Table of contents:
 * <br>
 * <table border="1">
 *  <tr>
 *   <th>Name</th>
 *   <th>Description</th>
 *   <th>Avaible Since</th>
 *   <th>Status</th>
 *  </tr>
 *  <tr>
 *   <th>NUM_OF_PLAYERS</th>
 *   <th>Contains the number of players of the game round</th>
 *   <th>1.0</th>
 *   <th>Useable</th>
 *  </tr>
 *  <tr>
 *   <th>NUM_OF_TEAMS</th>
 *   <th>Contains the number of teams of the game round</th>
 *   <th>1.0</th>
 *   <th>Useable</th>
 *  </tr>
 *  <tr>
 *   <th>NUM_OF_ACTIVE_PLAYERS</th>
 *   <th>Contains the number of players that are alive</th>
 *   <th>1.0</th>
 *   <th>Useable</th>
 *  </tr>
 *  <tr>
 *   <th>NUM_OF_ACTIVE_TEAMS</th>
 *   <th>Contains the number of teams that are alive</th>
 *   <th>1.0</th>
 *   <th>Useable</th>
 *  </tr>
 *  <tr>
 *   <th>FIGHT_ATTACK_DAMAGE</th>
 *   <th>Contains the amount of damage, the attacker will inflict</th>
 *   <th>1.0</th>
 *   <th>Useable</th>
 *  </tr>
 *  <tr>
 *   <th>FIGHT_COUNTER_ATTACK_DAMAGE</th>
 *   <th>Contains the amount of damage, with that the defender will attack</th>
 *   <th>1.0</th>
 *   <th>Useable</th>
 *  </tr>
 *  <tr>
 *   <th>FIGHT_ATTACKER_ID</th>
 *   <th>The identical number of the attacking unit</th>
 *   <th>1.0</th>
 *   <th>Useable</th>
 *  </tr>
 * </table>
 * <br><br>
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version Specification v1.0 - 12.12.2010
 */
public final class EventDataCore
{

    // singleton instance
    private static final EventDataCore INSTANCE = new EventDataCore();

    
    /*
     * Defined hardcoded identical numbers.
     *
     * Tests shows that the java vm is faster with enumerations e.ordinal()
     * method for access than with static final int fields in
     * the class itself.
     *
     * STATIC FINAL INT => 13ms
     * ENUM => 27ms                     <= warm up time !
     * STATIC FINAL INT => 2ms
     * ENUM => 0ms
     * STATIC FINAL INT => 2ms
     * ENUM => 1ms
     * STATIC FINAL INT => 1ms
     * ENUM => 1ms
     */
    public enum EventData_ID
    {
        NUM_OF_PLAYER,
        NUM_OF_TEAMS,
        NUM_OF_ACTIVE_PLAYERS,
        NUM_OF_ACTIVE_TEAMS,
        FIGHT_ATTACK_DAMAGE,
        FIGHT_COUNTER_ATTACK_DAMAGE,
        FIGHT_ATTACKER_ID
    }

    private int[] data;

    private EventDataCore()
    {
        data = new int[ EventData_ID.values().length ];
    }

    /**
     * Returns the value from a given data id.
     *
     * @param id data id
     * @return value that is saved in the data id position.
     */
    public final int getValueFrom( EventData_ID id )
    {
        assert id != null;

        return data[id.ordinal()];
    }

    /**
     * Sets the value for a given data id.
     *
     * @param id data id
     * @param value value that will be saved in the data id position
     */
    public final void setValueIn( EventData_ID id , int value )
    {
        assert id != null;

        data[id.ordinal()] = value;
    }

    /**
     * Retuns the singleton instance of the singleton class.
     */
    public static EventDataCore getInstance()
    {
        return EventDataCore.INSTANCE;
    }
}
