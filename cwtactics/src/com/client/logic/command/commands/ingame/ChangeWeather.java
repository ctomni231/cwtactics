package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.Weather;
import com.system.data.sheets.Weather_Sheet;

/**
 * Command to change the weather.
 * 
 * @author tapsi
 * @version 8.1.2010, #1
 */
public class ChangeWeather implements Command {

	/*
	 * VARIABLES
	 * ********* 
	 */
	
	private Weather_Sheet sh;
	private int days;
	
	
	
	/*
	 * CONSTRUCTORS
	 * ************
	 */
	
	public ChangeWeather( Weather_Sheet sh , int days ){
		this.sh = sh;
		this.days = days;
	}
	
	
	/*
	 * WORK METHODS
	 * ************
	 */
	
	public void doCommand() {
		Weather.setWeather(sh);
		Weather.setLeftDays(days);
	}
}

