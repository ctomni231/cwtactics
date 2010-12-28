package com.client.model.object;

import com.cwt.model.mapObjects.Player;
import java.util.ArrayList;

/**
 * Holds a team with players, which 
 * are members of this team.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class Team {

	/*
	 * VARIABLES 
	 * *********
	 */
	
	private ArrayList<Player> players;

	
	
	/* 
	 * CONSTRUCTORS 
	 * ************ 
	 */

	public Team() {
		players = new ArrayList<Player>();
		players.trimToSize();
	}

	
	
	/*
	 * ACCESSING METHODS 
	 * ***************** 
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
	 * WORK METHODS 
	 * ************
	 */

	public boolean isInTeam(Player player) {
		if (players.contains(player)) return true;
		else return false;
	}
	
	public boolean isAlive(){
		if( players.size() == 0 ) return false;
		else return true;
	}
	
	
	
	/*
	 * OUTPUT METHODS
	 * **************
	 */

	public String toString(){
		String s = "Team has "+players.size()+" members : ";
		for( Player p : players ){
			s += p.getName()+";";
		}
		return s;
	}
}
