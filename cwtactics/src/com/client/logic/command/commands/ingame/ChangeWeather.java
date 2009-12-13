package com.client.logic.command.commands.ingame;

import com.client.logic.command.Command;
import com.client.model.Weather;
import com.system.data.sheets.Weather_Sheet;

public class ChangeWeather implements Command {

	private Weather_Sheet sh;
	private int days;
	
	public ChangeWeather( Weather_Sheet sh , int days ){
		this.sh = sh;
		this.days = days;
	}
	
	public void doCommand() {
		Weather.setWeather(sh);
		Weather.setLeftDays(days);
	}
}

