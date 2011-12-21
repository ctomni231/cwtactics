package com.cwt.screen;

import com.cwt.graphic.BackgroundHandler;
import com.cwt.graphic.CreditGUI;
import com.cwt.graphic.LogoHandler;
import com.cwt.graphic.TitleGUI;
import com.cwt.graphic.ExitGUI;
import com.cwt.graphic.MenuGUI;
import com.cwt.graphic.KeyGUI;
import com.cwt.graphic.tools.TextPix;
import com.cwt.io.OptionHandler;
import com.cwt.system.jslix.debug.MemoryTest;
import com.cwt.system.jslix.state.Screen;
import com.cwt.system.jslix.SlixLibrary;
import com.cwt.map.PixAnimate;
import com.cwt.io.XML_Reader;
import com.cwt.system.jslix.debug.MessageDebug;
import com.cwt.system.jslix.debug.OptionDebug;
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
 * @version 12.20.11
 */

public class MainMenuScreen extends Screen{

    //CHANGE THE STARTING MENU COLOR (0 - 18)
    private final int MENU_COLOR = -1;//The color of the menu items
    private final int SIZE_X = 640;//The base window height
    private final int SIZE_Y = 480;//The base window width
    private final int WAIT_TIME = 15;//The help bar waiting time

    private BackgroundHandler bgPic;//XML reader for the background
    private LogoHandler logoPic;//This holds all the moving logos
    private boolean menuHelp;//Holds whether help bar is locked to screen
    private OptionHandler option;//Loads and stores the user options
    private int helpCount;//Holds the scroll value of the help text position

    private TitleGUI titleScr;//Holds screen data for the title screen
    private ExitGUI exitScr;//Holds screen data for the exit screen
    private MenuGUI menuScr;//Holds screen data for the main menu
    private CreditGUI credScr;//Holds screen data for the credits
    private KeyGUI keyScr;//Holds screen data for the key configure
    private MenuGUI editScr;//Holds screen data for the map editor options

    private boolean scrStart;//The initialization sequence starter for screens
    private int column;//Which screen index we are currently showing
    private int current;//Used to update the screen index
    private int menuColor;//The current color of the menu items
    private int curColor;//Used to update the current color
    private String startHelp;//This stores the title screen help message
    private String mainText;//This stores the main menu text
    private String[][] entries;//Stores strings of entry location

