package com.client.screen;

import com.client.graphic.BackgroundHandler;
import com.client.graphic.CreditGUI;
import com.client.graphic.LogoHandler;
import com.client.graphic.TitleGUI;
import com.client.graphic.ExitGUI;
import com.client.graphic.MenuGUI;
import com.client.graphic.KeyGUI;
import com.client.graphic.tools.TextPix;
import com.client.graphic.xml.TitleReader;
import com.client.input.OptionHandler;
import com.jslix.debug.MemoryTest;
import com.jslix.state.Screen;
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
 * @version 10.29.10
 */

public class MainMenuScreen extends Screen{

    //CHANGE THE STARTING MENU COLOR (0 - 18)
    private final int MENU_COLOR = -1;//The color of the menu items
    private final int SIZE_X = 640;//The base window height
    private final int SIZE_Y = 480;//The base window width
    private final int WAIT_TIME = 15;//The help bar waiting time

    private TitleReader reader;//XML reader for the title and menu screens
    private BackgroundHandler bgPic;//XML reader for the background
    private LogoHandler logoPic;//This holds all the moving logos
    private boolean menuHelp;//Holds whether help bar is locked to screen
    private OptionHandler option;//Loads and stores the user options

    private TitleGUI titleScr;//Holds screen data for the title screen
    private ExitGUI exitScr;//Holds screen data for the exit screen
    private MenuGUI menuScr;//Holds screen data for the main menu
    private CreditGUI credScr;//Holds screen data for the credits
    private KeyGUI keyScr;//Holds screen data for the key configure

    private boolean scrStart;//The initization sequence starter for screens
    private int column;//Which screen index we are currently showing
    private int current;//Used to update the screen index
    private int menuColor;//The current color of the menu items
    private int curColor;//Used to update the current color

    /**
     * This class contains all the elements that make up the title screen
     * of CWT. This function initializes all the screens.
     */
    public MainMenuScreen(){
        menuHelp = true;

        reader = new TitleReader("data/titlescreen.xml");

        TextPix.setTextPath(reader.alpha);
        TextPix.setNumPath(reader.number);

        bgPic = new BackgroundHandler(scr_width, scr_height);
        logoPic = new LogoHandler(reader.logoPath, reader.miniPath, 
        		reader.copyright, reader.question, SIZE_X, SIZE_Y);
        logoPic.setColorPath(reader.unitColor);       

        titleScr = new TitleGUI(220, 375, 0);
        titleScr.setOrigScreen(SIZE_X, SIZE_Y);
        titleScr.setShadowColor(Color.BLACK);
        titleScr.setShadowOffset(1);
        titleScr.setWords(reader.start, 200, 20);
        titleScr.setColorPath(reader.unitColor);

        exitScr = new ExitGUI(reader.exitData, 100, 200, 0);
        exitScr.setOrigScreen(SIZE_X, SIZE_Y);
        exitScr.setColorPath(reader.unitColor);

        menuScr = new MenuGUI(reader.arrow, 20, 0, 165, 0);
        menuScr.init();
        //menuScr.initMenu(reader.mainOption, reader.mainSelect,
        //        reader.mainText, reader.mainHelp);
        menuScr.setOrigScreen(SIZE_X, SIZE_Y);
        menuScr.setColorPath(reader.unitColor);
        
        credScr = new CreditGUI(reader.credit, 0, 0, 1);
        credScr.setOpacity(0.7);
        credScr.setColorPath(reader.unitColor);
        credScr.setOrigScreen(SIZE_X, SIZE_Y);

        keyScr = new KeyGUI(20, 0, 200, 1);
        keyScr.setColorPath(reader.unitColor);
        keyScr.setOrigScreen(SIZE_X, SIZE_Y);

        scrStart = true;
        
        column = 0;
    }

    /**
     * This function initializes some of the elements of the screen
     */
    @Override
    public void init() {
        initOptions();
        keyScr.init(reader.keyOption, reader.keyHelp);
        bgPic.update(scr_name, scr_index, scr_isApplet, scr_link);
        logoPic.init();
        exitScr.init();
    }

    /**
     * This function updates all the screens on an indexed basis
     * @param timePassed The amount of time passed between each screen
     */
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

    /**
     * This draws the screen to the window
     * @param g The Slick2D graphics object
     */
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

    /**
     * This draws the screens to the window
     * @param g The Java2D graphics object
     * @param dthis The Java2D component object
     */
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

    /**
     * This contains all the updates for the title screen
     */
    private void titleScr(){
        if(scrStart){
            logoPic.setFinalPosition(0, 145, 30);
            logoPic.setFinalPosition(2, 0, 460);
            logoPic.setScrollText();
            logoPic.setHelpText(reader.startHelp[0]);
            logoPic.setColor(menuColor);
            logoPic.setCounter(WAIT_TIME*8);
            titleScr.setColor(menuColor);
            menuScr.setCurFaction(menuColor);
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

    /**
     * This contains all the updates for the main menu screen
     */
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

    /**
     * This contains all the updates for the exit screen
     */
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

    /**
     * This contains all the updates for the credit screen
     */
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

    /**
     * This contains all the updates for the key configure screen
     */
    private void keyScr(){
        if(scrStart){
            logoPic.setFinalPosition(0, 145, 30);
            logoPic.setFinalPosition(2, 0, 480);
            logoPic.setHelpText(keyScr.getHelpText());
            logoPic.setScrollText(keyScr.getScrollText());
            logoPic.setCounter(WAIT_TIME);
            keyScr.setColor(menuColor);
            scrStart = false;
        }

        if(keyScr.getMenuChange()){
            logoPic.setHelpText(keyScr.getHelpText());
            if(!menuHelp)
                logoPic.setFinalPosition(3, 0, -20);
            logoPic.setCounter(WAIT_TIME);

            logoPic.setFinalPosition(2, 0, 480);
            if(keyScr.getScrollDisplay())
                logoPic.setFinalPosition(2, 0, 460);
        }      

        keyScr.update(scr_width, scr_height, scr_sysTime, scr_mouseScroll);
        current = keyScr.control(column, scr_mouseScroll);
    }

    /**
     * This function is used to hide the help bar, and update the colors
     * @param mult Multiplies the wait time by this amount for specific
     * screens
     */
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

    /**
     * This function gets all the options created by the user and
     * applies then to the frame. This does not apply to applets.
     */
    private void initOptions(){
        option = new OptionHandler("data","options.xml");
        if(!scr_isApplet && option.exists()){
            option.loadOptions();
            titleScr.setHelp(option.getOptions().help == 1);
            menuHelp = !titleScr.getHelp();
            menuColor = option.getOptions().color;
            curColor = menuColor;
            menuScr.setMenuColumn(option.getOptions().column);
        }else{
            menuColor = MENU_COLOR;
            curColor = MENU_COLOR;
        }
    }

    /**
     * This function is used to save all the options you set. Only done
     * when exiting the game and if it isn't an applet.
     */
    @Override
    public void scr_close() {
        if(!scr_isApplet)
            option.storeValues(menuHelp, menuColor, menuScr.getMenuColumn());
    }
}
