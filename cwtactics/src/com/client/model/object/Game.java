package com.client.model.object;

import java.util.ArrayList;

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

	public static void setMap(Map map) {
		Game.map = map;
	}
	
	public static void addPlayer( Player player ){
		players.add(player);
	}
	
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

	public static Player getNextPlayer(){
		
		// variables
		Player player = players.get(playerPointer);
		playerPointer++;
		if( playerPointer == players.size()) playerPointer = 0;	// resets automatically to zero if array list if it runs out of index
		
		// if not alive check next player in list
		if( !player.isAlive() ) return getNextPlayer();
		else return player;
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

