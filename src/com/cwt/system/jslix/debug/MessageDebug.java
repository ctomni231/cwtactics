package com.cwt.system.jslix.debug;

import com.cwt.system.jslix.KeyPress;
import com.cwt.system.jslix.NotifyLibrary;
import com.cwt.system.jslix.state.Screen;
import com.cwt.system.jslix.tools.PixtureMap;
import java.awt.Component;
import java.awt.Graphics2D;
import org.newdawn.slick.Color;
import org.newdawn.slick.Graphics;

/**
 * MessageDebug.java
 *
 * This debugging class is used to display messages to the user and
 * displays it to the notification screen.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.17.11
 */
public class MessageDebug extends Screen{

    private PixtureMap imgSort;//Holds the image text representations
    private String message;//Holds the option question text

    /**
     * This class gets a JSlix Notification Message and displays it over
     * the currently drawn screen.
     * @param message The string representation of the message
     */
    public MessageDebug(String message){
        imgSort = new PixtureMap();
        this.message = message;
        scr_link = true;
    }

    /**
     * This function initializes the message and stores it to a picture
     */
    @Override
    public void init() {
        imgSort.addImage(message, imgSort.getTextPicture(message+" "));
    }

    /**
     * The update function gets user actions
     * @param timePassed Whether this screen is Slick(+#) or Java(-#)
     */
    @Override
    public void update(int timePassed) {
        //For Java Screen, timePassed is always < 0
        if(timePassed < 0){
             //Adds a Screen for a left Mouse Click
            if(KeyPress.isMouseClicked(1))
                scr_delete = true;

            //Deletes a Screen for a right Mouse Click
            if(KeyPress.isMouseClicked(3))
                scr_delete = true;
        }
        //For Slick screens timePassed >= 0
        else{
            //Adds a Screen for a left Mouse Click
            if(KeyPress.isMouseClicked(0))
                scr_delete = true;

            //Deletes a Screen for a right Mouse Click
            if(KeyPress.isMouseClicked(1))
                scr_delete = true;
        }
    }

    /**
     * This function renders the messages for Slick graphics
     * @param g The graphic producer for Slick2D
     */
    @Override
    public void render(Graphics g) {
        g.setColor(imgSort.getColor(Color.black, 127));
        g.fillRect(0, 0, scr_width, scr_height);
        g.drawImage(imgSort.getSlickImage(message),
            (int)(scr_width/2-imgSort.getX(message)/2),
            (int)(scr_height/2-imgSort.getY(message)/2));
    }

    /**
     * This function renders the messages for Java graphics
     * @param g The graphic producer for Java2D
     * @param dthis The Component producer for Java2D
     */
    @Override
    public void render(Graphics2D g, Component dthis) {
        g.setColor(imgSort.getColor(java.awt.Color.black, 127));
        g.fillRect(0, 0, scr_width, scr_height);
        g.drawImage(imgSort.getImage(message),
            (int)(scr_width/2-imgSort.getX(message)/2),
            (int)(scr_height/2-imgSort.getY(message)/2), dthis);
    }

    /**
     * This function uses the close function to add a Notification message
     */
    @Override
    public void scr_close(){
        NotifyLibrary.addMessage(message);
    }
}
