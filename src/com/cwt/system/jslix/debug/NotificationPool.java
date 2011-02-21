package com.cwt.system.jslix.debug;

import com.cwt.system.ObjectPool;

/**
 * NotificationPool.java
 *
 * This class helps to recycle used Notifications
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.20.11
 */
public class NotificationPool extends ObjectPool<Notification>{

    public String note;//The information message to be displayed
    public int time;//The amount of time the message will stay on screen
    public byte form;//The type of message this represents
    public double posx;//The x-axis current position of the item
    public double posy;//The y-axis current position of the item
    public double fposx;//The final x-axis position of the item
    public double fposy;//The final y-axis position of the item
    public double speed;//The speed of the item

    /**
     * This sets up the variables for a new or recycled Notification
     * @param type The type of message to be displayed
     * @param message The text message to display on the screen
     * @param delay How long the message remains on the screen
     */
    public void setVar(byte type, String message, int delay){
        note = message;
        time = delay;
        form = type;
    }

    /**
     * This sets up the location of the variables for new or recycled
     * Notifications
     * @param locx The x-axis location of the message
     * @param locy The y-axis location of the message
     * @param spd The movement speed of the message
     */
    public void setPos(int locx, int locy, int spd){
        posx = locx;
        posy = locy;
        fposx = locx;
        fposy = locy;
        speed = spd;
    }

    /**
     * This function recycles an old Notification object
     * @param obj The Notification to be recycled
     * @return An instance of the old object
     */
    @Override
    protected Notification recycleInstance(Notification obj) {
        obj.form = form;
        obj.note = note;
        obj.time = time;
        obj.posx = posx;
        obj.posy = posy;
        obj.fposx = fposx;
        obj.fposy = fposy;
        obj.speed = speed;
        return obj;
    }

    /**
     * This function creates a new MenuItem object
     * @return An instance of a new MenuItem object
     */
    @Override
    protected Notification createInstance() {
        return new Notification(form, note, time, posx, posy, speed);
    }

}
