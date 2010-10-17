package com.client;

import java.util.logging.Level;

import com.client.library.CustomWars_Decoder;
import com.client.library.CustomWars_Encoder;
import com.client.library.CustomWars_Library;
import com.client.logic.status.Status;
import com.client.menu.GUI.tools.PixAnimate;
import com.client.model.*;
import com.client.model.object.*;

import com.client.state.InGameState;
import com.client.state.MainMenuState;
import com.client.state.SlickGame;
import com.system.data.Engine_Database;
import com.system.log.Logger;
import com.system.meowShell.Method_Database;
import com.system.meowShell.Script_Database;
import com.system.network.MessageServer;
import com.system.network.MessageServer.MessageMode;
import com.system.network.coder.MessageDecoder;
import com.system.network.coder.MessageEncoder;
import com.system.reader.LanguageReader;
import com.system.reader.MenuReader;
import com.system.reader.ModReader;
import com.system.reader.ScriptReader;
import com.system.sound.MusicFactory;
import com.system.sound.SoundLoader;

import org.newdawn.slick.AppGameContainer;
import org.newdawn.slick.SlickException;
import org.newdawn.slick.state.StateBasedGame;

/**
 * MainGame.java
 * 
 * This handles displaying the game on the screen.
 * 
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 8.1.2010
 */
public class MainGame {
	
    public static String GAME_TITLE = "Custom Wars Tactics Pre-Alpha 0.6";
    
    //The target frames per second for this game
    public static int GAME_TARGET_FPS = 60;
    //The target frames for second for the system timer
    public static int TIMER_FPS = 10;

    /**
     * The main class sets up a new Slick Game screen
     * @param args Arguments: N/A
     */
    public static void main(String args[]){
    	
    	Logger.setConsoleOutputOn();
    	Logger.stopOnLevel( Level.SEVERE );

        //TODO commented out; causes errors
    	//MessageEncoder.addEncoderMethods( CustomWars_Encoder.class);
    	//MessageDecoder.addDecoderMethods( CustomWars_Decoder.class);

    	// test, add script/message server database
    	MessageServer.addLibrary( CustomWars_Library.class );
    	Script_Database.addTrigger("TURN_START_UNITS");
    	Script_Database.addTrigger("TURN_START_TILES");
    	Script_Database.addTrigger("TURN_END_UNITS");
    	Script_Database.addTrigger("TURN_END_TILES");
    	Script_Database.addTrigger("BUILDING_CAPTURED");
    	Script_Database.addTrigger("UNIT_ATTACK");
    	Script_Database.addTrigger("UNIT_DEFEND");
    	Script_Database.addTrigger("UNIT_WILL_MOVE");
    	com.system.meowShell.Script_Database.addTrigger("VISION_UNIT");
    	Script_Database.addTrigger("MOVE_ONTO");
    	Script_Database.addTrigger("VISION_TILE");
    	(new ScriptReader("data/Scripts.tef")).parse();
    	(new ScriptReader("data/damage.tef")).parse();

        //JSR: Shut down of music for faster testing
		//MusicFactory.play( SoundLoader.loadMusicFile("SONG_LASH.ogg"));
    	
    	// SETUP LOGIC
    	setupLogic();
    	
    	// CREATE TEST GAME
    	initializeTestGame();
    	
    	// START GRAPHIC ENGINE
    	setupGraphicEngine();
    	
    }
    
