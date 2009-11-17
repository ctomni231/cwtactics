package com.client.state;

import com.client.logic.input.Controls;
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
    private MapDraw newMap;
    private int enterState;
    private int tileBase;

    public InGameState(){
        tileBase = 32;
    }

    @Override
    public void init() {
        newMap = new MapDraw(Game.getMap(), 10, 10, 0);
    }

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



    /*
     *
     * WORK METHODS
     * ************
     *
     */

    @Override
    /**
     * Updates the inGame logic after
     * a render call.
     */
    public void update(int timePassed) {

    	if( checkupState( enterState ) ) return;

    	updateUI(timePassed);
    }

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

    /**
     * React on user inputs and changes logic
     * to fit with the user inputs.
     */
    private void updateUI( int timePassed ){

        newMap.update();
    	//if(Controls.isUpClicked() ||
    	//   Controls.isDownClicked() ||
    	//   Controls.isLeftClicked() ||
    	//   Controls.isRightClicked() ||
    	 //  Controls.isActionClicked() ||
    	//   Controls.isCancelClicked()){
        //    newMap.toggleGrid();
        //    System.out.println("GAME ACTION: ");
        //}

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
