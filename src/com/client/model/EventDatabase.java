package com.client.model;

import java.util.EnumMap;

/**
 * This class is a script database, that holds all parsed tag scripts.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 12.12.2010
 */
public class EventDatabase {

    // singleton instance
    private static final EventDatabase INSTANCE = new EventDatabase();

    public enum Events
    {
        PLAYER_BUY,
        UNIT_ATTACKS,
        UNIT_CAPTURES,
        PLAYER_END_TURN,
        PLAYER_START_TURN
    }
    
    private EnumMap<Events,Macro> macros;

    private EventDatabase()
    {
        macros = new EnumMap<Events,Macro>( Events.class );
    }



    /**
     * Retuns the singleton instance of the singleton class.
     */
    public static EventDatabase getInstance() {
        return EventDatabase.INSTANCE;
    }

 }
