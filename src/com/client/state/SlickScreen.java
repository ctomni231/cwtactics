package com.client.state;

import com.system.error.Empty_Exception;
import com.system.error.Invoke_Exception;
import com.system.error.NoSuchMethod_Exception;
import com.system.log.Logger;
import com.system.network.MessageServer;

import java.util.ArrayList;
import org.newdawn.slick.Color;
import org.newdawn.slick.GameContainer;
import org.newdawn.slick.Graphics;
import org.newdawn.slick.SlickException;
import org.newdawn.slick.state.BasicGameState;
import org.newdawn.slick.state.StateBasedGame;
import org.newdawn.slick.state.transition.FadeInTransition;

/**
 * This helps me when designing state functionality. This is
 * a BasicGameState that I will use for all Screens
 *
 * @author Crecen
 */
//scr_: stands for screen
public abstract class SlickScreen extends BasicGameState{
    //Holds the game associated with this state
    //private StateBasedGame scr_stateGame;
    //Holds the container associated with this state
    private GameContainer scr_container;
    //Guarantees each screen has a separate ID
    public int scr_ID = 0;
    //Used to switch screens internally.
    public ArrayList<Integer> scr_switch = new ArrayList<Integer>();
    //Used to change the transition color
    public Color scr_Transition = Color.black;
    //Used to change the transion time
    public int scr_transTime = 250;
    //The systemTime for this screen
    public int scr_sysTime = 0;
    //Gives a screen the current x-location of the mouse
    public int scr_mouseX = 0;
    //Gives a screen the current y-location of the mouse
    public int scr_mouseY = 0;
    //Gives a screen the current clicks of the scrolling wheel
    public int scr_mouseScroll = 0;
    //Tells a screen whether the mouse has focus or not
    public boolean scr_mouseFocus = false;
    //Mouse helper functions
    //Mouse does not register commands if within the x vicinity of this
    public int scr_lockx = -1000;
    //Mouse does not register commands if within the y vicinity of this
    public int scr_locky = -1000;
    //Controls whether mouse movements are registered within screens
    public boolean scr_mouseLock = false;
    //Controls how often a mouse is able to effect menu actions
    public boolean scr_scroll = false;
    //This sets the control of scrolling to system time
    public boolean scr_scrollWatch = false;
    //How quick a user is able to scroll, the higher the number the quicker
    public int scr_scrollInd = 2;
    //Allows a screen to force exit
    public boolean scr_exit = false;

    public final void init(GameContainer contain,
            StateBasedGame game) throws SlickException {
        //scr_stateGame = game;
        scr_container = contain;
        init();
    }

    public final void render(GameContainer container,
            StateBasedGame game, Graphics g) throws SlickException {
        render(g);
    }
    
    public final void update(GameContainer container,  StateBasedGame game, int timePassed) throws SlickException {
    	      
        scr_sysTime = SlickGame.timer.getTime();

    	// check the command stack and return if a command is done
        if( scr_checkCommands() ) return;
        
        update(timePassed);
        
        //This switches screens internally
        if(scr_switch.size() > 0){
            int check = scr_switch.get(0);
            if(check >= 0 && check < game.getStateCount())
                game.enterState(scr_switch.get(0), null,
                    new FadeInTransition(scr_Transition, scr_transTime));
            scr_switch.clear();
        }
        if(scr_exit)
            container.exit(); 
        scr_mouseScroll = 0;
    }

    //Simplified init function
    public abstract void init();

    //Simplified render function
    public abstract void render(Graphics g);

    //Simplified update function
    public abstract void update(int timePassed);

    public GameContainer scr_getContainer(){
        return scr_container;
    }

    //Prevents mouse actions from being accepted
    public void scr_mouseLock(){
        scr_lockx = scr_mouseX;
        scr_locky = scr_mouseY;
        scr_mouseLock = true;
    }

    //Allows mouse actions to be accepted
    public void scr_mouseRelease(){
        if(scr_mouseX > scr_lockx+5 || scr_mouseX < scr_lockx-5 ||
                scr_mouseY > scr_locky+5 || scr_mouseY < scr_locky-5)
            scr_mouseLock = false;
    }

    //Helps handle controlled scrolling within the screen
    public void scr_mouseControl(){
        if(!scr_scroll){
            for(int i = 0; i < scr_scrollInd; i++){
                if(scr_sysTime > (1000/scr_scrollInd)*i &&
                        scr_sysTime < (1000/scr_scrollInd)*(i+1)){
                    if(scr_scrollWatch && scr_sysTime >
                            ((1000/scr_scrollInd)*(i+1))-
                            (1000/(2*scr_scrollInd))){
                        scr_scroll = true;
                        scr_scrollWatch = false;
                    }else if(!scr_scrollWatch && scr_sysTime <=
                            ((1000/scr_scrollInd)*(i+1))-
                            (1000/(2*scr_scrollInd))){
                        scr_scroll = true;
                        scr_scrollWatch = true;
                    }
                }
            }
        }
    }

    /*
     *
     * INTERNAL METHODS
     *
     */

    /**
     * checks the command stack. If a command is
     * available , it will be done and after that the
     * current update cycle will closed.
     *
     */
    protected boolean scr_checkCommands(){
    	try{
            //TODO: commented out; causes errors
    		//MessageServer.doNextCommand();
    		return true; 
    	}
    	catch( Empty_Exception e ){ return false; }
    	catch( Invoke_Exception e ){ Logger.warn(e.toString()); return false; }
    	catch( NullPointerException e ){ Logger.warn(e.toString()); return false; }
    	catch( NoSuchMethod_Exception e ){ Logger.warn(e.toString()); return false; }
    	catch( IllegalArgumentException e ){ Logger.warn(e.toString()); return false; }
    }

    //Finalizes the ID, making sure there are no overlaps
    @Override
    public final int getID(){
        return scr_ID;
    }
    
    @Override
    public void keyPressed(int key, char c){
        scr_mouseFocus = false;
    }
    
    @Override
    public void mousePressed(int button, int x, int y){
        scr_mouseFocus = true;
    }

    @Override
    public void mouseMoved(int oldx, int oldy, int newx, int newy){
        scr_mouseX = newx;
        scr_mouseY = newy;
    }

    @Override
    public void mouseWheelMoved(int newValue){
        scr_mouseScroll = newValue;
    }

}
