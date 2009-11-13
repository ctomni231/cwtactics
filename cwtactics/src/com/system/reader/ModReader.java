package com.system.reader;

import org.xml.sax.Attributes;

import com.system.data.Data;
import com.system.data.sheets.Move_Sheet;
import com.system.data.sheets.Rank_Sheet;
import com.system.data.sheets.Sheet;
import com.system.data.sheets.Tile_Sheet;
import com.system.data.sheets.Unit_Sheed;
import com.system.data.sheets.Weapon_Sheed;
import com.system.data.sheets.Weather_Sheet;
import com.system.xml.Parser;

/**
 * 
 * Reads out a modification file.
 * 
 * ATM not commented and fully refactored,
 * only as first version to be able to readout
 * mod file content
 * 
 * @author Tapsi
 * 
 * @version r1 - not final yet
 *
 */
public class ModReader extends Parser {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */
	
	private String headerID;

	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */

	public ModReader(String file) {
		super(file);
	}

	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */
	
	public void addUnitSheet( String header ){
		Data.addUnitSheet(header, new Unit_Sheed());
	}
	
	public void addTileSheet( String header ){
		Data.addTileSheet(header, new Tile_Sheet());
	}

	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */

	@Override
	public void entry( Attributes attributes ){
		
		if( attributes == null ) return;
		
		if( super.isAheader("mod") )			parseMod(attributes);
		else if( super.isAheader("unit") ) 		parseUnit(attributes);
		else if( super.isAheader("field") )		parseTile(attributes);
		else if( super.isAheader("weather") )	parseWeather(attributes);
		else if( super.isAheader("rank") )		parseRank(attributes);
		else if( super.isAheader("ressource") ) parseResource(attributes);
		else if( super.isAheader("movetype") )	parseMoveType(attributes);
		else if( super.isAheader("Entry") )		parseEntry(attributes);
	}
	
	/*
	 *
	 * INTERNAL METHODS
	 * ****************
	 * 
	 */
	
	/**
	 * Parses an entry block and adds the content to the data core.
	 */
	private void parseEntry( Attributes attributes ){
		
		if( super.getLastHeader().equals("Entry") ){
			if( !Data.existIntegerID( attributes.getValue( "ID" ) ) ) Data.addEntrySheet( attributes.getValue( "ID" ) , new Sheet() );
			headerID = attributes.getValue( "ID" );
			return;
		}
		
		Sheet sh = Data.getEntrySheet( Data.getIntegerID(headerID) );
		
		/*
		 * 			 NAME
		 ****************************
		 */
		if( super.isAheader("name") ){
			if( attributes.getValue( Data.getLanguage() ) != null ) sh.setName( attributes.getValue( Data.getLanguage() ) );
		}
	}
	
	/**
	 * Parses an rank block and adds the content to the data core.
	 */
	private void parseRank( Attributes attributes ){

		if( super.getLastHeader().equals("rank") ){
			if( !Data.existIntegerID( attributes.getValue( "ID" ) ) ) Data.addRankSheet( attributes.getValue( "ID" ) , new Rank_Sheet() );
			headerID = attributes.getValue( "ID" );
			return;
		}
		
		Rank_Sheet sh = Data.getRankSheet( Data.getIntegerID(headerID) );
		
		/*
		 * 			 NAME
		 ****************************
		 */
		if( super.isAheader("name") ){
			
			if( attributes.getValue( Data.getLanguage() ) != null ) sh.setName( attributes.getValue( Data.getLanguage() ) );
		}
		
		/*
		 * 			STATUS
		 ****************************
		 */
		else if( super.isAheader("stats") ){
			
			if( attributes.getValue("exp") != null ) sh.setExp( Integer.parseInt(attributes.getValue("exp")) );
		}
	}
	
