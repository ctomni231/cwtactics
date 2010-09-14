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

    
}
