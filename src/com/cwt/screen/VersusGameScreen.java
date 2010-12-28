package com.cwt.screen;

import com.cwt.io.KeyControl;
import com.cwt.system.jslix.state.Screen;
import java.awt.Component;
import java.awt.Graphics2D;
import org.newdawn.slick.Color;
import org.newdawn.slick.Graphics;

/**
 * VersusGameScreen.java
 *
 * The new Versus Game Screen used by JSlix completely.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 11.01.10
 */

public class VersusGameScreen extends Screen{

    @Override
    public void init() {}

    @Override
    public void update(int timePassed) {
        if(KeyControl.isActionClicked() || KeyControl.isCancelClicked())
            this.scr_delete = true;
    }

    @Override
    public void render(Graphics g) {
        g.setColor(Color.white);
        g.drawString("VERSUS", 10, 10);
    }

    @Override
    public void render(Graphics2D g, Component dthis) {
        g.setColor(java.awt.Color.white);
        g.drawString("VERSUS", 10, 10);
    }

}
