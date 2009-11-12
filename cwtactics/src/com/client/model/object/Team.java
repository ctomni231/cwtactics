package com.client.model.object;

import java.util.ArrayList;

public class Team {

	/*
	 * 
	 * VARIABLES 
	 * *********
	 * 
	 */
	
	private ArrayList<Player> players;

	
	
	/*
	 * 
	 * CONSTRUCTORS 
	 * ************
	 * 
	 */

	public Team() {
		players = new ArrayList<Player>();
		players.trimToSize();
	}

	
	
	/*
	 * 
	 * ACCESSING METHODS 
	 * *****************
	 * 
	 */
	
	public void addMember( Player player ){
		if( player != null && !players.contains(player) ) players.add(player);
	}
	
	public void removeMember( Player player ){
		if( player != null && players.contains(player) ) players.remove(player);
	}
	
	public ArrayList<Player> getMembers(){
		return players;
	}

	
	
	/*
	 * 
	 * WORK METHODS 
	 * ************
	 * 
	 */

	public boolean isInTeam(Player player) {
		if (players.contains(player)) return true;
		else return false;
	}
	
	public boolean isAlive(){
		if( players.size() == 0 ) return false;
		else return true;
	}

}
