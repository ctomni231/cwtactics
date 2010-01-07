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
			
			// GET THE CORRECT DATA SHEET
			if( super.isAheader("units") ) sh = Data.getUnitSheet(  attributes.getValue("id"));
			else if( super.isAheader("weapons") ) sh = Data.getWeaponSheet(  attributes.getValue("id"));
			else if( super.isAheader("tiles") ) sh = Data.getTileSheet(  attributes.getValue("id"));
			else if( super.isAheader("buttons") ) sh = Data.getEntrySheet(  attributes.getValue("id"));
			else if( super.isAheader("ranks") ) sh = Data.getRankSheet(  attributes.getValue("id"));
			else if( super.isAheader("resources") ) sh = Data.getRessourceSheet(  attributes.getValue("id"));
			else if( super.isAheader("weather") ) sh = Data.getWeatherSheet(  attributes.getValue("id"));
			else if( super.isAheader("movetypes") ) sh = Data.getMoveSheet(  attributes.getValue("id"));
			else sh = null;
				
			// ADD THE STRING VALUE TO THE SHEET
			if( sh != null ) sh.setName( attributes.getValue( Data.getLanguage() ) );
		}
	}

}

