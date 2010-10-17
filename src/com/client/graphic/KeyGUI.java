package com.client.graphic;

import com.client.graphic.tools.VerticalMenu;
import com.client.input.KeyControl;

/**
 * KeyGUI.java
 *
 * This class controls the key configure for the entire game for both Java
 * and Slick Screens. This is fully geared toward changing keyboard actions.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.16.10
 * @todo TODO Finish commenting this class
 */

public class KeyGUI extends VerticalMenu{

    public KeyGUI(int locx, int locy, double speed){
        super(locx, locy, speed);
    }

    public int control(int column, int mouseScroll){
        if(KeyControl.isActionClicked() ||
                KeyControl.isCancelClicked())
            column = 1;
        return column;
    }
}
