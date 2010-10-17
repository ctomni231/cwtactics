package com.jslix.state;

import com.jslix.system.KeyPress;
import com.jslix.system.SlixLibrary;
import java.awt.Component;
import java.awt.Graphics2D;
import org.newdawn.slick.Color;
import org.newdawn.slick.Graphics;

/**
 * UserSys
 *
 * A library to show users how to create your own libraries using JSlix.
 * An extended SlixGame is REQUIRED for Java and Slick frames and applets.
 * You should copy these classes exactly replacing the current names for
 * your own for instant functionality.
 *
 * JTestScreen
 *
 * This is a testing Screen for the class. Feel free to write anything
 * within the functions and change values and variables.
 *
 * Check slicktext.txt for information about the KeyPresses.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 09.24.10
 */

public class JTestScreen extends Screen{

    public int counter;//A counter for keeping track of the timePassed

    /**
     * Initialize all variables here to prevent Slick from crashing. Uses
     * Slick initialize function. Uses Java2D initialize function as well.
     */
    @Override
    public void init() {
        counter = 0;
    }

    /**
     * This is Slick2D exclusive render function used only by the Slick
     * window. Use this to show Slick related actions and functions.
     * @param g The Slick graphics object
     */
    @Override
    public void render(Graphics g) {
        g.setColor(Color.blue);
        g.drawString("COUNTER="+counter, 100, scr_index*10+100);
    }

    /**
     * This is Java2D exclusive render function used only by the Java
     * window. Use this to show Java related actions and functions.
     * @param g The Java2D graphics object
     * @param dthis Java2D Component object
     */
    @Override
    public void render(Graphics2D g, Component dthis) {
        g.setColor(java.awt.Color.blue);
        g.drawString("COUNTER="+counter, 100, scr_index*10+100);
    }

    /**
     * The update function is shared by both Java and Slick functions.
     * @param timePassed negative values (Java2D) & positive values (Slick2D)
     */
    @Override
    public void update(int timePassed) {
        if(scr_index == 0)
            counter++;

        //For Java Screen, timePassed is always < 0
        if(timePassed < 0){
             //Adds a Screen for a left Mouse Click
            if(KeyPress.isMouseClicked(1)){
                SlixLibrary.addFrameScreen(new JTestScreen());
            }

            //Deletes a Screen for a right Mouse Click
            if(KeyPress.isMouseClicked(3)){
                SlixLibrary.removeFrameScreen(0);
            }

            //Moves a screen for a scroll wheel click
            if(KeyPress.isMouseClicked(2)){
                SlixLibrary.bringScreenToFront(1);
            }
        }
        //For Slick screens timePassed >= 0
        else{
            //Adds a Screen for a left Mouse Click
            if(KeyPress.isMouseClicked(0)){
                SlixLibrary.addFrameScreen(new JTestScreen());
            }

            //Deletes a Screen for a right Mouse Click
            if(KeyPress.isMouseClicked(1)){
                SlixLibrary.removeFrameScreen(0);
            }

            //Moves a screen for a scroll wheel click
            if(KeyPress.isMouseClicked(2)){
                SlixLibrary.bringScreenToFront(1);
            }
        }
    }
}