    /**
     * This class contains all the elements that make up the title screen
     * of CWT. This function initializes all the screens.
     */
    public MainMenuScreen(){
        bgPic = new BackgroundHandler(scr_width, scr_height);

        XML_Reader.parse("data/faction.xml");
        String colorPath = XML_Reader.getAttribute(
                XML_Reader.getIndex("army color unit")[0], "small");
        String faction = XML_Reader.getAttribute(
                XML_Reader.getIndex("army faction")[0], "symbol");

        XML_Reader.parse("data/titlescreen.xml");
        XML_Reader.setLanguagePath(XML_Reader.getAttribute(
                XML_Reader.getIndex("menu lang")[0], "path"));
        TextPix.setTextPath(XML_Reader.getAttribute(XML_Reader.getIndex(
                "menu title")[0], "alpha"));
        TextPix.setNumPath(XML_Reader.getAttribute(XML_Reader.getIndex(
                "menu title")[0], "number"));

        logoPic = new LogoHandler(XML_Reader.getAttribute(XML_Reader.getIndex(
                "menu logo")[0], "help"), SIZE_X, SIZE_Y);
        logoPic.setColorPath(colorPath);
        startHelp = XML_Reader.convert(XML_Reader.getAttribute(
                XML_Reader.getIndex("menu title")[0], "help"));
        mainText = XML_Reader.convert(XML_Reader.getAttribute(
                XML_Reader.getIndex("menu screen")[0], "ID"));

        titleScr = new TitleGUI(220, 375, 0);
        titleScr.setOrigScreen(SIZE_X, SIZE_Y);
        titleScr.setShadowColor(Color.BLACK);
        titleScr.setShadowOffset(1);
        titleScr.setWords(XML_Reader.getAttribute(
                XML_Reader.getIndex("menu title")[0], "start"), 200, 20);
        titleScr.setColorPath(colorPath);

        int[] entryLocation = XML_Reader.getIndex("menu screen exit list");
        entries = new String[1][entryLocation.length];
        for(int i = 0; i < entryLocation.length; i++)
            entries[0][i] = XML_Reader.getAttribute(entryLocation[i], "text");
        exitScr = new ExitGUI(XML_Reader.convert(entries[0]), 100, 200, 0);
        exitScr.setOrigScreen(SIZE_X, SIZE_Y);
        exitScr.setColorPath(colorPath);

        entryLocation = XML_Reader.getIndex("menu screen main list");
        entries = new String[4][entryLocation.length];
        for(int i = 0; i < entryLocation.length; i++){
            entries[0][i] = XML_Reader.getAttribute(entryLocation[i], "item");
            entries[1][i] = XML_Reader.getAttribute(entryLocation[i], "id");
            entries[2][i] = XML_Reader.getAttribute(entryLocation[i], "text");
            entries[3][i] = XML_Reader.getAttribute(entryLocation[i], "help");
        }
        menuScr = new MenuGUI(XML_Reader.getAttribute(
                XML_Reader.getIndex("menu title")[0], "arrow"), 20, 0, 165, 0);
        //menuScr.init();
        menuScr.initMenu(XML_Reader.convert(entries[0]),
                XML_Reader.convert(entries[1]), XML_Reader.convert(entries[2]),
                XML_Reader.convert(entries[3]));
        menuScr.setOrigScreen(SIZE_X, SIZE_Y);
        menuScr.setColorPath(colorPath);

        entryLocation = XML_Reader.getIndex("menu screen edit list");
        entries = new String[4][entryLocation.length];
        for(int i = 0; i < entryLocation.length; i++){
            entries[0][i] = XML_Reader.getAttribute(entryLocation[i], "item");
            entries[1][i] = XML_Reader.getAttribute(entryLocation[i], "id");
            entries[2][i] = XML_Reader.getAttribute(entryLocation[i], "text");
            entries[3][i] = XML_Reader.getAttribute(entryLocation[i], "help");
        }
        editScr = new MenuGUI(XML_Reader.getAttribute(
                XML_Reader.getIndex("menu title")[0], "arrow"), 20, 0, 165, 0);
        editScr.initMenu(XML_Reader.convert(entries[0]),
                XML_Reader.convert(entries[1]), XML_Reader.convert(entries[2]),
                XML_Reader.convert(entries[3]));
        editScr.setOrigScreen(SIZE_X, SIZE_Y);
        editScr.setColorPath(colorPath);
        editScr.setPrevious(1);

        credScr = new CreditGUI(XML_Reader.getAttribute(
                XML_Reader.getIndex("menu title")[0], "credit"), 0, 0, 1);
        credScr.setOpacity(0.7);
        credScr.setColorPath(colorPath);
        credScr.setOrigScreen(SIZE_X, SIZE_Y);

        keyScr = new KeyGUI(XML_Reader.convert(XML_Reader.getAttribute(
                XML_Reader.getIndex("menu screen key")[0], "text")),
                20, 0, 200, 1);
        keyScr.setColorPath(colorPath);
        keyScr.setOrigScreen(SIZE_X, SIZE_Y);

        //Stores the initialization data below in the init() function
        entryLocation = XML_Reader.getIndex("menu screen key list");
        entries = new String[8][];
        for(int i = 0; i < entries.length; i++){
            entries[i] = (i < 2) ? new String[entryLocation.length] :
                new String[1];
        }
        for(int i = 0; i < entryLocation.length; i++){
            entries[0][i] = XML_Reader.getAttribute(entryLocation[i], "text");
            entries[1][i] = XML_Reader.getAttribute(entryLocation[i], "help");
        }
        entries[2][0] = XML_Reader.convert(XML_Reader.getAttribute(
                XML_Reader.getIndex("menu logo")[0], "title"));
        entries[3][0] = XML_Reader.convert(XML_Reader.getAttribute(
                XML_Reader.getIndex("menu logo")[0], "mini"));
        entries[4][0] = XML_Reader.convert(XML_Reader.getAttribute(
                XML_Reader.getIndex("menu logo")[0], "pic"));
        entries[5][0] = XML_Reader.convert(XML_Reader.getAttribute(
                XML_Reader.getIndex("menu title")[0], "copy"));
        entries[6][0] = XML_Reader.convert(XML_Reader.getAttribute(
                XML_Reader.getIndex("menu title")[0], "load"));
        entries[7][0] = faction;

        XML_Reader.clear();

        scrStart = true;

        column = 0;
    }

    /**
     * This function initializes some of the elements of the screen
     */
    @Override
    public void init() {
        initOptions();
        keyScr.init(XML_Reader.convert(entries[0]),
                XML_Reader.convert(entries[1]));
        bgPic.update(scr_name, scr_index, scr_isApplet, scr_link);
        logoPic.init(entries[2][0], entries[3][0], entries[4][0],
                entries[5][0], entries[6][0], entries[7][0]);
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
            case 5:
                //editScr();
                SlixLibrary.addFrameScreen(new MapEditorScreen());
                current = 1;
                break;
            case 6:
                SlixLibrary.addFrameScreen(new VersusGameScreen());
                current = 1;
                break;
            case -4:
            case -5:
                SlixLibrary.addFrameScreen(new MapEditorScreen());
                current = 5;
                break;
            case -3:
                SlixLibrary.addFrameScreen(new OptionDebug("Hello", "T", "F"));
                current = 1;
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
            //case 5:
                //editScr.render(g);
                //break;
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
            case 5:
                editScr.render(g, dthis);
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
            logoPic.setFinalPosition(4, 430, 480);
            logoPic.setFinalPosition(5, 5, 480);
            logoPic.setScrollText();
            logoPic.setHelpText(startHelp);
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
            logoPic.setFinalPosition(4, 430, 430);
            logoPic.setFinalPosition(5, 5, 438);
            menuScr.setColor(menuColor);
            logoPic.setHelpText(menuScr.getHelpText());
            logoPic.forceScrollText(menuScr.getScrollText());
            logoPic.setInfoText(mainText);
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

        if(!logoPic.getHelpText().equals(menuScr.getHelpText()))
            logoPic.setHelpText(menuScr.getHelpText());
        menuScr.update(scr_width, scr_height, scr_sysTime, scr_mouseScroll);
        current = menuScr.control(column, scr_mouseScroll);
        curColor = menuScr.getCurFaction();
    }

