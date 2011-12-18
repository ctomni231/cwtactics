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
    private String optionMessage;//Holds the option question text
    private String optionYes;//Holds the yes text
    private String optionNo;//Holds the no text
    private boolean option;//Holds the user selected option

    public OptionDebug(String message, String t, String f){
        imgSort = new PixtureMap();
        optionMessage = message;
        optionYes = t;
        optionNo = f;
        option = true;
        scr_link = true;
    }

    @Override
    public void init() {
        addMessage(optionMessage);
        addMessage(optionYes);
        addMessage(optionNo);
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
        g.setColor(imgSort.getColor(Color.black, 127));
        g.fillRect(0, 0, scr_width, scr_height);
        g.setColor(Color.white);
        g.drawString(optionMessage,
                (int)(scr_width/2-imgSort.getX(optionMessage)/2),
                (int)(scr_height/2-imgSort.getX(optionMessage)));
    }

    @Override
    public void render(Graphics2D g, Component dthis){
        g.setColor(imgSort.getColor(java.awt.Color.black, 127));
        g.fillRect(0, 0, scr_width, scr_height);
        g.setColor(java.awt.Color.white);
        g.drawString(optionMessage,
                (int)(scr_width/2-imgSort.getX(optionMessage)/2),
                (int)(scr_height/2-imgSort.getX(optionMessage)));
    }
    
    public void addMessage(String message){
        imgSort.addImage(message, imgSort.getTextPicture(message+" "));
    }

    @Override
    public void scr_close(){
        NotifyLibrary.addMessage(option+":"+optionMessage);
    }

}
