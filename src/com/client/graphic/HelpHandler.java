package com.client.graphic;

import com.client.graphic.tools.MovingMenu;
import com.client.input.KeyControl;
import com.jslix.tools.MouseHelper;
import com.jslix.tools.PixtureMap;
import java.awt.Color;

/**
 * This class controls the help bar and help actions in the game
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.6.10
 */
public class HelpHandler extends MovingMenu{

    private MouseHelper helper;//Regulates the mouse focus for help text
    private String logoPath;//Stores the path to the tiny question logo
    private PixtureMap pixture;//This is used to help create font text pics
    private Color theColor;//This stores the backgrond color of the help box
    private int counter;//Helps control the visibility of the help bar

    /**
     * This class displays a help bar on the top of the screen
     * @param helpLogo The path to the question mark help icon
     * @param locx The x-axis location of the help bar
     * @param locy The y-axis location of the help bar
     * @param speed How fast the help bar moves in the screen
     */
    public HelpHandler(String helpLogo, int locx, int locy, double speed){
        super(locx, locy, speed);
        helper = new MouseHelper();
        pixture = new PixtureMap();
        logoPath = helpLogo;
        theColor = Color.DARK_GRAY;
    }

    /**
     * This function sets up how the help bar displays on the screen
     */
    @Override
    public void init(){
        pixture.setOpacity(0.2);
        pixture.addImage(0, pixture.getTextPicture(" - "));

        setOpacity(0.9);
        createNewItem(0, 0, 1);
        addBox(0, pixture.getColor(theColor, 127),
                640, 20, false);
        createNewItem(2, 2, 1);
        addImagePart(logoPath, -1);
        addMenuItem(0, false);
        createNewItem(640-pixture.getX(0), 0, 0);
        addImagePart(pixture.getImage(0), -1);
        addMenuItem(0, false);

        helper.setScrollIndex(4);
    }

    /**
     * THis function updates the help bar and regulates the help bar actions
     * and visibility on the screen
     * @param width The current width of the window
     * @param height The current height of the window
     * @param sysTime The system time in milliseconds
     * @param mouseScroll The mouse scroll wheel value
     */
    @Override
    public void update(int width, int height, int sysTime, int mouseScroll) {
        super.update(width, height, sysTime, mouseScroll);
        helper.setMouseControl(sysTime);
        if(counter > 0 && helper.getScroll())
            counter--;
    }

    /**
     * This function gets the help text for display
     * @return The String representing the help text
     */
    public void setHelpText(String text){
        pixture.setOpacity(0.1);
        pixture.addImage(0, pixture.getTextPicture(text));

        setItemImage(2, 0, pixture.getImage(0));
        setItemPosition(2, 640-pixture.getX(0), 0);
    }

    /**
     * This function controls how much seconds the help bar stays
     * hidden before it is visible again.
     * @param number The amount of time in quarter seconds
     */
    public void setCounter(int number){
        counter = number;
    }

    /**
     * This function is used to see if the help bar is visible
     * @return whether the help bar is visible(true) or not(false)
     */
    public boolean getVisible(){
        return counter < 1;
    }

    /**
     * This function checks to see if the mouse is hovering over the mouse
     * bar
     * @return whether the mouse is hovering over the bar(true) or not(false)
     */
    public boolean checkHelp(){
        if(KeyControl.getMouseY() < 20*getScaleY()){
            setPosition(0, 0);
            return true;
        }
        return false;
    }


}
