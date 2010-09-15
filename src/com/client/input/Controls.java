package com.client.input;

import org.newdawn.slick.Input;

import com.system.ID;
//import com.system.ID.Keys;

/**
 * Holds and controls all king of inputs
 * from user.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class Controls extends KeyControl{

	/*
	 * VARIABLES
	 * *********
	 */
	//private final static int MOUSE_ACTION = 0;
    //private final static int MOUSE_CANCEL = 1;
	private	static Input input;
		

	
	/*
	 * ACCESS METHODS
	 * **************
	 */
	
	/**
	 * Sets the input object of slick engine.
	 */
	public static void setInput( Input input ){
		Controls.input = input;
	}
	
	
	/**
	 * Is a button clicked ? 
	 */
	public static boolean isClicked( ID.Keys key ){
		if( input.isKeyPressed( key.value() ) )	return true;
		return false;
	}
	
	/**
	 * Is a button hold ?
	 */
	public static boolean isDown( ID.Keys key ){
		if( input.isKeyDown( key.value() ) )	return true;
		return false;
	}
	
	/**
	 * Is a mouse button clicked ? 
	 */
	public static boolean isClicked( int keyValue ){
		if( input.isMousePressed( keyValue ))	return true;
		return false;
	}
	
	/**
	 * Is a mouse button hold ? 
	 */
	public static boolean isDown( int keyValue ){
		if( input.isMouseButtonDown( keyValue ))return true;
		return false;
	}
	
	
	
	/*
	 * DIRECT ACCESS METHODS
	 * *********************
	 */
	
	// IS CLICKED
	//public static boolean isUpClicked(){ 		return isClicked( ID.Keys.UP ); }
	//public static boolean isDownClicked(){ 		return isClicked( ID.Keys.DOWN ); }
	//public static boolean isLeftClicked(){		return isClicked( ID.Keys.RIGHT ); }
	//public static boolean isRightClicked(){		return isClicked( ID.Keys.LEFT ); }
	//public static boolean isActionClicked(){	return (isClicked( ID.Keys.ENTER ) || isClicked(MOUSE_ACTION));}
	//public static boolean isCancelClicked(){	return (isClicked( ID.Keys.CANCEL ) || isClicked(MOUSE_CANCEL));}

	// IS DOWN
	//public static boolean isUpDown(){			return isDown( ID.Keys.UP );}
	//public static boolean isDownDown(){			return isDown( ID.Keys.DOWN );}
	//public static boolean isLeftDown(){			return isDown( ID.Keys.RIGHT );}
	//public static boolean isRightDown(){		return isDown( ID.Keys.LEFT );}
	//public static boolean isActionDown(){		return (isDown( ID.Keys.ENTER ) || isDown(MOUSE_ACTION));}
	//public static boolean isCancelDown(){		return (isDown( ID.Keys.CANCEL ) || isDown(MOUSE_CANCEL));}
}

