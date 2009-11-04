package com.client.state.mini;

import com.client.logic.input.Controls;
import com.client.menu.GUI.LogoDraw;
import com.client.menu.GUI.TitleDraw;
import com.client.tools.TextImgLibrary;
import org.newdawn.slick.Graphics;

/**
 * TitleMiniScr
 * The reason for the mini states is so I do not have to create a new
 * state for every window I create. This mini state creates a window
 * for the title screen
 *
 * @author Crecen
 */
public class TitleMiniScr {
    public boolean scrSwitch;
    public LogoDraw menuLogo;
    public int scr_sysTime;
    public int column;

    private TitleDraw titleScr;

    public TitleMiniScr(TextImgLibrary txtLib){
        titleScr = new TitleDraw();
        titleScr.setWords("PRESS START", txtLib);
        titleScr.setImageSize(200, 20);
    }

    public void update(){
        if(scrSwitch){
            menuLogo.setText(2, " - ADVANCE WARS IS COPYRIGHT OF " +
                    "NINTENDO/INTELLIGENT SYSTEMS - " +
        "                                                               ");
            menuLogo.setFinalPosition(0, 195, 100);
            menuLogo.setFinalPosition(1, 120, 40);
            menuLogo.setFinalPosition(2, 0, 460);
            scrSwitch = false;
        }

        if(Controls.isActionClicked()){
            column = 1;
            scrSwitch = true;
        }
        if(Controls.isCancelClicked()){
            column = -1;
            scrSwitch = true;
        }
    }

    public void render(Graphics g){
        titleScr.render(g, scr_sysTime, 220, 375);
    }
}
