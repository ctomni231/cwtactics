package com.client.model;

import com.client.logic.command.MessageServer;
import com.client.logic.command.commands.ingame.ChangeWeather;
import com.client.model.object.Game;
import com.system.data.Data;
import com.system.data.sheets.Weather_Sheet;

public class Weather {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private static Weather_Sheet weather;
	private static int leftDays;



	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */
	
	/**
	 * Decreases the value of leftDays.
	 */
	public static void decreaseLeftDays(){
		leftDays--;
		// TODO change weather if null , and only server changes weather!
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
		
		// make your choice for a new weather
		int chance = 0;
		int curChance = 0;
		
		// sum up all chances
		for( Weather_Sheet sh : Data.getWeatherTable() ){
			
			// if it's the old weather , continue
			if( sh == getWeather() ) continue;
			
			// sum up chances for calculation
			chance += sh.getChance();
		}
		
		// get random value between 0 and chance
		chance = ((int) Math.random() * chance);
		
		// try to find new weather
		for( Weather_Sheet sh : Data.getWeatherTable() ){
			
			// if it's the old weather , continue
			if( sh == getWeather() ) continue;
			
			// sum up chances
			curChance += sh.getChance();
			
			// if random chance is less than the sum up 
			// chance, set weather to current weather
			if( chance < curChance ){
				
				int leftDays = (int) Math.random() * Game.getPlayers().size() * 2;
				
				MessageServer.send( new ChangeWeather(sh, leftDays) );
				break;
			}
		}
	}

}

