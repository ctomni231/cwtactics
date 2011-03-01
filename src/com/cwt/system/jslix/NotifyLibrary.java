package com.cwt.system.jslix;

import com.cwt.system.jslix.debug.MessageSystem;
import java.awt.Component;
import java.awt.Graphics2D;
import java.util.logging.Level;
import org.newdawn.slick.Graphics;

/**
 * NotifyLibrary.java
 *
 * This class allows the Notification system to be accessed from anywhere
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.28.11
 */
public class NotifyLibrary {

    public static final int DELAY = 10;//The Default Notification delay
    //The Messaging System to be used with this Notify Library
    private static MessageSystem noteSys = new MessageSystem();

    /**
     * This adds a default introduction message to the JSlix Log
     */
    protected static void addMessage(){
        addMessage(Level.CONFIG, "--JSLIX LOG--", DELAY);
    }

    /**
     * This adds a custom informational message to the JSlix Log with
     * a small delay
     * @param message The log message to add
     */
    public static void addMessage(String message){
        addMessage(Level.INFO, message, DELAY);
    }

    /**
     * This adds a custom informational message to the JSlix log with
     * a delay you specify
     * @param message The log message to add
     * @param delay The length of time the log stays visible
     */
    public static void addMessage(String message, int delay){
        addMessage(Level.INFO, message, delay);
    }

    /**
     * This adds a custom message to the JSlix log
     * @param level The severity and color of the message (0 - 1000)
     * @param message The log message to add
     * @param delay The length of time the log stays visible
     */
    public static void addMessage(Level level, String message, int delay){
        noteSys.addMessage(level, message, delay);
    }

    /**
     * This sets how far the messages will be away from the edge of the screen
     * @param x The x-axis distance away from edge
     * @param y The y-axis distance away from edge
     */
    public static void setOffset(int x, int y){
        noteSys.setOffset(x, y);
    }

    /**
     * This sets the flow direction of the log messages
     * @param upward Whether to flow upward(T) or downward(F)
     */
    public static void setFlow(boolean upward){
        noteSys.setFlow(upward);
    }

    /**
     * This sets the justification and positioning of the log messages
     * @param right Whether to display on the right(T) or left(F)
     */
    public static void setJustify(boolean right){
        noteSys.setJustify(right);
    }

    /**
     * This function sets the maximum amount of messages (0 = unlimited)
     * @param newMax The maximum amount of messages to be displayed
     */
    public static void setMax(int newMax){
        noteSys.setMax(newMax);
    }

    /**
     * This function updates all the elements of the Message Library
     * @param width The current width of the screen
     * @param height The current height of the screen
     * @param sysTime The current time in milliseconds
     */
    protected static void update(int width, int height, int sysTime){
        noteSys.update(width, height, sysTime, 0);
    }

    /**
     * This function renders the Slick2D screen
     * @param g The Slick2D graphics object
     */
    protected static void render(Graphics g){
        noteSys.render(g);
    }

    /**
     * This function renders the Java2D screen
     * @param g The Java2D graphics object
     * @param dthis The Java2D Component
     */
    protected static void render(Graphics2D g, Component dthis){
        noteSys.render(g, dthis);
    }
}
