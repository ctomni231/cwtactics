package com.client;

import com.client.model.loading.ImgDataParser;
import com.client.state.InGameState;
import com.client.state.MainMenuState;
import com.client.state.SlickGame;
import com.system.data.Data;
import com.system.reader.ModReader;

import org.newdawn.slick.AppGameContainer;
import org.newdawn.slick.SlickException;
import org.newdawn.slick.state.StateBasedGame;

/**
 * This handles displaying the game on the screen
 * @author Crecen
 */
public class MainGame {
    public static String GAME_TITLE = "Custom Wars Tactics Pre-Alpha 1.0";
    
    //The target frames per second for this game
    public static int GAME_TARGET_FPS = 0;
    //The target frames for second for the system timer
    public static int TIMER_FPS = 10;


    public static void main(String args[]){
    	
    	// load modification
    	new ModReader("data/mod.xml");
    	
    	// output some test information from database
    	System.out.println("Mod     : "+Data.getName());
    	System.out.println("Author  : "+Data.getAuthor());
    	System.out.println("Version : "+Data.getVersion());
    	System.out.println( Data.getTileSheet( Data.getIntegerID("FACTORY") ).getFunds( Data.getRessourceSheet( Data.getIntegerID("RESSOURCE_0"))) );
    	System.out.println( Data.getUnitSheet( Data.getIntegerID("LTANK") ).getCost( Data.getRessourceSheet( Data.getIntegerID("RESSOURCE_0"))) );

        ImgDataParser.init();

        //This holds all the Screens
        //Create a new game with a title
        SlickGame slickFrame = new SlickGame(GAME_TITLE);
        //Adds timing functionality
        slickFrame.startTimer(TIMER_FPS);
        //-------------------------
        //Add new Screens here
        //-------------------------
        slickFrame.addScreen(new MainMenuState());
        slickFrame.addScreen(new InGameState());

        //Sets up a new Frame window
        MainGame game = new MainGame(slickFrame, 640, 480);
        //Sets the FPS: <=0 is default frameSpeed
        game.showSlickWindow(GAME_TARGET_FPS);
    }

    //The container used for this window
    private AppGameContainer container;

    //Creates a new Slick Window with the following parameters
    public MainGame(StateBasedGame game,
            int sizex, int sizey){
        try {
            //Create the container for the window
            container = new AppGameContainer(game);
            container.setDisplayMode(sizex, sizey, false);
            container.setAlwaysRender(false);
            container.setShowFPS(false);
            container.setForceExit(true);
            //Set up the screens for the window
            game.initStatesList(container);
        } catch (SlickException ex) {
            System.err.println(ex);
        }
    }

    //Shows a Slick window and sets the Frames per second
    public void showSlickWindow(int maxFPS){
        try {
            if(maxFPS > 0)
                container.setTargetFrameRate(maxFPS);
            container.start();
        } catch (SlickException ex) {
            System.err.println(ex);
        }
    }
}