    /**
     * This contains all the updates for the main menu screen
     */
    private void editScr(){
        if(scrStart){
            logoPic.setFinalPosition(0, 145, 15);
            logoPic.setFinalPosition(1, 0, -150);
            logoPic.setFinalPosition(2, 0, 460);
            logoPic.setFinalPosition(4, 430, 430);
            logoPic.setFinalPosition(5, 5, 438);
            editScr.setColor(menuColor);
            logoPic.setHelpText(editScr.getHelpText());
            logoPic.forceScrollText(editScr.getScrollText());
            logoPic.setInfoText(menuScr.getOptionText(column));
            logoPic.setCounter(WAIT_TIME);
            editScr.setMenuColumn(menuScr.getMenuColumn());
            if(!menuHelp)
                logoPic.setFinalPosition(3, 0, -20);
            scrStart = false;
        }

        if(editScr.getMenuChange()){
            logoPic.forceScrollText(editScr.getScrollText());
            logoPic.setHelpText(editScr.getHelpText());
            if(!menuHelp)
                logoPic.setFinalPosition(3, 0, -20);
            logoPic.setCounter(WAIT_TIME);
        }
        editScr.update(scr_width, scr_height, scr_sysTime, scr_mouseScroll);
        current = editScr.control(column, scr_mouseScroll);
    }

    /**
     * This contains all the updates for the exit screen
     */
    private void exitScr(){
        if(scrStart){
            logoPic.setFinalPosition(0, 145, 50);
            logoPic.setFinalPosition(2, 0, 480);
            logoPic.setFinalPosition(4, 430, 450);
            logoPic.setFinalPosition(5, 5, 458);
            logoPic.setHelpText(exitScr.getHelpText());
            logoPic.setInfoText(menuScr.getOptionText(column));
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
            logoPic.setFinalPosition(4, 430, 480);
            logoPic.setFinalPosition(5, 5, 458);
            logoPic.setInfoText(menuScr.getOptionText(column));
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
            logoPic.setFinalPosition(2, 0, 460);
            logoPic.setFinalPosition(4, 430, 430);
            logoPic.setFinalPosition(5, 5, 438);
            logoPic.setHelpText(keyScr.getHelpText());
            logoPic.setScrollText(keyScr.getScrollText());
            logoPic.setInfoText(menuScr.getOptionText(column));
            logoPic.setCounter(WAIT_TIME);
            keyScr.setColor(menuColor);
            keyScr.getKeys();
            scrStart = false;
        }

        if(keyScr.getMenuChange()){
            logoPic.setScrollText(keyScr.getScrollText());
            logoPic.setHelpText(keyScr.getHelpText());
            if(!menuHelp)
                logoPic.setFinalPosition(3, 0, -20);
            logoPic.setCounter(WAIT_TIME);
            
            logoPic.setFinalPosition(2, 0,
                    keyScr.getScrollDisplay() ? 460 : 480);
            logoPic.setFinalPosition(4, 430,
                    keyScr.getScrollDisplay() ? 430 : 450);
            logoPic.setFinalPosition(5, 5,
                    keyScr.getScrollDisplay() ? 438 : 458);
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
            logoPic.setHelpText("");
            scrStart = true;
        }

        if(PixAnimate.isReady()){
            if(curColor != menuColor){
                logoPic.setLoadIcon(curColor);
                logoPic.setFactionCounter(WAIT_TIME);
            }
            logoPic.setFinalPosition(6, SIZE_X-helpCount, 0);
            logoPic.setLoadOpacity(0.9);
        }else
            logoPic.setFactionCounter(1);

        if(logoPic.isFactionVisible())
            helpCount = 20;          

        if(helpCount > 0)
            logoPic.setHelpJustify(helpCount--);

        if(curColor != menuColor){
            menuColor = curColor;
            logoPic.setColor(menuColor);
            exitScr.setColor(menuColor);
            titleScr.setColor(menuColor);
            menuScr.setColor(menuColor);
        }

        if(logoPic.checkHelp())
            logoPic.setCounter(WAIT_TIME*mult);

        if(!menuHelp)
            logoPic.setFinalPosition(3, 0, logoPic.getCounter() ? 0 : -20);
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
            menuHelp = true;
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
