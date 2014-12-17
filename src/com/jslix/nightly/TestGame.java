package com.jslix.nightly;

import org.newdawn.slick.BasicGame;
import org.newdawn.slick.Color;
import org.newdawn.slick.GameContainer;
import org.newdawn.slick.Graphics;
import org.newdawn.slick.SlickException;

/**
 * BasicGame
 *
 * This is a placeholder for SlixGame so I can see how the Slick screen
 * interacts in different situations.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.19.12
 */
public class TestGame extends BasicGame{

    public TestGame(){
        super("Test Game");
    }

    //@Override
    public void init(GameContainer container) throws SlickException {

    }

    //@Override
    public void update(GameContainer container, int i) throws SlickException {

    }

    //@Override
    public void render(GameContainer container, Graphics g) throws SlickException {
        g.setColor(container.hasFocus() ? Color.blue : Color.black);
        g.fillRect(0, 0, container.getWidth(), container.getHeight());

    }

}
