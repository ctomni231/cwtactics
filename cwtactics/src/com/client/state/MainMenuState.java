package com.client.state;

import com.client.logic.input.Controls;
import com.client.menu.GUI.BGPicture;
import com.client.menu.GUI.LogoDraw;

import com.client.state.mini.ExitMiniScr;
import com.client.state.mini.MenuMiniScr;
import com.client.state.mini.TitleMiniScr;
import com.client.tools.TextImgLibrary;
import org.newdawn.slick.Graphics;

/**
 *
 * @author Crecen
 */
public class MainMenuState extends SlickScreen {

    private final int BG_IMG = 14;
    private final String ALPHA = "resources/image/menu/smallAlpha.png";
    private final int COL_START = 0;

    private boolean scrSwitch;
    private int column;

    private TextImgLibrary txtLib;

    private BGPicture bgPicture;
    private LogoDraw menuLogo;
    private TitleMiniScr titleScr;
    private ExitMiniScr exitScr;
    private MenuMiniScr menuScr;

    public MainMenuState(){
        initText();
    }
    
    @Override
    public void init(){
        initBackground();

        titleScr = new TitleMiniScr(txtLib);
        exitScr = new ExitMiniScr(txtLib, scr_getContainer().getWidth(),
                scr_getContainer().getHeight());
        menuScr = new MenuMiniScr(txtLib, COL_START);
    }

    @Override
    public void update(int timePassed){
        if(Controls.isUpDown() ||
           Controls.isDownDown() ||
           Controls.isLeftDown() ||
           Controls.isRightDown())
                scr_mouseLock();

        switch(column){
            case 0:
                startScr();
                break;
            case -1:
            case 2:
                exitScr();
                break;
            default:
                menuScr();
        }
    }

    @Override
    public void render(Graphics g){
        bgPicture.render(g);

        if(scr_mouseLock)
            scr_mouseRelease();

        switch(column){
            case 0:
                startScr(g);
                break;
            case -1:
            case 2:
                exitScr(g);
                break;
            default:
                menuScr(g);
        }
        menuLogo.render(g);
    }

    public void startScr(){
        titleScr.column = column;
        titleScr.scrSwitch = scrSwitch;
        titleScr.menuLogo = menuLogo;
        titleScr.scr_sysTime = scr_sysTime;
        titleScr.update();
        menuLogo = titleScr.menuLogo;
        column = titleScr.column;
        scrSwitch = titleScr.scrSwitch;
    }
    public void startScr(Graphics g){
        titleScr.render(g);
    }

    public void exitScr(){
        exitScr.column = column;
        exitScr.scrSwitch = scrSwitch;
        exitScr.menuLogo = menuLogo;
        exitScr.scr_mouseLock = scr_mouseLock;
        exitScr.scr_mouseScroll = scr_mouseScroll;
        exitScr.scr_mouseX = scr_mouseX;
        exitScr.scr_mouseY = scr_mouseY;
        exitScr.scr_exit = scr_exit;
        exitScr.update();
        menuLogo = exitScr.menuLogo;
        column = exitScr.column;
        scrSwitch = exitScr.scrSwitch;
        scr_mouseLock = exitScr.scr_mouseLock;
        scr_exit = exitScr.scr_exit;
        if(exitScr.setLock)    scr_mouseLock();
    }
    public void exitScr(Graphics g){
        exitScr.render(g);
    }

    public void menuScr(){
        menuScr.column = column;
        menuScr.scrSwitch = scrSwitch;
        menuScr.menuLogo = menuLogo;
        menuScr.scr_mouseLock = scr_mouseLock;
        menuScr.scr_mouseScroll = scr_mouseScroll;
        menuScr.scr_mouseX = scr_mouseX;
        menuScr.scr_mouseY = scr_mouseY;
        menuScr.scr_scroll = scr_scroll;
        menuScr.update();
        menuLogo = menuScr.menuLogo;
        column = menuScr.column;
        scrSwitch = menuScr.scrSwitch;
        scr_mouseLock = menuScr.scr_mouseLock;
        scr_scroll = menuScr.scr_scroll;
        scr_scrollInd = menuScr.scr_scrollIndex;
        if(menuScr.setLock)    scr_mouseLock();
        scr_mouseControl(); //Makes sure you can scroll down and up
    }
    public void menuScr(Graphics g){
        menuScr.render(g);
    }  

    private void initBackground(){
        column = 0;
        scrSwitch = true;
        
        String[] allImages = new String[BG_IMG];
        for(int i = 0; i < BG_IMG; i++)
            allImages[i] = "resources/image/menu/background"+(i+1)+".png";
        bgPicture = new BGPicture(allImages, scr_getContainer().getWidth(),
                scr_getContainer().getHeight());

        menuLogo = new LogoDraw();
        menuLogo.addPictureLogo("resources/image/menu/cwTactics.png",
                145, -100, 350, 150, 1);
        menuLogo.addPictureLogo("resources/image/menu/cwLogo.gif",
                0, -100, 75, 75, 1);
        menuLogo.addScrollFontLogo(" - ", 0, 480, 640, 20, 1, 0.1);
        menuLogo.setShadowOffset(0, 2);
        menuLogo.setShadowOffset(1, 2);
    }

    private void initText(){
        txtLib = new TextImgLibrary();
        txtLib.addImage(ALPHA);
        txtLib.addAllCapitalLetters(txtLib.getImage(0), "", 6, 5, 0);
        txtLib.addLetter('-', txtLib.getImage(0), "", 6, 5, 29);
        txtLib.addLetter('\'', txtLib.getImage(0), "", 6, 5, 28);
        txtLib.addLetter(',', txtLib.getImage(0), "", 6, 5, 27);
        txtLib.addLetter('.', txtLib.getImage(0), "", 6, 5, 26);
    }

    //This is to quickly switch screens using F1 and F2 for testing
    @Override
    public void keyPressed(int key, char c) {
        if(key == 59 )
            scr_switch.add(scr_ID-1);
        else if(key == 60 )
            scr_switch.add(scr_ID+1);
    }
}
