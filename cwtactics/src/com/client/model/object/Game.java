package com.client.model.object;

import java.util.ArrayList;

import com.system.data.Data;

public class Game {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private static Map map;
	private static ArrayList<Player> players;
	private static ArrayList<Team> teams;
	private static int playerPointer;
	
	

	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	static{
		players	= new ArrayList<Player>();
		teams = new ArrayList<Team>();

		players.trimToSize();
		teams.trimToSize();
	}

	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */

	public static Map getMap() {
		return map;
	}

    public static int getCurrentPlayerID(){
        return playerPointer;
    }

	public static void setMap(Map map) {
		Game.map = map;
	}
	
	public static void addPlayer( Player player , Team team ){
		players.add(player);
		team.addMember(player);
	}
	
	@Deprecated
	public static void removePlayer( Player player ){
		players.remove(player);
	}
	
	public static Player getPlayer( int ID ){
		return players.get(ID);
	}
	
	public static ArrayList<Player> getPlayers(){
		return players;
	}
	
	public static int getPlayerID( Player player ){
		return players.indexOf(player);
	}
	
	public static void addTeam(){
		teams.add( new Team() );
	}

	public static Team getTeam ( int id ){
		if( id < 0 && id >= teams.size() ) return null;
		else return teams.get(id);
	}

	public static ArrayList<Team> getTeams(){
		return teams;
	}
	
	public static boolean isAllied( Player p1 , Player p2 ){
		if( p1.getTeam() == p2.getTeam() ) return true;
		else return false;
	}
	
	
	
	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */

	public static void clearGame(){
		
		players.clear();
		teams.clear();
		
		map = null;
		playerPointer = 0;
		
		players.trimToSize();
		teams.trimToSize();
	}

	public static Player getMaster(){
		
		// return first alive player, he is all time the master
		for( Player player : getPlayers() ){
			if( player.isAlive() ) return player;
		}
		
		// return null if all dead
		return null;
	}
	
	public static Player getNextPlayer(){
		
		// check game status
		if( !hasEnoughTeams() ){
			
			// the next player is the same as the current ? That's definitely an error
			System.err.println("Something goes wrong in Game, all next players are dead....");
			System.exit(1);
			return null;
		}
		
		return findNextPlayer();
	}
	
	public static boolean hasEnoughTeams(){
		
		int count = 0;
		for( Team t : teams ){
			
			// is that team alive, then increase counter
			if( t.isAlive() ) count++;
			
			// if two teams live, then the game can go on
			if( count == 2 ) return true;
		}
		
		// not enough teams live
		return false;
	}
	
	private static Player findNextPlayer(){
		
		// variables
		Player player = players.get(playerPointer);
		playerPointer++;
		if( playerPointer == players.size()) playerPointer = 0;	// resets automatically to zero if array list if it runs out of index
		
		// if not alive check next player in list
		if( !player.isAlive() ) return getNextPlayer();
		else return player;
	}
	
	public static boolean checkPlayerStatus( Player player ){
		
		//TODO implement checkMode, complete all logic!
		
		// has headquarters ?
		boolean hq = false;
		for( Tile tile : player.getProperties() ){
			if( tile.sheet().hasTag( Data.getIntegerTagID("HQ") ) ) hq = true; 
		}
		if( !hq ) return false;

		return true;
	}
	

	
	/*
	 *
	 * INTERNAL METHODS
	 * ****************
	 * 
	 */

	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */

}

