package com.client.model;

import com.client.logic.command.CommandFactory;
import com.client.logic.command.MessageServer;
import com.client.model.object.Game;
import com.system.data.Data;
import com.system.data.sheets.Weather_Sheet;
import com.system.log.Logger;

/**
 * Holds the weather.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class Weather {

	/*
	 * VARIABLES
	 * *********
	 */
	
	private static Weather_Sheet weather;
	private static int leftDays;



	/*
	 * ACCESS METHODS
	 * **************
	 */
	
	/**
	 * Decreases the value of leftDays.
	 */
	public static void decreaseLeftDays(){
		leftDays--;
	}
	
	/**
	 * Returns the value of left days for this weather.
	 */
	public static int getLeftDays(){
		return leftDays;
	}
	
	/**
	 * Set left days.
	 */
	public static void setLeftDays( int value ){
		leftDays = value;
	}

	/**
	 * Sets the weather.
	 */	
	public static void setWeather(Weather_Sheet weather) {
		Weather.weather = weather;
	}

	/** 
	 * Returns the weather.
	 */
	public static Weather_Sheet getWeather() {
		return weather;
	}
	
	/**
	 * Searches randomly for a new weather. The new weather 
	 * will be different than the old and the method 
	 * works with the chance values from misc.xml. 
	 */
	public static void changeWeather(){
		
		int chance = 0;
		int curChance = 0;
		
		// SUM UP ALL CHANCES
		for( Weather_Sheet sh : Data.getWeatherTable() ){
			
			// SUM UP CHANCES
			if( sh == getWeather() ) continue;
			chance += sh.getChance();
		}
		
		// GENERATE RANDOM VALUE
		chance = ((int) Math.random() * chance);
		
		// TRY TO FIND THE NEW WEATHER
		for( Weather_Sheet sh : Data.getWeatherTable() ){
			
			// SUM UP CHANCES
			if( sh == getWeather() ) continue;
			curChance += sh.getChance();
			
			// IF CUR_CHANCE FIT WITH THE
			// SUM OF THE CHANCES, SET NEW WEATHER
			if( chance > curChance ) continue;
			sendCommand(sh);
			break;
		}
	}
	
	/**
	 * Sends the changeWeather command
	 * over the MessageServer to the clients.
	 */
	private static void sendCommand( Weather_Sheet sh ){
		
		// GENERATE DURATION
		int leftDays = (int) Math.random() * Game.getPlayers().size() * 2;
		
		// SEND COMMAND
		MessageServer.send( CommandFactory.changeWeather(sh, leftDays) );
		
	}
	
	
	
	/*
	 * OUTPUT METHODS
	 * **************
	 */
	
	public static String getStatus(){
		return "The weather is "+getWeather().getName()+" and will change in "+getLeftDays()+" days.";
	}

}

