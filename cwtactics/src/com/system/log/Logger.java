package com.system.log;

public class Logger {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private static boolean isOn;
	private static boolean stopOnError;
	private static Mode mode;
	
	public enum Mode{ CONSOLE }
	public enum Level{ NORMAL, WARN, ERROR }
	


	/*
	 * ACCESSING METHODS
	 * *****************
	 */

	/**
	 * Is the Logger object on?
	 */
	public static boolean isOn(){
		return isOn;
	}
	
	/**
	 * Set the 
	 */
	private static void setOn( boolean value ){
		isOn = value;
	}
	
	public static void setOff(){ 
		setOn(false); 
	}
	
	public static void setOn(){ 
		setOn(true); 
	}
	
	private static void setStopOnErrorOn( boolean value ){
		stopOnError = value;
	}
	
	public static void setStopOnErrorOff(){ 
		setStopOnErrorOn(false); 
	}
	
	public static void setStopOnErrorOn(){ 
		setStopOnErrorOn(true); 
	}
	
	public static void setMode( Mode mode ){
		Logger.mode = mode;
	}
	
	
	
	/*
	 * WORK METHODS
	 * ************
	 */
	
	/**
	 * Writes a message into the logging system.
	 */
	public static void write( String message , Level level ){
		
		// don't search trace information if you write a normal message
		if( level == Level.NORMAL ) writeMessage(message, level);
		else writeCriticalMessage(message, level);
	}
	
	/**
	 * Prints a log stamp onto the console. 
	 * Primary for debug actions.
	 */
	public static void printStamp(){
		
		// get data
		StackTraceElement element = Thread.currentThread().getStackTrace()[2];
		String classNameOld = null;
		String methodNameOld= null;
		String className 	= element.getClassName();
		String methodName 	= element.getMethodName();
		int line 			= element.getLineNumber();
		int line2 			= 0;
		
		// only get background information if possible
		if( Thread.currentThread().getStackTrace().length > 3 ){
			StackTraceElement elementOld = Thread.currentThread().getStackTrace()[3];
			classNameOld = elementOld.getClassName();
			methodNameOld= elementOld.getMethodName();
			line2		 = elementOld.getLineNumber();
		}
		
		// print log stamp on console
		System.out.println("LOG STAMP, in class "+className+" from method "+methodName+" at line "+line);
		if( classNameOld != null &&
			methodNameOld != null ) System.out.println("       called from method "+methodNameOld+" in class "+classNameOld+" at line "+line2);
	}
	
	
	
	/*
	 * INTERNAL METHODS
	 * ****************
	 */
	
	private static void writeMessage( String message , Level level ){
		
		// print message
		switch(mode){
			
			case CONSOLE :
				writeOntoConsole(null,null,0,message,level);
				break;
		}
	}
	
	private static void writeCriticalMessage( String message , Level level ){
		
		// add trace information
		StackTraceElement element = Thread.currentThread().getStackTrace()[3];
		String className 	= element.getClassName();
		String methodName 	= element.getMethodName();
		int line 			= element.getLineNumber();
		
		// print message
		switch(mode){
		
			case CONSOLE :
				writeOntoConsole(className,methodName,line,message,level);
				break;
		}
		
		// if stop on error is on, stop engine
		if( level == Level.ERROR && stopOnError ) System.exit(0);
	}
	
	private static void writeOntoConsole( String className , String methodName , int line , String message , Level level ){
		
		switch( level ){
				
			case NORMAL:
				System.out.println(message);
				break;
				
			case WARN:
				System.err.println("WARNING MESSAGE, in class "+className+" from method "+methodName+" at line "+line);
				System.err.println(message);
				break;
				
			case ERROR:
				System.err.println("ERROR MESSAGE, in class "+className+" from method "+methodName+" at line "+line);
				System.err.println(message);
				break;
		}
	}
	
	
	
}

