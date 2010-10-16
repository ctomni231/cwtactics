package com.jslix.system;

import com.jslix.state.Screen;
import com.jslix.state.TestScreen;
import com.jslix.tools.Timer;
import org.newdawn.slick.AppGameContainer;
import org.newdawn.slick.BasicGame;
import org.newdawn.slick.Color;
import org.newdawn.slick.GameContainer;
import org.newdawn.slick.Graphics;
import org.newdawn.slick.SlickException;

/**
 * SlixGame.java
 *
 * A shell game class that holds the Slick Applet and also controls
 * the screens for all Slick Frames and Applets
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.15.10
 */

//TODO: Finish commenting this class
public class SlixGame extends BasicGame{

    public static void main( String[] args ) {
        try{ 
            AppGameContainer app = new AppGameContainer(new SlixGame());
            app.setDisplayMode( 500, 500, false );
            app.start();
        } catch ( SlickException e ) { 
            e.printStackTrace(); 
        } 
    }

    //Can use this globally to time objects by system time
    public static Timer timer;
    //F9 to toggle the frameRate visibility
    private final int FPS_KEY = 67;
    //Holds the container used for this StateBasedGame
    private GameContainer contain;
    //Holds a temporary Screen representing a real Screen
    private Screen tempScreen;
    //Holds a variable so only the top screen displays
    private int scrStart;
    //Holds whether we need to clear the fram each time for Slick Window
    private boolean clear;

    //The slick applet won't work any other way sadly
    public SlixGame(){
        super("JSlix");
        KeyPress.setConv(true);
        timer = new Timer(true);
        clear = true;
        load();
    }

    //Override this function to load different Screens into the game
    public void loadGame(){
        SlixLibrary.addFrameScreen(new TestScreen());
    }
    
    @Override
    public void init(GameContainer container) throws SlickException {
        SlixLibrary.updateScreens();
        contain = container;
        contain.setClearEachFrame(clear);
        contain.setShowFPS(false);
    }

    @Override
    public void update(GameContainer container, int timePassed)
            throws SlickException {
        SlixLibrary.updateScreens();

        //Quits game when there are no more screens
        if(SlixLibrary.size() == 0){
            contain.exit();
            SlixLibrary.quit();
            return;
        }
        
        for(int i = 0; i < SlixLibrary.size(); i++){
            tempScreen = SlixLibrary.scrOrder.get(i);
            tempScreen.scr_mouseScroll = KeyPress.mouseScroll;
            tempScreen.scr_index = i;
            tempScreen.scr_width = container.getWidth();
            tempScreen.scr_height = container.getHeight();
            tempScreen.scr_sysTime = timer.getTime();
            tempScreen.update(timePassed);

            if(!tempScreen.scr_link)
                break;
        }
    }

    public void render(GameContainer container, Graphics g)
            throws SlickException {
        if(SlixLibrary.size() == 0) return;
        
        for(int i = 0; i < SlixLibrary.size(); i++){
            scrStart = i;
            tempScreen = SlixLibrary.scrOrder.get(i);

            if(!tempScreen.scr_link)
                break;
        }

        for(int i = scrStart; i >= 0; i--){
            tempScreen = SlixLibrary.scrOrder.get(i);
            tempScreen.render(g);
            tempScreen.scr_mouseScroll = 0;

            if(!tempScreen.scr_link)
                break;
        }

        showRate(g);
    }

    public void setUpdateFrame(boolean clear){
        this.clear = clear;
    }

    private void showRate(Graphics g){
        if(contain.isShowingFPS()){
            g.setColor(Color.white);
            g.drawString("FPS: "+getFPS(), 0, contain.getHeight()-15);
        }
    }

    @Override
    public void keyPressed(int key, char c){
    	// if F9 is pressed, show FPS on screen
    	if(key == FPS_KEY) contain.setShowFPS(!contain.isShowingFPS());
        KeyPress.addKeyPress(key, true);
    }

    @Override
    public void keyReleased(int key, char c){
        KeyPress.removeKeyPress(key);
    }

    @Override
    public void mousePressed(int button, int x, int y){
        KeyPress.addMouseClick(button, true);
    }

    @Override
    public void mouseReleased(int button, int x, int y){
        KeyPress.removeMouseClick(button);
    }

    @Override
    public void mouseMoved(int oldx, int oldy, int newx, int newy){
        KeyPress.mouseX = newx;
        KeyPress.mouseY = newy;
        KeyPress.mouseScroll = 0;
    }

    @Override
    public void mouseWheelMoved(int newValue){
        //Changes it to a single integer
        newValue /= -120;
        KeyPress.mouseScroll = newValue;
    }

    //------------------------------------------------------
    //TIMER FUNCTIONS
    //------------------------------------------------------
    
    /**
     * This starts the global timer to regulate animation
     * @param selfStart Whether to start the timers internal timekeeper
     */
    public void startTimer(boolean selfStart){
        timer = new Timer(selfStart);
    }

    /**
     * This sets how often the timer resets
     * @param updateTime How often the animation time updates
     */
    public void setFrameTime(int updateTime){
        timer.setFrameTime(updateTime);
    }

    /**
     * Gives you the update time for the Timer
     * @return the update time for the timer
     */
    public int getFrameTime(){
        return timer.getFrameTime();
    }

    /**
     * The amount of millisecs that elapsed per frame (1/1000)
     * @return millisecs of time
     */
    public int getTime(){
        return timer.getTime();
    }

    /**
     * Gets Java FPS time
     * @return Java FPS
     */
    public int getFPS(){
        return timer.getFPS();
    }

    /**
     * This is used to regulate the timer if internal timer isn't running
     */
    protected void setFrameRate(){
        timer.setFrameRate();
    }

    /**
     * Used to load games in the Slick Frame and Applets
     */
    private void load(){
        loadGame();
    }

}
