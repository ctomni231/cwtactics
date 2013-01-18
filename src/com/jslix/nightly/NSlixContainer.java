package com.jslix.nightly;

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
 * @version 10.27.10
 */

public class NSlixContainer extends CanvasGameContainer{

    private static final long serialVersionUID = 2452945053572843636L;
    //Width of the window for fullscreen
    public final int FULL_X = 800;
    //Height of the window for fullscreen
    public final int FULL_Y = 600;

    /**
     * This class is a filler class for the CanvasGameContainer used
     * only to make sure that the Slick window always exits cleanly.
     * @param game The slick2D game associated with this class
     * @throws SlickException Thrown if the class has exception
     */
    public NSlixContainer(Game game) throws SlickException{
        super(game);
    }
}
