package com.cwt.system.jslix;

import com.cwt.system.jslix.debug.NotifySystem;
import java.awt.Component;
import java.awt.Graphics2D;
import org.newdawn.slick.Graphics;

/**
 * NotifyLibrary.java
 *
 * This class allows the Notification system to be accessed from anywhere
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.20.11
 */
public class NotifyLibrary {

    public static final byte INFO = 0;
    public static final byte FINE = 1;
    public static final byte WARN = 2;
    public static final byte CRITICAL = 3;

    private static NotifySystem noteSys = new NotifySystem();

    public static void addMessage(byte type, String message, int delay){
        noteSys.addMessage(type, message, delay);
    }

    public static void setOffset(int x, int y){
        noteSys.setOffset(x, y);
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
