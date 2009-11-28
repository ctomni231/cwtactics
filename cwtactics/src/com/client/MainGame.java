package com.client;

import com.client.logic.command.MessageServer;
import com.client.logic.command.commands.ingame.*;
import com.client.logic.status.Status;
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
    	
    	// TEST SECTION
    	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    	
    	// load modification
    	new ModReader("data/Misc.xml");
    	new ModReader("data/MoveTables.xml");
    	new ModReader("data/Tiles.xml");
    	new ModReader("data/Units.xml");
    	new ModReader("data/Buttons.xml");
    	new ScriptReader("data/Scripts.xml");
    	
    	MessageServer.setMode( ID.MessageMode.LOCAL );
    	
    	// output some test information from database
    	System.out.println("Mod     : "+Data.getName());
    	System.out.println("Author  : "+Data.getAuthor());
    	System.out.println("Version : "+Data.getVersion());
    
    	System.out.println( Data.getTileSheet( Data.getIntegerID("FACTORY") ).getFunds( Data.getRessourceSheet( Data.getIntegerID("RESSOURCE_0"))) );
    	System.out.println( Data.getUnitSheet( Data.getIntegerID("LTANK") ).getCost( Data.getRessourceSheet( Data.getIntegerID("RESSOURCE_0"))) );
    	
    	Weather.setWeather( Data.getWeatherSheet( 0 ));
    	
    	Map map = new Map(30, 20);
    	Team t = new Team();
    	Player p = new Player( "Alex", t );
    	Game.addPlayer(p);
    	t.addMember(p);
    	for( int i = 0; i < map.getSizeX() ; i++ ){    		
    		for( int j = 0 ; j < map.getSizeY() ; j++ ){
    			if( (i == 5 && j == 5) ||
    				 (i == 5 && j == 4) ||
    				  (i == 9 && j == 6) ||
    				   (i == 7 && j == 7) ||
    					(i == 1 && j == 8)    ){
    				
    				
    				if( (i == 9 && j == 6) ){
    					map.setTile( new Tile( Data.getTileSheet( Data.getIntegerID("FACTORY")), i, j, 0, null), i, j);
    				}else{
    					map.setTile( new Tile( Data.getTileSheet( Data.getIntegerID("FOREST")), i, j, 0, null), i, j);
    				}
    				if( (i == 5 && j == 5) ){
    					Unit unit = new Unit( Data.getUnitSheet( Data.getIntegerID("MECH")) , p );
    					map.getTile(i,j).setUnit( unit );
    					p.addUnit(unit);
    				}
    				
    			}
    			else map.setTile( new Tile( Data.getTileSheet( Data.getIntegerID("PLAIN")), i, j, 0, null), i, j);
    		}
    	}
    	
    	MessageServer.toCommandList( new TestCommand(p) , false );
        Game.setMap(map);
        Status.setStatus( Status.Mode.WAIT );
        
        //ScriptFactory.printDatabase();
        
    	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