	/**
	 * Parses an move type block and adds the content to the data core.
	 */
	private void parseMoveType( Attributes attributes ){
		
		if( super.getLastHeader().equals("movetype") ){
			if( !Data.existIntegerID( attributes.getValue( "ID" ) ) ) Data.addMoveSheet( attributes.getValue( "ID" ) , new Move_Sheet() );
			headerID = attributes.getValue( "ID" );
			return;
		}
		
		Move_Sheet sh = Data.getMoveSheet( Data.getIntegerID(headerID) );
		
		/*
		 * 			 NAME
		 ****************************
		 */
		if( super.isAheader("name") ){
			
			if( attributes.getValue( Data.getLanguage() ) != null ) sh.setName( attributes.getValue( Data.getLanguage() ) );
		}
		
		/*
		 * 		  MOVE FIELDS
		 ****************************
		 */
		else if( super.isAheader("fieldtarget") ){
			
			// create new sheet if you arrive a new XML object body and the ID isn't in the database
			if( ! Data.existIntegerID( attributes.getValue("id")  )) addTileSheet( attributes.getValue("id") );
			Tile_Sheet shTarget = Data.getTileSheet( Data.getIntegerID(attributes.getValue("id") ) );

			if( attributes.getValue("move") != null ) sh.addTileMoveCost( shTarget, Integer.parseInt(attributes.getValue("move")) );
		}
	}
	
	/**
	 * Parses an resource block and adds the content to the data core.
	 */
	private void parseResource( Attributes attributes ){
		
		if( super.getLastHeader().equals("ressource") ){
			if( !Data.existIntegerID( attributes.getValue( "ID" ) ) ) Data.addRessourceSheet( attributes.getValue( "ID" ) , new Sheet() );
			headerID = attributes.getValue( "ID" );
			return;
		}
		
		Sheet sh = Data.getRankSheet( Data.getIntegerID(headerID) );
		
		/*
		 * 			 NAME
		 ****************************
		 */
		if( super.isAheader("name") ){
			
			if( attributes.getValue( Data.getLanguage() ) != null ) sh.setName( attributes.getValue( Data.getLanguage() ) );
		}
	}
	
	/**
	 * Parses an weather block and adds the content to the data core.
	 */
	private void parseWeather( Attributes attributes ){

		if( super.getLastHeader().equals("weather") ){
			if( !Data.existIntegerID( attributes.getValue( "ID" ) ) ) Data.addWeatherSheet( attributes.getValue( "ID" ) , new Weather_Sheet() ); 
			headerID = attributes.getValue( "ID" );
			return;
		}

		Weather_Sheet sh = Data.getWeatherSheet( Data.getIntegerID(headerID) );

		/*
		 * 			 NAME
		 ****************************
		 */
		if( super.isAheader("name") ){
			
			if( attributes.getValue( Data.getLanguage() ) != null ) sh.setName( attributes.getValue( Data.getLanguage() ) );
		}
		
		/*
		 * 		    STATUS
		 ****************************
		 */
		else if( super.isAheader("stats") ){
			
			if( attributes.getValue("chance") != null ) sh.setChance( Integer.parseInt(attributes.getValue("chance")) );
		}
	}

	/**
	 * Parses an tile block and adds the content to the data core.
	 */
	private void parseTile( Attributes attributes ){

		if( super.getLastHeader().equals("field") ){
			if( !Data.existIntegerID( attributes.getValue( "ID" ) ) ) Data.addTileSheet( attributes.getValue( "ID" ) , new Tile_Sheet() );
			headerID = attributes.getValue( "ID" );
			return;
		}
		
		Tile_Sheet sh = Data.getTileSheet( Data.getIntegerID(headerID) );
		
		/*
		 * 			 NAME
		 ****************************
		 */
		if( super.isAheader("name") ){
			
			if( attributes.getValue( Data.getLanguage() ) != null ) sh.setName( attributes.getValue( Data.getLanguage() ) );
		}
		
		/*
		 * 			  TAG
		 ****************************
		 */
		else if( super.isAheader("tag") ){
			
			if( attributes.getValue("id") != null ) 		sh.addTag( Data.getIntegerTagID(attributes.getValue("id")) );
		}
		
		/*
		 * 			 FUNDS
		 ****************************
		 */
		else if( super.isAheader("funds") ){
			
			// checks all resources and adds it to the sheet if a valiue is given
			for( int i = 0 ; i < Data.getRessourceTable().size() ; i++ ){
				if( attributes.getValue("ressource_"+i ) != null ) 		sh.setFunds( Data.getRessourceSheet(i) , Integer.parseInt( attributes.getValue("ressource_"+i) ) );
			}
		}
		
		/*
		 * 		    STATUS
		 ****************************
		 */
		else if( super.isAheader("stats") ){
			
			if( attributes.getValue("vision") != null ) sh.setVision( Integer.parseInt(attributes.getValue("vision")) );
		}
		
		/*
		 * 		  CAPTUREABLE
		 ****************************
		 */
		else if( super.isAheader("captureable") ){
			
			if( attributes.getValue("points") != null ) sh.setCapturePoints( Integer.parseInt(attributes.getValue("points")) );
		}
		
		/*
		 * 		  HIDDENTARGET
		 ****************************
		 */
		else if( super.isAheader("unittarget") ){
			
			// create new sheet if you arrive a new XML object body and the ID isn't in the database
			if( ! Data.existIntegerID( attributes.getValue("id")  )) addUnitSheet( attributes.getValue("id") );
			Unit_Sheed shDet = Data.getUnitSheet( Data.getIntegerID(attributes.getValue("id") ) );
			
			sh.addDetectRange(shDet, Integer.parseInt(attributes.getValue("range")) );
		}
		else if( super.isAheader("tiletarget") ){
			
			// create new sheet if you arrive a new XML object body and the ID isn't in the database
			if( ! Data.existIntegerID( attributes.getValue("id")  )) addUnitSheet( attributes.getValue("id") );
			Tile_Sheet shDet = Data.getTileSheet( Data.getIntegerID(attributes.getValue("id") ) );
			
			sh.addDetectRange(shDet, Integer.parseInt(attributes.getValue("range")) );
		}
		
		/*
		 * 		  BUILDTARGET
		 ****************************
		 */
		else if( super.isAheader("buildtarget") ){
			
			// create new sheet if you arrive a new XML object body and the ID isn't in the database
			if( ! Data.existIntegerID( attributes.getValue("id")  )) addUnitSheet( attributes.getValue("id") );
			Unit_Sheed shBuild = Data.getUnitSheet( Data.getIntegerID(attributes.getValue("id") ) );
			
			sh.addBuildType(shBuild);
		}
	}
	
