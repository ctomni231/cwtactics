package com.client.state;

import com.client.logic.input.Controls;
import com.client.logic.status.Status;
import com.client.menu.GUI.MapDraw;
import com.client.menu.logic.Menu;
import com.client.model.object.Game;

import com.client.state.mini.ExitMiniScr;
import com.client.state.mini.GameMenuScr;
import com.client.tools.TextImgLibrary;
import com.system.reader.MenuReader;
import org.newdawn.slick.Graphics;

/**
 * InGameState.java
 *
 * This class starts up a Slick screen.
 *
 * @author Crecen
 */
public class InGameState extends SlickScreen{
	
	/*
	 * 
	 * VARIABLES
	 * *********
	 * 
	 */
	
    private MapDraw newMap;
    private int enterState;
    private int tileBase;

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
    
    public InGameState(){
        tileBase = 32;     
        column = 0;
        scrSwitch = true;
        reader = new MenuReader("data/gamemenu.xml");
        initText();
    }

    @Override
    public void init() {
        newMap = new MapDraw(Game.getMap(), 10, 10, 0);
        newMap.changeScale(tileBase);

        exitScr = new ExitMiniScr(txtLib, reader.getExitData(),
            scr_getContainer().getWidth(), scr_getContainer().getHeight(), 1);
        menuScr = new GameMenuScr(txtLib, reader.getMenuData(),
                reader.getArrow(), scr_getContainer().getWidth(),
                scr_getContainer().getHeight());
    }

    
    
   /*
    *
    * WORK METHODS
    * ************
    *
    */
    
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
        }
    }

    //This is to quickly switch screens using F1 and F2 for testing
    @Override
    public void keyPressed(int key, char c) {
        if(key == 59)
            enterState = (scr_ID-1);
        else if(key == 60)
            enterState = (scr_ID+1);
    }

    @Override
    /**
     * Updates the inGame logic after
     * a render call.
     */
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
        exitScr.scr_mouseX = scr_mouseX;
        exitScr.scr_mouseY = scr_mouseY;
        exitScr.scr_exit = scr_exit;
        exitScr.update();
        column = exitScr.column;
        scrSwitch = exitScr.scrSwitch;
        scr_mouseLock = exitScr.scr_mouseLock;
        scr_exit = exitScr.scr_exit;
        if(exitScr.setLock)    scr_mouseLock();
    }
    private void exitScr(Graphics g){
        exitScr.render(g);
    }

    private void mapScr(){
        if(scrSwitch){
            scr_scrollInd = 10;
            scrSwitch = false;
        }
        // update graphic system
        scr_scroll = newMap.update(scr_mouseX, scr_mouseY, scr_mouseScroll,
            scr_scroll, scr_mouseLock);
        //Helps with scrolling
        scr_mouseControl();

        if(Menu.getList().size() > 0 && column == 0){
            column = 2;
            scrSwitch = true;
        }
    }

    private void menuScr(){
        menuScr.column = column;
        menuScr.scrSwitch = scrSwitch;
        menuScr.scr_mouseLock = scr_mouseLock;
        menuScr.scr_mouseScroll = scr_mouseScroll;
        menuScr.scr_mouseX = scr_mouseX;
        menuScr.scr_mouseY = scr_mouseY;
        menuScr.scr_scroll = scr_scroll;
        menuScr.update(txtLib);
        column = menuScr.column;
        scrSwitch = menuScr.scrSwitch;
        scr_mouseLock = menuScr.scr_mouseLock;
        scr_scroll = menuScr.scr_scroll;
        scr_scrollInd = menuScr.scr_scrollIndex;
        if(menuScr.setLock)    scr_mouseLock();
        scr_mouseControl(); //Makes sure you can scroll down and up
    }
    private void menuScr(Graphics g){
        menuScr.render(g);
    }

    private void mainScr(){
        scr_switch.add(scr_ID-1);
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
			scr_switch.add( enterState );
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

        if(Controls.isUpDown() || Controls.isDownDown() ||
                Controls.isLeftDown() || Controls.isRightDown())
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
                mapScr();
        }
        
        if(column == 0){      	
            // react on input in the correct way
            Status.update(timePassed, newMap);
        }

        // update scroll action
        updateScroll();
    }

    /**
     * Updates scroll system
     */
    private void updateScroll(){
    	
    	if(scr_mouseScroll != 0){
            if(scr_mouseScroll < 0)
                tileBase += 2;
            else
                tileBase -= 2;
            System.out.println("CURRENT TileBase: "+tileBase);
            newMap.changeScale(tileBase);
        }
    }
}
