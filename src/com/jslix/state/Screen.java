package com.jslix.state;

import com.jslix.system.KeyPress;
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

    //Mouse helper functions
    //Mouse does not register commands if within the x vicinity of this
    public int scr_lockx = -1000;
    //Mouse does not register commands if within the y vicinity of this
    public int scr_locky = -1000;
    //Controls whether mouse movements are registered within screens
    public boolean scr_mouseLock = false;
    //Controls how often a mouse is able to effect menu actions
    public boolean scr_scroll = false;
    //This sets the control of scrolling to system time
    public boolean scr_scrollWatch = false;
    //How quick a user is able to scroll, the higher the number the quicker
    public int scr_scrollInd = 2;

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

    //Prevents mouse actions from being accepted
    public void scr_mouseLock(){
        scr_lockx = KeyPress.getMouseX();
        scr_locky = KeyPress.getMouseY();
        scr_mouseLock = true;
    }

    //Allows mouse actions to be accepted
    public void scr_mouseRelease(){
        if(KeyPress.getMouseX() > scr_lockx+5 ||
            KeyPress.getMouseX() < scr_lockx-5 ||
            KeyPress.getMouseY() > scr_locky+5 ||
            KeyPress.getMouseY() < scr_locky-5)
            scr_mouseLock = false;
    }

    //Helps handle controlled scrolling within the screen
    public void scr_mouseControl(){
        if(!scr_scroll){
            for(int i = 0; i < scr_scrollInd; i++){
                if(scr_sysTime > (1000/scr_scrollInd)*i &&
                        scr_sysTime < (1000/scr_scrollInd)*(i+1)){
                    if(scr_scrollWatch && scr_sysTime >
                            ((1000/scr_scrollInd)*(i+1))-
                            (1000/(2*scr_scrollInd))){
                        scr_scroll = true;
                        scr_scrollWatch = false;
                    }else if(!scr_scrollWatch && scr_sysTime <=
                            ((1000/scr_scrollInd)*(i+1))-
                            (1000/(2*scr_scrollInd))){
                        scr_scroll = true;
                        scr_scrollWatch = true;
                    }
                }
            }
        }
    }
}
