package com.system;

public interface ID {
	
	// unit levels
	public static final int GROUND = 0;
	public static final int FOOT_GROUND = 6;
	public static final int LOWAIR = 1;
	public static final int MIDDLEAIR = 2;
	public static final int HIGHAIR = 3;
	public static final int SEA = 4;
	public static final int UNDERSEA = 5;
	
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
    
    public enum MessageMode{
    	LOCAL,IRC_NETWORK
    }
    
}

