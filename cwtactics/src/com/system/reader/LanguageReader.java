package com.system.reader;

import org.xml.sax.Attributes;

import com.system.data.Data;
import com.system.data.sheets.Sheet;

public class LanguageReader extends com.system.xml.Parser {

	/*
	 * CONSTRUCTOR
	 * ***********
	 */
	
	public LanguageReader(String file) {
		super(file);
	}
	
	
	
	/*
	 * WORK METHODS
	 * ************
	 */

	@Override
	public void entry( Attributes attributes ){
		
		if( attributes == null ) return;
		if( attributes.getValue( Data.getLanguage() ) != null ){
			
			Sheet sh;
			
			// get the correct data sheet
			if( super.isAheader("units") ) sh = Data.getUnitSheet( Data.getIntegerID( attributes.getValue("id")));
			else if( super.isAheader("weapons") ) sh = Data.getWeaponSheet( Data.getIntegerID( attributes.getValue("id")));
			else if( super.isAheader("tiles") ) sh = Data.getTileSheet( Data.getIntegerID( attributes.getValue("id")));
			else if( super.isAheader("buttons") ) sh = Data.getEntrySheet( Data.getIntegerID( attributes.getValue("id")));
			else if( super.isAheader("ranks") ) sh = Data.getRankSheet( Data.getIntegerID( attributes.getValue("id")));
			else if( super.isAheader("resources") ) sh = Data.getRessourceSheet( Data.getIntegerID( attributes.getValue("id")));
			else if( super.isAheader("weather") ) sh = Data.getWeatherSheet( Data.getIntegerID( attributes.getValue("id")));
			else if( super.isAheader("movetypes") ) sh = Data.getMoveSheet( Data.getIntegerID( attributes.getValue("id")));
			else sh = null;
				
			// add language data to it
			if( sh != null ) sh.setName( attributes.getValue( Data.getLanguage() ) );
		}
	}

}

