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
	
	

	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	static{
		players	= new ArrayList<Player>();
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
	
	
	
	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */

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

