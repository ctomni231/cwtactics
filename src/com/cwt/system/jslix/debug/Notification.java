package com.cwt.system.jslix.debug;

/**
 * Notification.java
 *
 * A small class for holding Notification messages and log messages
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.20.11
 */
public class Notification {

    public String note;//The information message to be displayed
    public int time;//The amount of time the message will stay on screen
    public byte form;//The type of message this represents
    public double posx;//The x-axis current position of the item
    public double posy;//The y-axis current position of the item
    public double fposx;//The final x-axis position of the item
    public double fposy;//The final y-axis position of the item
    public double speed;//The speed of the item

    /**
     * This class holds notifications that will be displayed to the screen
     * for both Java and Slick windows. These are usually used for error
     * messages and information not suitable for game API.
     * @param type The type of message to be displayed
     * @param message The text message to display on the screen
     * @param delay How long the message remains on the screen
     */
    public Notification(byte type, String message, int delay,
            double locx, double locy, double spd){
        note = message;
        time = delay;
        form = type;
        posx = locx;
        posy = locy;
        fposx = locx;
        fposy = locy;
        speed = spd;
    }

    /**
     * This function controls how fast an object will reach its destination
     * Negative values will be treated as instant movement.
     */
    public void renderSpeed(){
        if(posx == fposx && posy == fposy);
        else if(speed == 0){
            posx = fposx;
            posy = fposy;
        }else{
            if(posx < fposx)
                posx += speed;
            else if(posx > fposx)
                posx -= speed;
            if(posy < fposy)
                posy += speed;
            else if(posy > fposy)
                posy -= speed;
        }
    }

}
