package com.client.state;

import com.system.input.KeyControl;
import com.client.menu.GUI.MapDraw;
import com.client.model.object.Game;
import com.client.state.mini.ExitMiniScr;
import com.client.state.mini.GameMenuScr;
import com.jslix.tools.TextImgLibrary;
import com.jslix.state.Screen;
import com.jslix.system.KeyPress;
import com.jslix.system.SlixLibrary;
import com.system.reader.MenuReader;
import java.awt.Component;
import java.awt.Graphics2D;
import org.newdawn.slick.Graphics;

/**
 * InGame
 *
 * Replaces the old InGameState. Not going to work 100% for now, but it'll
 * be fairly close.
 *
 * @author Crecen
 */
public class InGame extends Screen {

    	/*
	 *
	 * VARIABLES
	 * *********
	 *
	 */

    private static MapDraw newMap;
    private int enterState;

    private MenuReader reader;
    private boolean scrSwitch;
    private int column;

    private TextImgLibrary txtLib;

    private ExitMiniScr exitScr;
    private GameMenuScr menuScr;

    /*
     *
     * CONSTRUCTORS
     * ************
     *
     */

    public InGame(){
        column = 0;
        scrSwitch = true;
        reader = new MenuReader("data/gamemenu.xml");
        initText();
    }

    @Override
    public void init() {
        newMap = new MapDraw(Game.getMap(), 10, 10, 0);

        exitScr = new ExitMiniScr(txtLib, reader.getExitData(),
            scr_width, scr_height, 1);
        menuScr = new GameMenuScr(txtLib, reader.getArrow(),
                scr_width, scr_height);
    }

    public static MapDraw getMap(){
    	return newMap;
    }

    @Override
    public void render(Graphics g) {
        newMap.render(g, scr_sysTime);

        // if scrSwitch, then internally the logic
        // updates menu or something similar, don't draw!
        if( scrSwitch ) return;

        switch(column){
            case 1:
                exitScr(g);
                break;
            case 2:
                menuScr(g);
                break;
            default:
                mapScr(g);
        }
    }

    @Override
    public void render(Graphics2D g, Component dthis) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void update(int timePassed) {
    	// checks change state
    	if( checkupState( enterState ) ) return;

    	updateUI(timePassed);
    }

    private void exitScr(){
        exitScr.column = column;
        exitScr.scrSwitch = scrSwitch;
        exitScr.scr_mouseLock = scr_mouseLock;
        exitScr.scr_mouseScroll = scr_mouseScroll;
        exitScr.scr_mouseX = KeyPress.getMouseX();
        exitScr.scr_mouseY = KeyPress.getMouseY();
        exitScr.scr_exit = scr_delete;
        exitScr.update();
        column = exitScr.column;
        scrSwitch = exitScr.scrSwitch;
        scr_mouseLock = exitScr.scr_mouseLock;
        scr_delete = exitScr.scr_exit;
        if(exitScr.setLock)    scr_mouseLock();
    }
    private void exitScr(Graphics g){
        exitScr.render(g);
    }

    private void menuScr(){
        if(scrSwitch){
            scrSwitch = false;
        }
        column = 0;
    }
    private void menuScr(Graphics g){
    }

    private void mapScr(int time){
        menuScr.column = column;
        menuScr.scrSwitch = scrSwitch;
        menuScr.scr_mouseLock = scr_mouseLock;
        menuScr.scr_mouseScroll = scr_mouseScroll;
        menuScr.scr_mouseX = KeyPress.getMouseX();
        menuScr.scr_mouseY = KeyPress.getMouseY();
        menuScr.scr_scroll = scr_scroll;
        menuScr.scr_sysTime = scr_sysTime;
        menuScr.mapScr = newMap;
        menuScr.update(txtLib, time);
        newMap = menuScr.mapScr;
        column = menuScr.column;
        scrSwitch = menuScr.scrSwitch;
        scr_mouseLock = menuScr.scr_mouseLock;
        scr_scroll = menuScr.scr_scroll;
        scr_scrollInd = menuScr.scr_scrollIndex;
        if(menuScr.setLock)    scr_mouseLock();
        scr_mouseControl(); //Makes sure you can scroll down and up
    }
    private void mapScr(Graphics g){
        menuScr.render(g);
    }

    private void mainScr(){
        SlixLibrary.bringScreenToFront(scr_index+1);
        column = 0;
        scrSwitch = true;
    }

    private void initText(){
        txtLib = new TextImgLibrary();
        txtLib.addImage(reader.getAlpha());
        txtLib.addAllCapitalLetters(txtLib.getImage(0), "", 6, 5, 0);
        txtLib.addLetter('-', txtLib.getImage(0), "", 6, 5, 29);
        txtLib.addLetter('\'', txtLib.getImage(0), "", 6, 5, 28);
        txtLib.addLetter(',', txtLib.getImage(0), "", 6, 5, 27);
        txtLib.addLetter('.', txtLib.getImage(0), "", 6, 5, 26);
    }

    /*
     *
     * INTERNAL METHODS
     * ****************
     *
     */

    /**
     * Checks the state variable and changes the state
     * if necessary.
     */
    private boolean checkupState( int state ){

		if( state != -1 ){
			SlixLibrary.bringScreenToFront( enterState );
			enterState = -1;
			return true;
		}
		return false;
	}



    /*
     *
     * UPDATE LOGIC METHODS
     * ********************
     *
     */

    /**
     * React on user inputs and changes logic
     * to fit with the user inputs.
     */
    private void updateUI( int timePassed ){

        if(KeyControl.isUpDown() || KeyControl.isDownDown() ||
                KeyControl.isLeftDown() || KeyControl.isRightDown())
            scr_mouseLock();

        if(scr_mouseLock)
            scr_mouseRelease();

        switch(column){
            case -1:
                mainScr();
                break;
            case 1:
                exitScr();
                break;
            case 2:
                menuScr();
                break;
            default:
                mapScr(timePassed);
        }
    }
}
