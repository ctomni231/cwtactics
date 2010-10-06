package com.client.screen;

import com.client.graphic.BackgroundHandler;
import com.client.graphic.LogoHandler;
import com.client.graphic.TitleGUI;
import com.client.graphic.ExitGUI;
import com.client.graphic.xml.TitleReader;
import com.jslix.debug.MemoryTest;
import com.jslix.state.Screen;
import java.awt.Color;
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
    private final int WAIT_TIME = 15;

    private TitleReader reader;
    private BackgroundHandler bgPic;
    private LogoHandler logoPic;
    private boolean menuHelp;

    private TitleGUI titleScr;
    private ExitGUI exitScr;

    private boolean scrStart;
    private int column;
    private int current;

    public MainMenuScreen(){
        menuHelp = true;
        reader = new TitleReader("data/titlescreen.xml");
        bgPic = new BackgroundHandler(scr_width, scr_height);
        logoPic = new LogoHandler(reader.getTitleLogoPath(),
                reader.getMiniLogoPath(), reader.getCopyright(),
                SIZE_X, SIZE_Y);

        titleScr = new TitleGUI(220, 375, 0);
        titleScr.setOrigScreen(SIZE_X, SIZE_Y);
        titleScr.setShadowColor(Color.BLACK);
        titleScr.setShadowOffset(1);
        titleScr.setWords(reader.getAlphaPath(), reader.getStartText(),
                200, 20);

        exitScr = new ExitGUI(reader.getAlphaPath(), reader.getExitData(),
                100, 200, 0);
        exitScr.setOrigScreen(SIZE_X, SIZE_Y);
        exitScr.setType(1);
        
        scrStart = true;
        column = 0;
    }

    @Override
    public void init() {
        bgPic.update(scr_name, scr_index, scr_isApplet, scr_link);
        bgPic.init();
        logoPic.init();
        exitScr.init();
    }

    @Override
    public void update(int timePassed) {
        bgPic.update(scr_width, scr_height, scr_sysTime, scr_mouseScroll);

        switch(column){
            case 0:
                titleScr();
                break;
            case -1:
            case 2:
                exitScr();
                break;
            default:
                menuScr();
        }
        scr_mouseScroll = 0;
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
            case -1:
            case 2:
                exitScr.render(g);
                break;
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
            case -1:
            case 2:
                exitScr.render(g, dthis);
                break;
        }
        logoPic.render(g, dthis);
    }

    private void titleScr(){
        if(scrStart){
            logoPic.setFinalPosition(0, 145, 30);
            logoPic.setFinalPosition(2, 0, 460);
            logoPic.setScrollText();
            logoPic.setHelpText(reader.getStartHelp()[0]);
            logoPic.setCounter(WAIT_TIME*2);
            if(!menuHelp)
                logoPic.setFinalPosition(3, 0, -20);
            scrStart = false;
        }
        titleScr.update(scr_width, scr_height, scr_sysTime, scr_mouseScroll);
        current = titleScr.control(column);
        if(column != current){
            column = current;
            scrStart = true;
        }

        logoPic.checkHelp();
        if(menuHelp != titleScr.getHelp()){
            menuHelp = titleScr.getHelp();
            if(menuHelp){
                logoPic.setHelpOpacity(0.9);
                logoPic.setFinalPosition(3, 0, 0);
            }else{
                logoPic.setHelpOpacity(0.6);
                logoPic.setFinalPosition(3, 0, -20);
            }
        }

        if(!menuHelp && logoPic.getCounter())
            logoPic.setFinalPosition(3, 0, 0);
    }

    private void menuScr(){

    }

    private void exitScr(){
        if(scrStart){
            logoPic.setFinalPosition(0, 145, 50);
            logoPic.setFinalPosition(2, 0, 480);
            logoPic.setHelpText(exitScr.getHelpText());
            logoPic.setCounter(WAIT_TIME);
            if(!menuHelp)
                logoPic.setFinalPosition(3, 0, -20);
            scrStart = false;
        }

        if(exitScr.getMenuChange()){
            logoPic.setHelpText(exitScr.getHelpText());
            if(!menuHelp)
                logoPic.setFinalPosition(3, 0, -20);
            logoPic.setCounter(WAIT_TIME);
        }
        
        exitScr.update(scr_width, scr_height, scr_sysTime, scr_mouseScroll);
        current = exitScr.control(column, scr_mouseScroll);
        if(column != current){
            column = current;
            scrStart = true;
        }

        if(!menuHelp && logoPic.getCounter())
            logoPic.setFinalPosition(3, 0, 0);
    }
}
