package com.client.graphic;

import com.client.graphic.tools.MovingMenu;
import com.client.input.KeyControl;
import com.jslix.tools.MouseHelper;
import com.jslix.tools.PixtureMap;
import java.awt.Color;

/**
 * This class controls the help bar and help actions in the game
 *
 * @author Crecen
 */
public class HelpHandler extends MovingMenu{

    private MouseHelper helper;
    private String logoPath;
    private PixtureMap pixture;
    private Color theColor;
    private int counter;

    public HelpHandler(String helpLogo, int locx, int locy, double speed){
        super(locx, locy, speed);
        helper = new MouseHelper();
        pixture = new PixtureMap();
        logoPath = helpLogo;
        theColor = Color.DARK_GRAY;
    }

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

    @Override
    public void update(int width, int height, int sysTime, int mouseScroll) {
        super.update(width, height, sysTime, mouseScroll);
        helper.setMouseControl(sysTime);
        if(counter > 0 && helper.getScroll())
            counter--;
    }

    public void setHelpText(String text){
        pixture.setOpacity(0.1);
        pixture.addImage(0, pixture.getTextPicture(text));

        setItemImage(2, 0, pixture.getImage(0));
        setItemPosition(2, 640-pixture.getX(0), 0);
    }

    public void setCounter(int number){
        counter = number;
    }

    public boolean getVisible(){
        return counter < 1;
    }

    public boolean checkHelp(){
        if(KeyControl.getMouseY() < 20*getScaleY()){
            setPosition(0, 0);
            return true;
        }
        return false;
    }


}
