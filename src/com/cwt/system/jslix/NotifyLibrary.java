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
 * @version 02.27.11
 */
public class NotifyLibrary {

    public static final int DELAY = 10;//The Default Notification delay
    private static MessageSystem noteSys = new MessageSystem();

    protected static void addMessage(){
        noteSys.addMessage(Level.INFO, "--JSLIX LOG--", DELAY);
    }

    public static void addMessage(String message){
        noteSys.addMessage(Level.INFO, message, DELAY);
    }
    
    public static void addMessage(String message, int delay){
        noteSys.addMessage(Level.INFO, message, delay);
    }

    public static void setOffset(int x, int y){
        noteSys.setOffset(x, y);
    }

    public static void setFlow(boolean upward){
        noteSys.setFlow(upward);
    }

    public static void setJustify(boolean right){
        noteSys.setJustify(right);
    }

    protected static void update(int width, int height, int sysTime){
        noteSys.update(width, height, sysTime, 0);
    }

    protected static void render(Graphics g){
        noteSys.render(g);
    }

    protected static void render(Graphics2D g, Component dthis){
        noteSys.render(g, dthis);
    }
}
