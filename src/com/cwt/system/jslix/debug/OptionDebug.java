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
 * OptionDebug.java
 *
 * This class presents an option screen to the user and displays the results
 * on the JSlix Notification Log.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.17.11
 */
public class OptionDebug extends Screen{

    private PixtureMap imgSort;//Holds the image text representations
    private String message;//Holds the option question text
    private String yes;//Holds the yes text
    private String no;//Holds the no text
    private boolean option;//Holds the user selected option

    public OptionDebug(String message, String t, String f){
        imgSort = new PixtureMap();
        this.message = message;
        yes = t;
        no = f;
        option = true;
        scr_link = true;
    }

    @Override
    public void init() {
        imgSort.addImage(message, imgSort.getTextPicture(message+" "));
        imgSort.addImage(yes, imgSort.getTextPicture(yes+" "));
        imgSort.addImage(no, imgSort.getTextPicture(no+" "));
    }

    @Override
    public void update(int timePassed){
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

    @Override
    public void render(Graphics g){
        g.setColor(imgSort.getColor(Color.blue, 127));
        g.fillRect(0, 0, scr_width, scr_height);
        g.fillRect((int)(scr_width/2-imgSort.getX(message)/2),
            (int)(scr_height/2-imgSort.getY(message)),
            imgSort.getX(message),
            imgSort.getY(message));
        g.drawImage(imgSort.getSlickImage(message),
            (int)(scr_width/2-imgSort.getX(message)/2),
            (int)(scr_height/2-imgSort.getY(message)));
    }

    @Override
    public void render(Graphics2D g, Component dthis){
        g.setColor(imgSort.getColor(java.awt.Color.blue, 127));
        g.fillRect(0, 0, scr_width, scr_height);
        g.fillRect((int)(scr_width/2-imgSort.getX(message)/2),
            (int)(scr_height/2-imgSort.getY(message)),
            imgSort.getX(message),
            imgSort.getY(message));
        g.drawImage(imgSort.getImage(message),
            (int)(scr_width/2-imgSort.getX(message)/2),
            (int)(scr_height/2-imgSort.getY(message)), dthis);
    }

    @Override
    public void scr_close(){
        NotifyLibrary.addMessage(option+":"+message);
    }

}
