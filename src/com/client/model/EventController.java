package com.client.model;

/**
 * .....
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 14.12.2010
 */
public final class EventController
{

    // singleton instance
    private static final EventController INSTANCE = new EventController();

    private EventController(){}

    public void invokeEvent( String id )
    {

    }

    /**
     * Retuns the singleton instance of the singleton class.
     */
    public static EventController getInstance()
    {
        return EventController.INSTANCE;
    }

 }
