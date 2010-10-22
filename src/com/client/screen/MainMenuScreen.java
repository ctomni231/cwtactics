package com.client.screen;

import com.client.graphic.BackgroundHandler;
import com.client.graphic.CreditGUI;
import com.client.graphic.LogoHandler;
import com.client.graphic.TitleGUI;
import com.client.graphic.ExitGUI;
import com.client.graphic.MenuGUI;
import com.client.graphic.KeyGUI;
import com.client.graphic.xml.TitleReader;
import com.jslix.debug.MemoryTest;
import com.jslix.state.Screen;
import com.jslix.tools.XML_Writer;
import java.awt.Color;
import java.awt.Component;
import java.awt.Graphics2D;
import org.newdawn.slick.Graphics;

/**
 * MainMenuScreen.java
 *
 * The new main menu screen now using JSlix exclusively.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.21.10
 * @todo TODO Finish commenting this class
 */

public class MainMenuScreen extends Screen{

    //CHANGE THE STARTING MENU COLOR (0 - 18)
    private final int MENU_COLOR = -1;

    private final int SIZE_X = 640;
    private final int SIZE_Y = 480;
    private final int WAIT_TIME = 15;

    private TitleReader reader;
    private BackgroundHandler bgPic;
    private LogoHandler logoPic;
    private boolean menuHelp;

    private TitleGUI titleScr;
    private ExitGUI exitScr;
    private MenuGUI menuScr;
    private CreditGUI credScr;
    private KeyGUI keyScr;

    private boolean scrStart;
    private int column;
    private int current;
    private int menuColor;
    private int curColor;

