package com.system.reader;

import org.xml.sax.Attributes;

import com.system.data.Database;
import com.system.data.sheets.Sheet;

public class LanguageReader extends com.system.input.XML_Parser {

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
		if( attributes.getValue( Database.getLanguage() ) != null ){
			
			Sheet sh;
			
			// GET THE CORRECT DATA SHEET
			if( super.isAheader("units") ) sh = Database.getUnitSheet(  attributes.getValue("id"));
			else if( super.isAheader("weapons") ) sh = Database.getWeaponSheet(  attributes.getValue("id"));
			else if( super.isAheader("tiles") ) sh = Database.getTileSheet(  attributes.getValue("id"));
			else if( super.isAheader("buttons") ) sh = Database.getEntrySheet(  attributes.getValue("id"));
			else if( super.isAheader("ranks") ) sh = Database.getRankSheet(  attributes.getValue("id"));
			else if( super.isAheader("resources") ) sh = Database.getRessourceSheet(  attributes.getValue("id"));
			else if( super.isAheader("weather") ) sh = Database.getWeatherSheet(  attributes.getValue("id"));
			else if( super.isAheader("movetypes") ) sh = Database.getMoveSheet(  attributes.getValue("id"));
			else sh = null;
				
			// ADD THE STRING VALUE TO THE SHEET
			if( sh != null ) sh.setName( attributes.getValue( Database.getLanguage() ) );
		}
	}

}

