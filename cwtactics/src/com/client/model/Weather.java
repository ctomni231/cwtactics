package com.client.model;

import com.system.data.sheets.Weather_Sheet;

public class Weather {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private static Weather_Sheet weather;



	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */
	
	public static void setWeather(Weather_Sheet weather) {
		Weather.weather = weather;
	}

	public static Weather_Sheet getWeather() {
		return weather;
	}

}

