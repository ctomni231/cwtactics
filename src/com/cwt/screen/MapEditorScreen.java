package com.cwt.screen;

import com.cwt.graphic.ExitGUI;
import com.cwt.io.JukeBox;
import com.cwt.io.KeyControl;
import com.cwt.map.PixAnimate;
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
 * @version 02.15.11
 */

public class MapEditorScreen extends Screen{

    private String MUSIC = "music/Andy.mp3";

    private String FX_1 = "sound/ok.wav";
    private String FX_2 = "sound/cancel.wav";
    private String FX_3 = "sound/maptick.wav";
    private String FX_4 = "sound/explode.wav";

    private final int SIZE_X = 640;//The base window height
    private final int SIZE_Y = 480;//The base window width
    private final int WAIT_TIME = 15;//The help bar waiting time

    private ExitGUI exitScr;//Holds Screen data for the exit screen

    private boolean scrStart;//The initialization sequence starter for screens
    private int column;//Which screen index we are currently showing

    public MapEditorScreen(){
        PixAnimate.getData();



        //TEMPORARY UNTIL FURTHER NOTICE
        JukeBox.stopClip();    
        JukeBox.addClip(MUSIC);
        JukeBox.addClip(FX_1);
        JukeBox.addClip(FX_2);
        JukeBox.addClip(FX_3);
        JukeBox.addClip(FX_4);
        JukeBox.loopClip(MUSIC);
        
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
        if(KeyControl.isLeftClicked())
            JukeBox.playClip(FX_1);

        if(KeyControl.isRightClicked())
            JukeBox.playClip(FX_2);

        if(KeyControl.isUpClicked())
            JukeBox.playClip(FX_3);

        if(KeyControl.isDownClicked())
            JukeBox.playClip(FX_4);

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

        g.drawImage(PixAnimate.getSlickImage(1, 0, 0), 10, 10);
    }

    @Override
    public void render(Graphics2D g, Component dthis) {
        switch(column){

        }

        //TEMPORARY UNTIL FURTHER NOTICE
        g.setColor(java.awt.Color.white);
        g.drawString("MAP EDITOR", 10, 10);

        g.drawImage(PixAnimate.getImage(1, 0, 0), 10, 10, dthis);
    }

    @Override
    public void scr_close() {
        JukeBox.stopClip();
    }

}
