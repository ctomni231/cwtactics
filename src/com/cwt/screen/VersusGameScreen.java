package com.cwt.screen;

import com.cwt.graphic.tools.MapField;
import com.cwt.io.JukeBox;
import com.cwt.io.KeyControl;
import com.cwt.map.PixAnimate;
import com.cwt.system.jslix.state.Screen;
import com.engine.TestMap;

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
 * @version 12.26.12
 */

public class VersusGameScreen extends Screen{

    //private String MUSIC = "music/Andy.mp3";

    //private String FX_1 = "sound/ok.wav";
    //private String FX_2 = "sound/cancel.wav";
    //private String FX_3 = "sound/maptick.wav";
    //private String FX_4 = "sound/trap.wav";

    private final int SIZE_X = 640;//The base window height
    private final int SIZE_Y = 480;//The base window width
    private final int WAIT_TIME = 15;//The help bar waiting time
    
    private MapField mapScr;//The map Screen

    private boolean scrStart;//The initialization sequence starter for screens
    private int column;//Which screen index we are currently showing

    public VersusGameScreen(){
    	
    	mapScr = new MapField(10, 10, 0);
    	//mapScr.loadMap(TestMap.createTestMap());
    	
        PixAnimate.getTags();
        //JukeBox.stopClip();
        //JukeBox.addClip(MUSIC);
        //JukeBox.addClip(FX_1);
        //JukeBox.addClip(FX_2);
        //JukeBox.addClip(FX_3);
        //JukeBox.addClip(FX_4);
        //JukeBox.loopClip(MUSIC);

        scrStart = true;

        column = 0;
    }

    @Override
    public void init() {}

    @Override
    public void update(int timePassed) {
    	mapScr.update(scr_width, scr_height, scr_sysTime, scr_mouseScroll);
        switch(column){

        }

        //if(KeyControl.isLeftClicked())
        //    JukeBox.playClip(FX_1);

        //if(KeyControl.isRightClicked())
        //    JukeBox.playClip(FX_2);

        //if(KeyControl.isUpClicked())
        //    JukeBox.playClip(FX_3);

        //if(KeyControl.isDownClicked())
        //    JukeBox.playClip(FX_4);

        //TEMPORARY UNTIL FURTHER NOTICE
        if(KeyControl.isActionClicked() || KeyControl.isCancelClicked())
            this.scr_delete = true;
    }

    @Override
    public void render(Graphics g) {
    	mapScr.render(g);
        switch(column){

        }

        //TEMPORARY UNTIL FURTHER NOTICE
        g.setColor(Color.white);
        g.drawString("VERSUS", 10, 10);
    }

    @Override
    public void render(Graphics2D g, Component dthis) {
    	mapScr.render(g, dthis);
        switch(column){

        }

        //TEMPORARY UNTIL FURTHER NOTICE
        g.setColor(java.awt.Color.white);
        g.drawString("VERSUS", 10, 10);
    }

    @Override
    public void scr_close() {
        //JukeBox.stopClip();
    }

}
