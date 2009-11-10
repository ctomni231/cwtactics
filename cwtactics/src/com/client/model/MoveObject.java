package com.client.model;


public class MoveObject {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private int 	needFuel;
	private boolean moveable;
	

	
	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public MoveObject(){
		this.needFuel = -1;
	}

	
	
	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */
	
	public int getFuel(){ 
		return needFuel; 
	}
	
	public boolean isMoveable(){ 
		return moveable; 
	}
	
	public void setFuel( int value ){
		this.needFuel = value;
	}
	
	public void setMoveable( boolean value ){
		this.moveable = value;
	}
	
	
	
	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */
	
	
	
}

