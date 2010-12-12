package com.client.screen;

import com.system.input.KeyControl;
import com.jslix.state.Screen;
import java.awt.Component;
import java.awt.Graphics2D;
import org.newdawn.slick.Color;
import org.newdawn.slick.Graphics;

/**
 * MapEditorScreen.java
 *
 * The new map editor screen now using JSlix exclusively.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 11.01.10
 */

public class MapEditorScreen extends Screen{

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
        g.drawString("MAP EDITOR", 10, 10);
    }

    @Override
    public void render(Graphics2D g, Component dthis) {
        g.setColor(java.awt.Color.white);
        g.drawString("MAP EDITOR", 10, 10);
    }

}
