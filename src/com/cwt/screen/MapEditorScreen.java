package com.cwt.screen;

import com.cwt.io.KeyControl;
import com.cwt.system.jslix.state.Screen;
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
 * @version 01.30.11
 */

public class MapEditorScreen extends Screen{

    private final int SIZE_X = 640;//The base window height
    private final int SIZE_Y = 480;//The base window width
    private final int WAIT_TIME = 15;//The help bar waiting time

    private boolean scrStart;//The initialization sequence starter for screens
    private int column;//Which screen index we are currently showing

    public MapEditorScreen(){

        scrStart = true;

        column = 0;
    }

    @Override
    public void init() {}

    @Override
    public void update(int timePassed) {

        switch(column){

        }

        //TEMPORARY UNTIL FURTHER NOTICE
        if(KeyControl.isActionClicked() || KeyControl.isCancelClicked())
            this.scr_delete = true;
    }

    @Override
    public void render(Graphics g) {
        switch(column){

        }

        //TEMPORARY UNTIL FURTHER NOTICE
        g.setColor(Color.white);
        g.drawString("MAP EDITOR", 10, 10);
    }

    @Override
    public void render(Graphics2D g, Component dthis) {
        switch(column){

        }

        //TEMPORARY UNTIL FURTHER NOTICE
        g.setColor(java.awt.Color.white);
        g.drawString("MAP EDITOR", 10, 10);
    }

}
