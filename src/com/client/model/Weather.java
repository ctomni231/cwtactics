package com.client.model;

import com.client.model.object.Game;
import com.system.data.Engine_Database;
import com.system.data.sheets.Sheet;
import com.system.data.sheets.Weather_Sheet;
import com.system.network.MessageServer;
import com.system.network.coder.MessageEncoder;

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
		for( Sheet sh : Engine_Database.getWeatherTable() ){
			
			// SUM UP CHANCES
			if( sh == getWeather() ) continue;
			chance += ((Weather_Sheet) sh).getChance();
		}
		
		// GENERATE RANDOM VALUE
		chance = ((int) Math.random() * chance);
		
		// TRY TO FIND THE NEW WEATHER
		for( Sheet sh : Engine_Database.getWeatherTable() ){
			
			// SUM UP CHANCES
			if( sh == getWeather() ) continue;
			curChance += ((Weather_Sheet) sh).getChance();
			
			// IF CUR_CHANCE FIT WITH THE
			// SUM OF THE CHANCES, SET NEW WEATHER
			if( chance > curChance ) continue;
			sendCommand( ((Weather_Sheet) sh) );
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
		MessageServer.send("changeWeather="+MessageEncoder.encode(sh)+","+MessageEncoder.encode(leftDays));
	}
	
	
	
	/*
	 * OUTPUT METHODS
	 * **************
	 */
	
	public static String getStatus(){
		return "The weather is "+getWeather().getName()+" and will change in "+getLeftDays()+" days.";
	}

}

