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
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 09.24.10
 */

public interface ScreenSkeleton {

    /**
     * Simplified initialization function for initializing variables
     */
    public void init();

    /**
     * Simplified update function for updating both the Slick2D and Java2D
     * windows
     * @param timePassed negative values (Java2D) & positive values (Slick2D)
     */
    public void update(int timePassed);

    /**
     * Simplified render function for drawing Slick based graphics
     * @param g The Slick2D graphics object
     */
    public void render(Graphics g);

    /**
     * Simplified render function for drawing Java2D based Graphics
     * @param g The Java2D graphics object
     * @param dthis The Java2D Component object
     */
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
