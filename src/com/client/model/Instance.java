package com.client.model;

import java.util.ArrayList;
import com.cwt.model.mapObjects.Player;

/**
 * Holds all players that are controlled
 * by this client. 
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class Instance {

	// player in focus for this instance ( needed by fog system )
	private static Player curPlayer;
	
	// all players of this engine instance ( needed for networking )
	private static ArrayList<Player> playerStack = new ArrayList<Player>();
	
	/**
	 * Is the player an instance of this computer client ?
	 */
	public static boolean instanceOfClient( Player pl ){
		if( playerStack.indexOf(pl) != -1 ) return true;
		return false;
	}
	
	/**
	 * Adds a player to this client.
	 */
	public static void toStack( Player pl ){
		playerStack.add(pl);
	}
	
	/**
	 * Removes a player from client.
	 */
	public static void removeFromStack( Player pl ){
		if( instanceOfClient(pl) ) playerStack.remove(pl);
		else System.err.println("Player isn't an instance of this client.");
	}

	/**
	 * Clear all players from client.
	 */
	public static void clearStack(){
		playerStack.clear();
	}

	/**
	 * Sets current player of this client.
	 */
	public static void setCurPlayer(Player curPlayer) {
		Instance.curPlayer = curPlayer;
	}

	/**
	 * Returns current player of this client.
	 */
	public static Player getCurPlayer() {
		return curPlayer;
	}
}