    public MainMenuScreen(){
        menuHelp = true;

        reader = new TitleReader("data/titlescreen.xml");
        bgPic = new BackgroundHandler(scr_width, scr_height);
        logoPic = new LogoHandler(reader.logoPath, reader.miniPath, 
        		reader.copyright, reader.question, SIZE_X, SIZE_Y);
        logoPic.setColorPath(reader.unitColor);
        

        titleScr = new TitleGUI(220, 375, 0);
        titleScr.setOrigScreen(SIZE_X, SIZE_Y);
        titleScr.setShadowColor(Color.BLACK);
        titleScr.setShadowOffset(1);
        titleScr.setWords(reader.alpha, reader.start, 200, 20);
        titleScr.setColorPath(reader.unitColor);

        exitScr = new ExitGUI(reader.alpha, reader.exitData, 100, 200, 0);
        exitScr.setOrigScreen(SIZE_X, SIZE_Y);
        exitScr.setColorPath(reader.unitColor);

        menuScr = new MenuGUI(reader.arrow, reader.alpha, 20, 0, 165, 0);
        menuScr.init();
        //menuScr.initMenu(reader.mainOption, reader.mainSelect,
        //        reader.mainText, reader.mainHelp);
        menuScr.setOrigScreen(SIZE_X, SIZE_Y);
        menuScr.setColorPath(reader.unitColor);
        
        credScr = new CreditGUI(reader.alpha, reader.number, reader.credit,
                0, 0, 1);
        credScr.setOpacity(0.7);
        credScr.setColorPath(reader.unitColor);
        credScr.setOrigScreen(SIZE_X, SIZE_Y);

        keyScr = new KeyGUI(reader.alpha, reader.number, reader.arrow,
        		20, 0, 200, 1);
        keyScr.init(reader.keyOption, reader.keyHelp);
        keyScr.setOrigScreen(SIZE_X, SIZE_Y);

        menuColor = MENU_COLOR;
        curColor = MENU_COLOR;
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
            case 3:
                creditScr();
                break;
            case 4:
                keyScr();
                break;
            default:
                menuScr();
        }
        helpHide(8);
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
            case 3:
                credScr.render(g);
                break;
            case 4:
                keyScr.render(g);
                break;
            default:
                menuScr.render(g);
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
            case 3:
                credScr.render(g, dthis);
                break;
            case 4:
                keyScr.render(g, dthis);
                break;
            default:
                menuScr.render(g, dthis);
        }
        logoPic.render(g, dthis);
    }

    private void titleScr(){
        if(scrStart){
            logoPic.setFinalPosition(0, 145, 30);
            logoPic.setFinalPosition(2, 0, 460);
            logoPic.setScrollText();
            logoPic.setHelpText(reader.startHelp[0]);
            logoPic.setColor(menuColor);
            logoPic.setCounter(WAIT_TIME*8);
            titleScr.setColor(menuColor);
            scrStart = false;
        }
        titleScr.update(scr_width, scr_height, scr_sysTime, scr_mouseScroll);
        current = titleScr.control(column);
        

        if(menuHelp != titleScr.getHelp()){
            menuHelp = titleScr.getHelp();
            if(menuHelp){
                logoPic.setHelpOpacity(0.9);
                logoPic.setFinalPosition(3, 0, 0);
            }else{
                logoPic.setHelpOpacity(0.7);
                logoPic.setFinalPosition(3, 0, -20);
                logoPic.setCounter(WAIT_TIME*8);
            }
        }
    }

    private void menuScr(){
        if(scrStart){
            logoPic.setFinalPosition(0, 145, 15);
            logoPic.setFinalPosition(1, 0, -150);
            logoPic.setFinalPosition(2, 0, 460);
            menuScr.setColor(menuColor);
            logoPic.setHelpText(menuScr.getHelpText());
            logoPic.forceScrollText(menuScr.getScrollText());
            logoPic.setCounter(WAIT_TIME);
            if(!menuHelp)
                logoPic.setFinalPosition(3, 0, -20);
            scrStart = false;
        }

        if(menuScr.getMenuChange()){
            logoPic.forceScrollText(menuScr.getScrollText());
            logoPic.setHelpText(menuScr.getHelpText());
            if(!menuHelp)
                logoPic.setFinalPosition(3, 0, -20);
            logoPic.setCounter(WAIT_TIME);
        }
        menuScr.update(scr_width, scr_height, scr_sysTime, scr_mouseScroll);
        current = menuScr.control(column, scr_mouseScroll);
        curColor = menuScr.getCurFaction();
    }

    private void exitScr(){
        if(scrStart){
            logoPic.setFinalPosition(0, 145, 50);
            logoPic.setFinalPosition(2, 0, 480);
            logoPic.setHelpText(exitScr.getHelpText());
            exitScr.setColor(menuColor);
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
    }

    private void creditScr(){
        if(scrStart){
            logoPic.setFinalPosition(0, 145, -150);
            logoPic.setFinalPosition(1, 0, 20);
            logoPic.setFinalPosition(2, 0, 480);
            credScr.setColor(menuColor);
            scrStart = false;
        }

        if(credScr.getMenuChange())
            logoPic.setHelpText(credScr.getHelpText());

        logoPic.setCounter(WAIT_TIME);
        credScr.update(scr_width, scr_height, scr_sysTime, scr_mouseScroll);
        current = credScr.control(column);
    }

    private void keyScr(){
        if(scrStart){
            logoPic.setFinalPosition(0, 145, 30);
            logoPic.setFinalPosition(2, 0, 480);
            scrStart = false;
        }

        keyScr.update(scr_width, scr_height, scr_sysTime, scr_mouseScroll);
        current = keyScr.control(column, scr_mouseScroll);
    }

    private void helpHide(int mult){
        if(column != current){
            column = current;
            scrStart = true;
        }

        if(curColor != menuColor){
            menuColor = curColor;
            logoPic.setColor(menuColor);
            exitScr.setColor(menuColor);
            titleScr.setColor(menuColor);
            menuScr.setColor(menuColor);
        }

        if(logoPic.checkHelp())
        	logoPic.setCounter(WAIT_TIME*mult);

        if(!menuHelp){
            if(logoPic.getCounter())
                logoPic.setFinalPosition(3, 0, 0);
            else
                logoPic.setFinalPosition(3, 0, -20);
        }
    }

    @Override
    public void scr_close() {
        if(!scr_isApplet){
            XML_Writer writer = new XML_Writer("data","options.xml");
            writer.addXMLTag("options");
            writer.addAttribute("help", ""+menuHelp, false);
            writer.addAttribute("color", ""+menuColor, false);
            writer.addAttribute("column", ""+menuScr.getMenuColumn(), false);
            writer.endAllTags();
            
            writer.print();
        }
    }
}
