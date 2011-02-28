package com.cwt.system.jslix.debug;

/**
 * Notification.java
 *
 * A small class for holding Notification messages and log messages
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.27.11
 */
public class Notification {

    public String note;//The information message to be displayed
    public int time;//The amount of time the message will stay on screen
    public int boxClr;//The color of the background box
    public double posx;//The x-axis current position of the item
    public double posy;//The y-axis current position of the item
    public double fposx;//The final x-axis position of the item
    public double fposy;//The final y-axis position of the item
    public double speed;//The speed of the item

    /**
     * This class holds notifications that will be displayed to the screen
     * for both Java and Slick windows. These are usually used for error
     * messages and information not suitable for game API.
     * @param boxColor The background color of the text box
     * @param message The text message to display on the screen
     * @param delay How long the message remain on the screen
     * @param locx The x-axis location of this particular object
     * @param locy The y-axis location of this particular object
     * @param spd The movement speed of the object
     */
    public Notification(int boxColor, String message, int delay,
            double locx, double locy, double spd){
        note = message;
        time = delay;
        boxClr = boxColor;
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
    public void updatePosition(){
        if(posx != fposx || posy != fposy){
            if(speed == 0){
                posx = fposx;
                posy = fposy;
            }
            if(posx != fposx)
                posx += (posx < fposx) ? speed : -speed;
            if(posy != fposy)
                posy += (posy < fposy) ? speed : -speed;
        }
    }
}
