package com.client;

import com.client.library.CustomWars_Library;
import com.customwarsTactics.service.StatusController;
import com.client.menu.GUI.tools.PixAnimate;
import com.client.model.Fog;
import com.client.model.Instance;
import com.client.model.Turn;
import com.client.model.Weather;
import com.client.model.object.Game;
import com.client.model.object.Map;
import com.client.model.object.Player;
import com.client.model.object.Team;
import com.client.model.object.Tile;
import com.client.state.InGame;
import com.client.state.MainMenu;
import com.jslix.system.SlixGame;
import com.jslix.system.SlixLibrary;
import com.system.data.Engine_Database;
import com.system.log.Logger;
import com.system.meowShell.Script_Database;
import com.system.network.MessageServer;
import com.system.network.MessageServer.MessageMode;
import com.system.reader.LanguageReader;
import com.system.reader.MenuReader;
import com.system.reader.ModReader;
import com.system.reader.ScriptReader;
import java.util.logging.Level;
import org.newdawn.slick.AppGameContainer;
import org.newdawn.slick.SlickException;

/**
 * JSGMainGame
 *
 * The game class for the menu
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 09.15.10
 */
public class JSGMainGame extends SlixGame {

    /**
     * The main class for starting a Slick Applet or non-resizing Slick
     * window for the JSlix version of the game
     * @param args Arguments: N/A
     */
    public static void main(String[] args){
        try{
            JSGMainGame game = new JSGMainGame();
            game.setUpdateFrame(false);
            AppGameContainer app = new AppGameContainer(game);

            //YOU MAY SET NEW SIZE VALUES FOR THE APPLET HERE
            //Make sure you match them in the .html, or it won't work.
            app.setDisplayMode( 640, 480, false );
            app.start();
        } catch ( SlickException e ) {
            e.printStackTrace();
        }
    }

    /**
     * This loads the screens into the the JSlix version of the game
     */
    @Override
    public void loadGame(){
        setupLogic();
        initializeTestGame();
        //DO ALL YOUR INITIALIZATIONS FOR YOUR SCREENS HERE!!!
        SlixLibrary.addFrameScreen(new InGame());
        SlixLibrary.addFrameScreen(new MainMenu());
        
        //Make sure you use SlixLibrary to add the Screens
        //Also a good place to do all the initialzation stuff
    }

    /**
     * This function sets up the logic files and pulls all the information
     * from the XML database
     */
    private static void setupLogic(){

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

        //TODO JSR: Shut down of music for faster testing
		//MusicFactory.play( SoundLoader.loadMusicFile("SONG_LASH.ogg"));

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
     * This functions creates a new game with hard-coded parameters to be
     * used for testing purposes
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
        StatusController.setStatus( StatusController.Mode.WAIT );
        Turn.startTurn( Game.getNextPlayer() );
    }
}