	/**
	 * Parses an modification block and adds the content to the data core.
	 */
	private void parseMod( Attributes attributes ){
		
		/*
		 * 		  INFORMATION
		 ****************************
		 */
		if( super.isAheader("information") ){
			
			// save general modification information
			if( attributes.getValue("name") != null ) Data.setName( attributes.getValue("name") );
			if( attributes.getValue("author") != null ) Data.setAuthor( attributes.getValue("author") );
			if( attributes.getValue("modVersion") != null ) Data.setVersion( attributes.getValue("modVersion") );
		}
		
		/*
		 * 			 STATUS
		 ****************************
		 */
		else if( super.isAheader("stats") ){
			
			// save language
			if( attributes.getValue("language") != null ) Data.setLanguage( attributes.getValue("language") );
		}
	}
	
	/**
	 * Parses an unit block and adds the content to the data core.
	 */
	private void parseUnit( Attributes attributes ){
		
		// create new sheet if you arrive a new XML object body and the ID isn't in the database
		if( super.getLastHeader().equals("unit") ){
			if( !Data.existIntegerID( attributes.getValue( "ID" ) ) ) addUnitSheet( attributes.getValue( "ID" ) );
			headerID = attributes.getValue( "ID" );
			return;
		}
		Unit_Sheed sh = Data.getUnitSheet( Data.getIntegerID(headerID) );
		
		/*
		 * 			 NAME
		 ****************************
		 */
		if( super.isAheader("name") ){
			
			// adds name to the sheet
			if( attributes.getValue( Data.getLanguage() ) != null ) 	sh.setName( attributes.getValue( Data.getLanguage() ) );
		}
		
		/*
		 * 			 COST
		 ****************************
		 */
		else if( super.isAheader("cost") ){
			
			// checks all resources and adds it to the sheet if a valiue is given
			for( int i = 0 ; i < Data.getRessourceTable().size() ; i++ ){
				if( attributes.getValue("ressource_"+i ) != null ) 		sh.setCost( Data.getRessourceSheet(i) , Integer.parseInt( attributes.getValue("ressource_"+i) ) );
			}
		}
		
		/*
		 * 		   MOVEMENT
		 ****************************
		 */
		else if( super.isAheader("movement") ){
			
			if( attributes.getValue("range") != null ) 		sh.setMoveRange( Integer.parseInt(attributes.getValue("range")) );
			if( attributes.getValue("type") != null ) 		sh.setMoveType( Data.getMoveSheet( Data.getIntegerID(attributes.getValue("type"))) );
			if( attributes.getValue("vision") != null ) 	sh.setVision( Integer.parseInt(attributes.getValue("vision")) );
			if( attributes.getValue("capture") != null ) 	sh.setCaptureValue( Integer.parseInt(attributes.getValue("capture")) );
			if( attributes.getValue("weight") != null ) 	sh.setWeight( Integer.parseInt(attributes.getValue("weight")) );
		}
		
		/*
		 * 			 FUEL
		 ****************************
		 */
		else if( super.isAheader("fuel") ){
			
			if( attributes.getValue("amount") != null ) 	sh.setFuel( Integer.parseInt(attributes.getValue("amount")) );
		}
		
		/*
		 * 			  TAG
		 ****************************
		 */
		else if( super.isAheader("tag") ){
			
			if( attributes.getValue("id") != null ) 		sh.addTag( Data.getIntegerTagID(attributes.getValue("id")) );
		}
		
		/*
		 * 			 COMBAT
		 ****************************
		 */
		else if( super.getLastHeader().equals("combat") ){
			
			if( attributes.getValue("ammo") != null ) 					sh.setAmmo( Integer.parseInt(attributes.getValue("ammo")) );
		}
		else if( super.isAheader("combat") && !super.getLastHeader().equals("combat") ){
			
			// crate a sheet and add it to unit sheet
			Weapon_Sheed wSh = new Weapon_Sheed();
			sh.addWeapon(wSh);
			
			// check values and sets the settings of the weapon
			if( attributes.getValue( Data.getLanguage() ) != null ) 	wSh.setName( attributes.getValue( Data.getLanguage() ) );
			if( attributes.getValue("useAmmo") != null ) 				wSh.setUseAmmo( Integer.parseInt(attributes.getValue("useAmmo")) );
			if( attributes.getValue("minrange") != null ) 				wSh.setMinRange( Integer.parseInt(attributes.getValue("minrange")) );
			if( attributes.getValue("maxrange") != null ) 				wSh.setMaxRange( Integer.parseInt(attributes.getValue("maxrange")) );
			if( attributes.getValue("indirect") != null ) 				wSh.setFireMode( Integer.parseInt(attributes.getValue("indirect")) );
			if( attributes.getValue("rangeMod") != null ) 				wSh.setRangePenalty( Integer.parseInt(attributes.getValue("rangeMod")) );
		}
		
		/*
		 * 			 DAMAGE
		 ****************************
		 */
		else if( super.isAheader("damage") && super.isAheader("enemy")){
			
			// enemy target entry , fist check ID and then the damage
			if( attributes.getValue("id") != null ){
				
				// exist the enemy ID in the database ? , if not create a new sheet for it
				if( ! Data.existIntegerID( attributes.getValue("id")  )) addUnitSheet( attributes.getValue("id") );
				Unit_Sheed sh_enemy = Data.getUnitSheet( Data.getIntegerID(attributes.getValue("id") ) );
				
				// check damage values for all weapons of the unit
				for( int i = 0 ; i < sh.getNumberOfWeapons() ; i++ ){
					
					if( sh.getWeapon(i) == null ) return;
					if( attributes.getValue("wp"+(i+1)+"_damage") != null ) sh.getWeapon(i).setDamage(sh_enemy, Integer.parseInt( attributes.getValue("wp"+(i+1)+"_damage") ));
				}
			}
		}
		
		/*
		 * 			 SUPPLY
		 ****************************
		 */
		else if( super.isAheader("supply") && super.isAheader("supplytarget") ){
			
			// if the target sheet not exist create new one
			if( ! Data.existIntegerID( attributes.getValue("id")  )) addUnitSheet( attributes.getValue("id") );
			Unit_Sheed sh_supply = Data.getUnitSheet( Data.getIntegerID(attributes.getValue("id") ) );
			
			sh.addSupplyType(sh_supply);
		}
		
		/*
		 * 			 LOADS
		 ****************************
		 */
		else if( super.isAheader("loads") ){
			
			if( attributes.getValue("amount") != null )	 sh.setLoadWeight( Integer.parseInt(attributes.getValue("amount")) );
			if( super.isAheader("loadtarget") ){
				
				// if the target sheet not exist create new one
				if( ! Data.existIntegerID( attributes.getValue("id")  )) addUnitSheet( attributes.getValue("id") );
				Unit_Sheed sh_load = Data.getUnitSheet( Data.getIntegerID(attributes.getValue("id") ) );
				
				sh.addLoadType(sh_load);
			}
		}
	}
}

