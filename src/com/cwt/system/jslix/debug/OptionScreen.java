package com.cwt.system.jslix.debug;

import com.cwt.system.jslix.state.Screen;
import com.cwt.system.jslix.tools.PixtureMap;
import java.awt.Component;
import java.awt.Graphics2D;
import org.newdawn.slick.Graphics;

/**
 * OptionScreen.java
 *
 * This class presents an option screen to the user and displays the results
 * on the JSlix Notification Log.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.17.11
 */
public class OptionScreen extends Screen{

    private PixtureMap imgSort;//Holds the image text representations
    private String optionMessage;//Holds the option question text
    private String optionYes;//Holds the yes text
    private String optionNo;//Holds the no text
    private boolean option;//Holds the user selected option

    public OptionScreen(String message, String yes, String no){
        imgSort = new PixtureMap();
        optionMessage = message;
        optionYes = yes;
        optionNo = no;
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
    public void update(int timePassed) {}

    @Override
    public void render(Graphics g) {}

    @Override
    public void render(Graphics2D g, Component dthis) {}
    
    public void addMessage(String message){
        imgSort.addImage(message, imgSort.getTextPicture(message+" "));
    }

}
