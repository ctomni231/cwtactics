package com.jslix.system;

import org.newdawn.slick.CanvasGameContainer;
import org.newdawn.slick.Game;
import org.newdawn.slick.SlickException;

/**
 *
 * @author Crecen
 */
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
