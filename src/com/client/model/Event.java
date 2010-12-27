package com.client.model;

/**
 * Event object.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 26.12.2010
 */
public class Event
{
    private int duration;
    private Macro macro;

    public final void init( int duration , Macro macro )
    {
        assert macro != null;

        this.duration = duration;
        this.macro = macro;
    }

    private final void clear()
    {
        duration = 0;
        macro = null;
    }

    /**
     * @return the duration
     */
    public final int getDuration()
    {
        return duration;
    }

    public final boolean tickNextTurn()
    {
        if( duration > 0 )
            duration--;

        return duration == 0;
    }

    /**
     * @return the macro
     */
    public final Macro getMacro()
    {
        return macro;
    }

}
