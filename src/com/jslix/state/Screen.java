package com.jslix.state;

import java.awt.Graphics2D;
import java.awt.Component;
import org.newdawn.slick.Graphics;

/**
 * Screen.java v1.0
 * Coded by: Crecen Carr (JakeSamiRulz)
 * Design by: Clinton Nolan (Urusan)
 * Created/Modified: November 23, 2008<p>
 *
 * Screen.java<p>
 *
 * The Screen class can be known also as a state class. Unlike states,
 * these Screens can be added/deleted from the game at any time. This
 * regulates Screens for both Slick and Java Frames.
 *
 * @author Crecen
 */
public abstract class Screen implements ScreenSkeleton{
    /**
     * If true, schedules the deletion of this screen
     */
    public boolean scr_delete = false;
    /**
     * Holds the width of the screen
     */
    public int scr_width = 0;
    /**
     * Holds the height of the screen
     */
    public int scr_height = 0;
    /**
     * Holds the clicks of the mousewheel
     */
    public int scr_mouseScroll = 0;
    /**
     * Holds whether this screen was just created
     */
    private boolean scr_new = true;
    /**
     * Holds where the screen is currently in the list.
     */
    public int scr_index = -1;
    /**
     * Holds a name for the screen for easy searching (optional)
     */
    public String scr_name = "";
    /**
     * Holds whether this Screen will display underneath the current screen
     */
    public boolean scr_link = false;
    /**
     * Counts the current time in milliseconds (0-1000)
     */
    public int scr_sysTime = 0;
    /**
     * Tells you whether the screen is an applet
     */
    public boolean scr_isApplet = true;

    //Simplified init function
    public abstract void init();

    //Simplified render function (SLICK)
    public abstract void render(Graphics g);

    //Simplified render function (JAVA)
    public abstract void render(Graphics2D g, Component dthis);

    //Simplified update function
    public abstract void update(int timePassed);

    public final void scr_init(){
        init();
        scr_new = false;
    }

    public final boolean scr_getNew(){
        return scr_new;
    }
}
