package com.client.model;

/**
 * Help object for class Move.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class MoveObject {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private int 	needFuel;
	private boolean moveable;
	

	
	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public MoveObject(){
		this.needFuel = -1;
		this.moveable = true;
	}

	
	
	/*
	 * ACCESS METHODS
	 * ************** 
	 */
	
	/**
	 * Returns the needed fuel.
	 */
	public int getFuel(){ 
		return needFuel; 
	}
	
	/**
	 * Can you move onto this tile ?
	 */
	public boolean isMoveable(){ 
		return moveable; 
	}
	
	/**
	 * Sets the needed fuel.
	 */
	public void setFuel( int value ){
		this.needFuel = value;
	}
	 
	/**
	 * Sets the move able status.
	 */
	public void setMoveable( boolean value ){
		this.moveable = value;
	}
}

