package com.jslix.state;

import com.jslix.system.KeyPress;
import com.jslix.tools.MouseHelper;
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
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.12.10
 */

//TODO: Finish commenting this class
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
    /**
     * The mouseHelper class helps you control scrolling and locking the
     * mouse actions
     */
    private MouseHelper scr_helper = new MouseHelper();

     //Controls whether mouse movements are registered within screens
    public boolean scr_mouseLock = false;
    //Controls how often a mouse is able to effect menu actions
    public boolean scr_scroll = false;
    //How quick a user is able to scroll, the higher the number the quicker
    public int scr_scrollInd = 2;

    //Simplified init function
    public abstract void init();

    //Simplified update function
    public abstract void update(int timePassed);

    //Simplified render function (SLICK)
    public abstract void render(Graphics g);

    //Simplified render function (JAVA)
    public abstract void render(Graphics2D g, Component dthis);  

    //This runs when a screen is about to be destroyed
    public void scr_close(){}

    public final void scr_init(){
        init();
        scr_new = false;
    }

    public final boolean scr_getNew(){
        return scr_new;
    }

    //Prevents mouse actions from being accepted
    public void scr_mouseLock(){
        scr_helper.setMouseLock(KeyPress.getMouseX(), KeyPress.getMouseY());
        scr_mouseLock = scr_helper.getMouseLock();
    }

    //Allows mouse actions to be accepted
    public void scr_mouseRelease(){
        scr_helper.setMouseRelease(KeyPress.getMouseX(), KeyPress.getMouseY());
        scr_mouseLock = scr_helper.getMouseLock();
    }

    //Controls how quickly the mouse scrolls
    public void scr_mouseControl(){
        scr_helper.setScrollIndex(scr_scrollInd);
        scr_helper.setMouseControl(scr_sysTime);
        if(!scr_scroll)
            scr_scroll = scr_helper.getScroll();
    }

    public void update(int width, int height, int time, int mouseScroll){}

    public void update(String name, int index, boolean isApplet,
            boolean seethru){}
}
