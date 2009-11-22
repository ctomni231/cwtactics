package com.client.state;

import com.client.logic.status.Status;
import com.client.menu.GUI.MapDraw;
import com.client.model.object.Game;

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

    
    
    /*
     * 
     * CONSTRUCTORS
     * ************
     * 
     */
    
    public InGameState(){
        tileBase = 32;
    }

    @Override
    public void init() {
        newMap = new MapDraw(Game.getMap(), 10, 10, 0);
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

    	// update graphic system
        newMap.update();

        // react on input in the correct way 
    	Status.update(timePassed, newMap);

        // update scroll action
        updateScroll();
    }

    /**
     * Updates scroll system
     */
    private void updateScroll(){
    	
    	if(scr_mouseScroll != 0){
            if(scr_mouseScroll > 0)
                tileBase += 2;
            else
                tileBase -= 2;
            System.out.println("CURRENT TileBase: "+tileBase);
            newMap.changeScale(tileBase);
        }
    }
    

}
