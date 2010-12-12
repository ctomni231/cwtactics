package com.client.state;

import com.jslix.tools.Timer;
import java.util.ArrayList;
import org.newdawn.slick.GameContainer;
import org.newdawn.slick.SlickException;
import org.newdawn.slick.state.StateBasedGame;

import com.system.input.Controls;

/**
 * Extends stateBasedGame. Sets up functionality for the button
 * and the states.
 *
 * You might want to consider putting user control functionality here
 *
 * @author Crecen
 */
public class SlickGame extends StateBasedGame{
	
	/*
	 * 
	 * VARIABLES
	 * *********
	 * 
	 */
    //F9 to toggle the frameRate visibility
    private final int FPS_KEY = 67;
    //Holds the container used for this StateBasedGame
    private GameContainer contain;
    //Holds states and gives them an ID equal to their index
    private ArrayList<SlickScreen> storedStates;
    //Can use this globally to time objects by system time
    public static Timer timer;

    /*
     * 
     * CONSTRUCTOR
     * ***********
     * 
     */
    
    /**
     * State ID's are handled within this class.
     * 
     * @param name
     */
    public SlickGame(String name){
        super(name);
        storedStates = new ArrayList<SlickScreen>();

    }

    public void startTimer(int updateTime){
        timer = new Timer(10);
    }
	/*
     * 
     * ACCESSING METHODS
     * *****************
     * 
     */
    
    /**
     * Adds a screen to the storedStates Array.
     * 
     * @param screen a slick state screen
     */
    public void addScreen(SlickScreen screen){
        if(screen != null){
            screen.scr_ID = storedStates.size();
            storedStates.add(screen);
        }
    }

       
    /*
     *
     * WORK METHODS
     * ************
     * 
     */
    
    @Override
    public void initStatesList(GameContainer container) throws SlickException {
        
    	// setup variables
    	contain 		= container;
    	Controls.setInput( container.getInput() );
    	
    	// setup game configurations
        container.setAlwaysRender(true);
        container.setVSync(false);
        
        //Stores the states to the class
        for(int i = 0; i < storedStates.size(); i++)
            addState(storedStates.get(i));
        if(storedStates.size() > 0) enterState(0);
    }
    

    
    /*
     * 
     * INPUT METHODS
     * *************
     * 
     */
    
    @Override
    public void keyPressed(int key, char c){       
    	// if F9 is pressed, show FPS on screen
    	if(key == FPS_KEY) contain.setShowFPS(!contain.isShowingFPS());
        getState(getCurrentStateID()).keyPressed(key, c);
    }

    @Override
    public void mouseWheelMoved(int newValue){
        //Changes it to a single integer
        newValue /= -120;
        getState(getCurrentStateID()).mouseWheelMoved(newValue);
    }
}
