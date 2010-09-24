package com.jslix.state;

import java.awt.Component;
import java.awt.Graphics2D;
import org.newdawn.slick.Graphics;

/**
 * ScreenSkeleton.java
 * 
 * This gives the basic functions for easy Screen integration. A necessity
 * for the graphics classes to share functionality
 *
 * @author Crecen
 */
public interface ScreenSkeleton {

    //Simplified init function
    public void init();

    //Simplified update function
    public void update(int timePassed);

    //Simplified render function (SLICK)
    public void render(Graphics g);

    //Simplified render function (JAVA)
    public void render(Graphics2D g, Component dthis);

    /**
     * This update function is for getting the items that you need
     * updated each iteration.
     * @param width The current width of the screen
     * @param height The current height of the screen
     * @param sysTime The current time in milliseconds (1-1000)
     * @param mouseScroll The mouseScroll value of the mouse
     */
    public void update(int width, int height, int sysTime, int mouseScroll);

    /**
     * This update is for getting system and screen information, these
     * usually don't change much while playing the game.
     * @param name The current name of the screen
     * @param index The current index of the screen 0 = top
     * @param isApplet Whether this screen is an applet(true) or not(false)
     * @param seethru Whether this screen is translucent(true) or not(false)
     */
    public void update(String name, int index,
            boolean isApplet, boolean seethru);


    
}
