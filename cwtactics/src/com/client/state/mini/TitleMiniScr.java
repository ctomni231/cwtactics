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
    private String menuData;

    public TitleMiniScr(TextImgLibrary txtLib, String[] data){
        menuData = "";
        titleScr = new TitleDraw();
        if(data.length > 0)
            titleScr.setWords(data[0], txtLib);
        titleScr.setImageSize(200, 20);
        if(data.length > 1)
            menuData = ""+data[1]+
            "                                                               ";
    }

    public void update(){
        if(scrSwitch){
            menuLogo.setText(2, menuData);
            menuLogo.setFinalPosition(0, 145, 30);
            //menuLogo.setFinalPosition(1, 0, 0);
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