    /**
     * Setups and starts graphic engine.
     */
    private static void setupGraphicEngine(){
    	
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
    
    /**
     * Setups logic and data core.
     */
    private static void setupLogic(){
    	
    	// load modification
    	new ModReader("data/Misc.xml");
    	new ModReader("data/MoveTables.xml");
    	new ModReader("data/weapons.xml");
    	new ModReader("data/Tiles.xml");
    	new ModReader("data/Units.xml");
    	new ModReader("data/Buttons.xml");
    	new LanguageReader("data/language.xml");

        MenuReader reader = new MenuReader("data/gamemenu.xml");
    	PixAnimate.init();
        PixAnimate.addBuildingChange(reader.getPropColorRef());
        PixAnimate.addUnitChange(reader.getUnitColorRef());
        PixAnimate.loadData();
        
    	// set message server mode
    	MessageServer.setMode( MessageMode.LOCAL );
    	
    	// output some test information from database
    	System.out.println("Mod     : "+Engine_Database.getName());
    	System.out.println("Author  : "+Engine_Database.getAuthor());
    	System.out.println("Version : "+Engine_Database.getVersion());
    
    	Weather.setWeather( Engine_Database.getWeatherSheet( "SUN" ));
    }
    
    /**
     * Create test game for testing ;D
     */
    private static void initializeTestGame(){
    	
    	Map map = new Map(50, 50);
    	Game.addTeam();
    	Game.addTeam();
    	Team t = Game.getTeam(0);
    	Team t2 = Game.getTeam(1);
    	Player p = new Player( "Alex", t );
    	Player p2 = new Player( "Alex2", t );
    	Player p3 = new Player( "Alex3", t2 );
    	Instance.toStack(p);
    	Instance.toStack(p2);
    	Instance.toStack(p3);
    	Game.addPlayer(p,t);
    	Game.addPlayer(p2,t);
    	Game.addPlayer(p3,t2);
    	
    	for( int i = 0; i < map.getSizeX() ; i++ ){    		
    		for( int j = 0 ; j < map.getSizeY() ; j++ ){
    			if( (i == 5 && j == 5) ||
    				 (i == 5 && j == 4) ||
    				  (i == 9 && j == 6) ||
    				   (i == 7 && j == 7) ||
    					(i == 1 && j == 8)    ){
    				
    				
    				if( (i == 9 && j == 6) ){
    					Tile tile =  new Tile( Engine_Database.getTileSheet( "FACTORY" ) , i, j, 0, null);
    					map.setTile( tile , i, j);
    					tile.setOwner(p);
    					p.addProperty(tile);
    				}
    				else if( (i == 1 && j == 8) ){
    					Tile tile =  new Tile( Engine_Database.getTileSheet( "FACTORY" ) , i, j, 0, null);
    					map.setTile( tile , i, j);
    					tile.setOwner(p2);
    					p2.addProperty(tile);
    				}
    				else if( (i == 5 && j == 5) ){
    					Tile tile =  new Tile( Engine_Database.getTileSheet( "FACTORY" ) , i, j, 0, null);
    					map.setTile( tile , i, j);
    					tile.setOwner(p3);
    					p3.addProperty(tile);
    				}
    				else{
    					map.setTile( new Tile( Engine_Database.getTileSheet( "FOREST" ), i, j, 0, null), i, j);
    				}
    				
    			}
    			else{
    				Tile ttt = new Tile( Engine_Database.getTileSheet( "PLAIN" ), i, j, 0, null) ;
    				map.setTile( ttt, i, j);
    			}
    		}
    	}

    	p.changeResource( 0 , 100000 );
    	
        Game.setMap(map);
        Fog.noFog(false);
        Status.setStatus( Status.Mode.WAIT );
        Turn.startTurn( Game.getNextPlayer() );
    }

    //The container used for this window
    private AppGameContainer container;

    /**
     * Creates a new Slick Window with the following parameters
     * @param game The game to be used with this window
     * @param sizex The width of the window
     * @param sizey The height of the window
     */
    public MainGame(StateBasedGame game,
            int sizex, int sizey){
        try {
            //Create the container for the window
            container = new AppGameContainer(game);
            container.setDisplayMode(sizex, sizey, false);
            container.setAlwaysRender(false);
            container.setShowFPS(false);
            container.setClearEachFrame(false);
            container.setForceExit(true);
            //Set up the screens for the window
            game.initStatesList(container);
        } catch (SlickException ex) {
            System.err.println(ex);
        }
    }

    /**
     * Shows a Slick window and sets the Frames per second
     * @param maxFPS The max Frames per second of this window
     */
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
