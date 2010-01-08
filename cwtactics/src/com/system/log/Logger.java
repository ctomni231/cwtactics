package com.system.log;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.TimeZone;
import java.util.logging.*;

/**
 * Logger class logs messages on console 
 * and file.
 * 
 * @author tapsi
 * @version 8.1.2010, #3
 */
public class Logger {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private static boolean isOn;
	private static Level stopAt;
	private static java.util.logging.Logger logger;

	
	
	/*
	 * CONSTRUCTOR 
	 * ***********
	 */

	/**
	 * Creates the internal logger instance.
	 */
	static {

		logger = java.util.logging.Logger.getLogger("CustomWars : Tactics Logger");
		SimpleFormatter formatter = new SimpleFormatter();
		ConsoleHandler ch = new ConsoleHandler();
		FileHandler fh =null;
		
		// GET DATE FOR LOG FILE
		SimpleDateFormat formater = new SimpleDateFormat();
		formater.applyPattern("'DATE'-yyyy_MM_dd-'TIME'-hh_mm' 'a");
		Calendar cal = new GregorianCalendar(TimeZone.getTimeZone("ECT"));

		// TRY TO ADD THE FILE HANDLER TO LOGGER INSTANCE
		try {
			fh = new FileHandler("LOG-" + formater.format(cal.getTime()) + ".log", true);
		} catch (SecurityException e) {
			System.err.println("Security error in the logger construction");
		} catch (IOException e) {
			System.err.println("In/Out error in the logger construction");
		}
		logger.addHandler(fh);
		fh.setFormatter(formatter);
		
		// TRY TO ADD CONSOLE HANDLER TO LOGGER
		logger.addHandler(ch);
		ch.setFormatter(formatter);

		// SET THE LEVEL OF LOGGER, DON'T USE PARENT HANDLERS
		Handler[] handlers = logger.getHandlers();
		for (int index = 0; index < handlers.length; index++) handlers[index].setLevel(Level.ALL);
		logger.setLevel(Level.ALL);
		logger.setUseParentHandlers(false);

	}
	
	
	
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
	 * Set the internal status.
	 */
	private static void setOn( boolean value ){
		isOn = value;
	}
	
	/**
	 * Sets the logger off.
	 */
	public static void setOff(){ 
		setOn(false); 
	}
	
	/**
	 * Sets the logger on.
	 */
	public static void setOn(){ 
		setOn(true); 
	}
	
	/**
	 * Sets the internal stop on error
	 * status.
	 */
	public static void stopOnLevel( Level level ){
		stopAt = level;
	}
	
	
	
	/*
	 * WORK METHODS
	 * ************
	 */
	
	/**
	 * Returns the current stack trace
	 */
	private static String getStackTrace(){
		
		// ADD STACK TRACE INFORMATION
        StackTraceElement element 	= Thread.currentThread().getStackTrace()[4];
        String className			= element.getClassName();
        String methodName       	= element.getMethodName();
        int line                	= element.getLineNumber();
        
		return "NEXT LOG WAS CALLED AT CLASS "+className+" FROM METHOD "+methodName+" AT LINE "+line ;
	}
	
	/**
	 * Is this Level greater equals the stop level?
	 */
	private static boolean stopProgram( Level level ){
		return ( level.intValue() >= stopAt.intValue() ) ? true : false;
	}
	
	/**
	 * Logs a given message in a given level
	 * of dangerous.
	 */
	private static void log( String message , Level level ){
		
		// RETURN IF LOGGER IS OFF, EXCEPT
		// YOU'VE GOT A WARN MESSAGE THEN LOG ALSO A 
		// STACK TRACE INFORMATION
		if( level.intValue() >= Level.WARNING.intValue() ) logger.log( level , getStackTrace() );
		else if( !isOn() ) return;
		
		// LOG MESSAGE
		logger.log(level,message);
		
		// HALT PROGRAM IF THE LEVEL OF LOG REACHES STOP_LEVEL
		if( stopProgram(level) ) System.exit(0);
	}

	/**
	 * Logs a warning message.
	 */
	public static void warn( String message ){
		log(message,Level.WARNING);
	}

	/**
	 * Logs a critical message.
	 */
	public static void critical( String message ){
		log(message,Level.SEVERE);
	}

	/**
	 * Logs a normal message.
	 */
	public static void log( String message ){
		log(message,Level.INFO);
	}
	
	
}

