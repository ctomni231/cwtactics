package com.cwt.system.jslix;

import com.cwt.system.jslix.state.Screen;
import com.cwt.system.jslix.state.TestScreen;
import com.cwt.system.jslix.tools.Timer;
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
 * @version 12.17.11
 */

public class SlixGame extends BasicGame{

    /**
     * This function is the primary function for displaying a Slick2D
     * applet to the screen. It can also be used as a runnable to display
     * a fixed Slick window that has an accurate length and width. The
     * CanvasGameContainer in JSlix Frames length and width are not
     * accurate in visuals.
     * @param args No arguments available
     */
    public static void main( String[] args ) {
        try{ 
            AppGameContainer app = new AppGameContainer(new SlixGame());
            app.setDisplayMode( 500, 500, false );
            app.start();
        } catch ( SlickException e ) { 
            System.err.println(e);
        } 
    }

    //Can use this globally to time objects by system time
    public static Timer timer;
    //F8 to toggle the log messages visibility
    private final int LOG_KEY = 66;
    //F9 to toggle the frameRate visibility
    private final int FPS_KEY = 67;
    //F10 to toggle the full screen capabilities
    private final int FS_KEY = 68;
    //Controls whather log messages are visible or not
    private boolean showLog;
    //Holds the container used for this StateBasedGame
    private GameContainer contain;
    //Holds a temporary Screen representing a real Screen
    private Screen tempScreen;
    //Holds a variable so only the top screen displays
    private int scrStart;
    //Holds whether we need to clear the fram each time for Slick Window
    private boolean clear;

    /**
     * This class handles all visuals for Java2D Frame, Java2D Applet,
     * Slick2D Frame, and Slick2D Applet. This function initializes the
     * system Timer and loads all the screens for the class. The Slick
     * applet depends on this method.
     */
    public SlixGame(){
        super("JSlix");
        KeyPress.setConv(true);
        timer = new Timer(true);
        showLog = false;
        clear = true;
        load();
    }

    /**
     * This function loads all the different screens into the game. It must
     * be overridden for you to add in your own screens.
     */
    public void loadGame(){
        SlixLibrary.addFrameScreen(new TestScreen());
    }

    /**
     * The Slick2D initialization function for all Screens. Initializes
     * all the Screens in a window.
     * @param container The game container for this window
     * @throws SlickException Thrown if there is an error in Slick
     */
    @Override
    public void init(GameContainer container) throws SlickException {
        SlixLibrary.updateScreens();
        contain = container;
        contain.setClearEachFrame(clear);
        contain.setShowFPS(false);
    }

    /**
     * The Slick update function for all Screens. Initializes all the
     * Screens in a window
     * @param container The game container for this window
     * @param timePassed The amount of time passed per update
     * @throws SlickException Thrown if there is an error in Slick
     */
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
            if(i == 0)
                tempScreen.update(timePassed);

            if(!tempScreen.scr_link)
                break;
        }

        updateLog(container.getWidth(), container.getHeight());
    }

    /**
     * The Slick2D render function for all the Screens. This function
     * controls all rendering for each Screen
     * @param container The game container for this window
     * @param g The graphics object for Slick
     * @throws SlickException Thrown if there is an error in Slick
     */
    @Override
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
        }

        showLog(g);
        showRate(g);
    }

    /**
     * This function sets the redrawing of the Slick Screen
     * @param clear Whether the screen should redraw every frame(T) or not(F)
     */
    public void setUpdateFrame(boolean clear){
        this.clear = clear;
    }

    /**
     * This function toggles visibility of full screen display
     */
    public void setFullScreen(){
        if(SlixLibrary.isApplet())  return;
        if(contain.getWidth() != 800 && contain.getHeight() != 600){
            SlixLibrary.check();
            return;
        }
        try {
            contain.setFullscreen(!contain.isFullscreen());
        } catch (SlickException ex) {
            System.err.println(ex);
        }
    }

    /**
     * This function shows the frame rate graphics
     * @param g The Slick2D graphics object
     */
    private void showRate(Graphics g){
        if(contain.isShowingFPS()){
            g.setColor(Color.white);
            g.drawString("FPS: "+getFPS(), 0, contain.getHeight()-15);
        }
    }

    /**
     * This function updates the message log
     * @param w The current width of the window
     * @param h The current height of the window
     */
    private void updateLog(int w, int h){
        if(showLog)
            NotifyLibrary.update(w, h, timer.getTime());
    }
    /**
     * This function shows the message log in the graphics
     * @param g The Slick2D graphics object
     */
    private void showLog(Graphics g){
        if(showLog)
            NotifyLibrary.render(g);
    }

    /**
     * Handles the key press actions for Slick2D
     * @param key The key code for Slick
     * @param c The character associated with the key code
     */
    @Override
    public void keyPressed(int key, char c){
    	// if F9 is pressed, show FPS on screen
    	if(key == FPS_KEY) contain.setShowFPS(!contain.isShowingFPS());
        if(key == FS_KEY)  setFullScreen();
        if(key == LOG_KEY){
            showLog = !showLog;
            if(showLog) NotifyLibrary.addMessage();
        }
        KeyPress.addKeyPress(key, true);
    }

    /**
     * Handles the key release actions for Slick2D
     * @param key The key code for Slick
     * @param c The character associated with the key code
     */
    @Override
    public void keyReleased(int key, char c){
        KeyPress.removeKeyPress(key);
    }

    /**
     * Handles the mouse click actions for Slick2D
     * @param button The mouse button clicked
     * @param x The x-axis location of the mouse
     * @param y The y-axis location of the mouse
     */
    @Override
    public void mousePressed(int button, int x, int y){
        KeyPress.addMouseClick(button, true);
    }

    /**
     * Handles the mouse release actions for Slick2D
     * @param button The mouse button clicked
     * @param x The x-axis location of the mouse
     * @param y The y-axis location of the mouse
     */
    @Override
    public void mouseReleased(int button, int x, int y){
        KeyPress.removeMouseClick(button);
    }

    /**
     * This function handles the mouse movement for Slick2D
     * @param oldx The old mouse x-axis position
     * @param oldy The old mouse y-axis position
     * @param newx The new mouse x-axis position
     * @param newy The new mouse y-axis position
     */
    @Override
    public void mouseMoved(int oldx, int oldy, int newx, int newy){
        KeyPress.mouseX = newx;
        KeyPress.mouseY = newy;
        KeyPress.mouseScroll = 0;
    }

    /**
     * This function handles the mouse scroll wheel for Slick2D
     * @param newValue The value of the scroll wheel
     */
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
