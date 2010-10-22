package com.client;

import com.jslix.system.Slix;

/**
 * JMainGame
 * 
 * Replaces MainGame but not working 100% to spec...
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 10.21.10
 */
public class JMainGame extends Slix{
	
	private static final long serialVersionUID = 2452945053572843636L;
	
	public static String GAME_TITLE = "Custom Wars Tactics Pre-Alpha 0.6";
    public final static int GAME_WIDTH = 640; //480, 640
    public final static int GAME_HEIGHT = 480; //320, 480

    /**
     * The main class for starting a Java2D Frame or a Slick Frame window
     * for the JSlix version of the game
     * @param argv Arguments: slick=Slick2D window, java=java2D window
     */
    public static void main(String[] argv) {
        JMainGame game = new JMainGame(GAME_WIDTH, GAME_HEIGHT);
        game.changeTitle(GAME_TITLE);
        game.changeFrameClear(false);
        
        if(argv.length > 0){
            if(argv[0].matches("java"))         game.showWindow();
            else if(argv[0].matches("slick"))   game.showSlick();
        }else
            game.showSlick();
    }

    /**
     * This class contains the data for creating Screens that use the
     * JSlix resizing screens for display.
     * @param width Starting width for the screen
     * @param height Starting height for the screen
     */
    public JMainGame(int width, int height){
        super(width, height);
        //SlixLibrary.removeFrameScreen(0);
        changeGame(new JSGMainGame());
    }
}