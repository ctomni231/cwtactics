package com.system;

public interface ID {

	/*
	 * Keyboard values
	 */
	public enum Keys{
		
		// action keys with values for keyboard keys
        //ENTER(28),CANCEL(157)
		UP(200),DOWN(208),RIGHT(205),LEFT(203),ENTER(44),CANCEL(45);
		
		// key value of the key
		private int value;
		
		Keys( int val ){ value = val; }
		
		// Access Methods
		public int value(){ return value; }
		public void setValue( int val ){ value = val; }
		
	}

}

