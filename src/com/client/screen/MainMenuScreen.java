package com.client.screen;

import com.client.graphic.BackgroundHandler;
import com.client.graphic.LogoHandler;
import com.client.graphic.TitleGUI;
import com.client.graphic.xml.TitleReader;
import com.jslix.debug.MemoryTest;
import com.jslix.state.Screen;
import java.awt.Component;
import java.awt.Graphics2D;
import org.newdawn.slick.Graphics;

/**
 * The new main menu screen now using JSlix exclusively.
 *
 * @author Crecen
 */
public class MainMenuScreen extends Screen{

    private final int SIZE_X = 640;
    private final int SIZE_Y = 480;

    private TitleReader reader;
    private BackgroundHandler bgPic;
    private LogoHandler logoPic;

    private TitleGUI titleScr;

    private boolean scrStart;
    private int column;

    public MainMenuScreen(){
        reader = new TitleReader("data/titlescreen.xml");
        bgPic = new BackgroundHandler(scr_width, scr_height);
        logoPic = new LogoHandler(reader.getTitleLogoPath(),
                reader.getMiniLogoPath(), reader.getCopyright(),
                SIZE_X, SIZE_Y);

        titleScr = new TitleGUI(220, 375, 0);
        titleScr.setOrigScreen(SIZE_X, SIZE_Y);
        titleScr.setWords(reader.getAlphaPath(), reader.getStartText(),
                200, 20);
        
        scrStart = true;
        column = 0;
    }

    @Override
    public void init() {
        bgPic.update(scr_name, scr_index, scr_isApplet, scr_link);
        bgPic.init();
        logoPic.init();
    }

    @Override
    public void update(int timePassed) {
        bgPic.update(scr_width, scr_height, scr_sysTime, scr_mouseScroll);

        switch(column){
            case 0:
                startScr();
                break;
            default:
        }
        logoPic.update(scr_width, scr_height, scr_sysTime, scr_mouseScroll);        
        //MemoryTest.printMemoryUsage("MAIN");
    }

    @Override
    public void render(Graphics g) {
        bgPic.render(g);
        switch(column){
            case 0:
                titleScr.render(g);
                break;
            default:
        }
        logoPic.render(g);
    }

    @Override
    public void render(Graphics2D g, Component dthis) {
        bgPic.render(g, dthis);
        switch(column){
            case 0:
                titleScr.render(g, dthis);
                break;
            default:
        }
        logoPic.render(g, dthis);
    }

    private void startScr(){
        if(scrStart){
            logoPic.setFinalPosition(0, 145, 30);
            logoPic.setFinalPosition(2, 0, 460);
            logoPic.setScrollText();
            scrStart = false;
        }
        titleScr.update(scr_width, scr_height, scr_sysTime, scr_mouseScroll);
    }
}
