package com.jslix.system;

import org.newdawn.slick.CanvasGameContainer;
import org.newdawn.slick.Game;
import org.newdawn.slick.SlickException;

/**
 * SlixContainer.java
 *
 * This is a shell container for the Slick Screens, has functions that'll
 * help a Slick Frame close cleanly.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 09.10.10
 */

//TODO: Finish commenting this class
public class SlixContainer extends CanvasGameContainer{

    public SlixContainer(Game game) throws SlickException{
        super(game);
    }

    @Override
    public boolean isVisible() {
        if(SlixLibrary.quitNow())  super.setVisible(false);
        return super.isVisible();
    }
}
