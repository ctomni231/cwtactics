package com.system.reader;

import org.xml.sax.Attributes;

import com.system.data.Engine_Database;
import com.system.data.sheets.Sheet;
import com.system.error.NoSuchKey_Exception;
import com.system.error.NoSuchMethod_Exception;
import com.system.log.Logger;

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
		try{
		if( attributes == null ) return;
		if( attributes.getValue( Engine_Database.getLanguage() ) != null ){
			
			Sheet sh;
			
			// GET THE CORRECT DATA SHEET
			if( super.isAheader("units") ) sh = Engine_Database.getUnitSheet(  attributes.getValue("id"));
			else if( super.isAheader("weapons") ) sh = Engine_Database.getWeaponSheet(  attributes.getValue("id"));
			else if( super.isAheader("tiles") ) sh = Engine_Database.getTileSheet(  attributes.getValue("id"));
			else if( super.isAheader("buttons") ) sh = Engine_Database.getEntrySheet(  attributes.getValue("id"));
			else if( super.isAheader("ranks") ) sh = Engine_Database.getRankSheet(  attributes.getValue("id"));
			else if( super.isAheader("resources") ) sh = Engine_Database.getRessourceSheet( attributes.getValue("id"));
			else if( super.isAheader("weather") ) sh = Engine_Database.getWeatherSheet(  attributes.getValue("id"));
			else if( super.isAheader("movetypes") ) sh = Engine_Database.getMoveSheet(  attributes.getValue("id"));
			else sh = null;
				
			// ADD THE STRING VALUE TO THE SHEET
			if( sh != null ) sh.setName( attributes.getValue( Engine_Database.getLanguage() ) );
		}
		}catch( NoSuchKey_Exception e ){ Logger.log( attributes.getValue("id")+"ERROR" ); } 
	}

}

