package com.client;

import com.client.logic.command.MessageServer;
import com.client.logic.status.Status;
import com.client.model.Fight;
import com.client.model.Fog;
import com.client.model.Instance;
import com.client.model.Turn;
import com.client.model.Weather;
import com.client.model.object.Game;
import com.client.model.object.Map;
import com.client.model.object.Player;
import com.client.model.object.Team;
import com.client.model.object.Tile;
import com.client.model.object.Unit;

import com.client.state.InGameState;
import com.client.state.MainMenuState;
import com.client.state.SlickGame;
import com.system.ID;
import com.system.data.Data;
import com.system.data.script.ScriptFactory;
import com.system.data.script.ScriptLogic;


import com.system.log.Logger;
import com.system.reader.LanguageReader;
import com.system.reader.ModReader;
import com.system.reader.ScriptReader;

import org.newdawn.slick.AppGameContainer;
import org.newdawn.slick.SlickException;
import org.newdawn.slick.state.StateBasedGame;

/**
 * This handles displaying the game on the screen
 * @author Crecen
 */
public class MainGame {
	
    public static String GAME_TITLE = "Custom Wars Tactics Pre-Alpha 1.1";
    
    //The target frames per second for this game
    public static int GAME_TARGET_FPS = 0;
    //The target frames for second for the system timer
    public static int TIMER_FPS = 10;


    public static void main(String args[]){
    	
    	// setup logger
    	Logger.setMode( Logger.Mode.CONSOLE );
    	Logger.setOn();
    	
    	// setup logic
    	setupLogic();

    	// start a test game
    	initializeTestGame();
    	
    	// start graphic engine
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
    	new ScriptReader("data/damage.xml");
    	new ScriptReader("data/Scripts.xml");
    	new LanguageReader("data/language.xml");
    	
    	// set message server mode
    	MessageServer.setMode( ID.MessageMode.LOCAL );
    	
    	// output some test information from database
    	System.out.println("Mod     : "+Data.getName());
    	System.out.println("Author  : "+Data.getAuthor());
    	System.out.println("Version : "+Data.getVersion());
    
    	Weather.setWeather( Data.getWeatherSheet( "SUN" ));
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
    					Tile tile =  new Tile( Data.getTileSheet( "FACTORY" ) , i, j, 0, null);
    					map.setTile( tile , i, j);
    					tile.setOwner(p);
    					p.addProperty(tile);
    				}
    				else if( (i == 1 && j == 8) ){
    					Tile tile =  new Tile( Data.getTileSheet( "FACTORY" ) , i, j, 0, null);
    					map.setTile( tile , i, j);
    					tile.setOwner(p2);
    					p2.addProperty(tile);
    				}
    				else if( (i == 5 && j == 5) ){
    					Tile tile =  new Tile( Data.getTileSheet( "FACTORY" ) , i, j, 0, null);
    					map.setTile( tile , i, j);
    					tile.setOwner(p3);
    					p3.addProperty(tile);
    				}
    				else{
    					map.setTile( new Tile( Data.getTileSheet( "FOREST" ), i, j, 0, null), i, j);
    				}
    				
    			}
    			else map.setTile( new Tile( Data.getTileSheet( "PLAIN" ), i, j, 0, null), i, j);
    		}
    	}
    	

    	Tile a = new Tile( Data.getTileSheet("PLAIN"),0,0,0,null);
    	Tile b = new Tile( Data.getTileSheet("STREET"),0,0,0,null);
    	Unit ua = new Unit(Data.getUnitSheet("INFANTRY"),p);
    	Unit ub = new Unit(Data.getUnitSheet("INFANTRY"),p3);
    	a.setUnit(ua);
    	b.setUnit(ub);
    	
    	p.changeResource( 0 , 100000 );
    	
        Game.setMap(map);
        Fog.noFog(false);
        Status.setStatus( Status.Mode.WAIT );
        Turn.startTurn( Game.getNextPlayer() );

    	Fight.battle(a, ua, ua.sheet().getWeapon(0) , b , ub);
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
