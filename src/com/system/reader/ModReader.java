package com.system.reader;

import org.xml.sax.Attributes;

import com.system.data.Engine_Database;
import com.system.data.Engine_Database.Category;
import com.system.data.sheets.Move_Sheet;
import com.system.data.sheets.Rank_Sheet;
import com.system.data.sheets.Sheet;
import com.system.data.sheets.Tile_Sheet;
import com.system.data.sheets.Unit_Sheed;
import com.system.data.sheets.Weapon_Sheed;
import com.system.data.sheets.Weather_Sheet;
import com.system.error.Add_Exception;
import com.system.input.XML_Parser;
import com.system.log.Logger;

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
public class ModReader extends XML_Parser {

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
		try{ Engine_Database.addSheet( Category.UNIT_SHEETS , header, new Unit_Sheed()); }
		catch( Add_Exception e ){ }
	}
	
	public void addTileSheet( String header ){
		try{ Engine_Database.addSheet( Category.TILE_SHEETS ,  header, new Tile_Sheet()); }
		catch( Add_Exception e ){ }
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
		else if( super.isAheader("button") )	parseEntry(attributes);
		else if( super.isAheader("weapon") )	parseWeapon(attributes);
	}
	
	/*
	 *
	 * INTERNAL METHODS
	 * ****************
	 * 
	 */
	
	private void parseWeapon( Attributes attributes ){
		
		if( super.getLastHeader().equals("weapon") ){
			try{ if( attributes.getValue( "id" ) != null ) Engine_Database.addSheet( Category.WEAPON_SHEETS , attributes.getValue( "id" ) , new Weapon_Sheed() ); }
			catch( Add_Exception e ){ }
			headerID = attributes.getValue( "id" );
		}
		
		Weapon_Sheed sh = Engine_Database.getWeaponSheet( headerID );
		
		if( super.isAheader("canAttack") ){
			if( attributes.getValue("levels") != null ){
				String[] levels = attributes.getValue("levels").split(",");
				for( String s : levels ){
					sh.setAttack( Integer.parseInt(s) , true);
				}
			}
		}
		else if( super.isAheader("useAmmo") ){
			if( attributes.getValue("value") != null ) sh.setUseAmmo( Integer.parseInt(attributes.getValue("value")) );
		}
		else if( super.isAheader("weaponType") ){
			if( attributes.getValue("value") != null ) sh.setFireMode( Integer.parseInt(attributes.getValue("value")) );
		}
		else if( super.isAheader("ranges") ){
			if( attributes.getValue("min") != null ) sh.setMinRange( Integer.parseInt(attributes.getValue("min")) );
			if( attributes.getValue("max") != null ) sh.setMaxRange( Integer.parseInt(attributes.getValue("max")) );
		}
	}
	
	/**
	 * Parses an entry block and adds the content to the data core.
	 */
	private void parseEntry( Attributes attributes ){
		
		if( super.getLastHeader().equals("button") ){
			try{ Engine_Database.addSheet( Category.ENTRIES , attributes.getValue( "ID" ) , new Sheet() ); }
			catch( Add_Exception e ){ }
			headerID = attributes.getValue( "ID" );
			return;
		}
		
		//Sheet sh = Data.getEntrySheet( Data.getIntegerID(headerID) );
	}
	
	/**
	 * Parses an rank block and adds the content to the data core.
	 */
	private void parseRank( Attributes attributes ){

		if( super.getLastHeader().equals("rank") ){
			try{ Engine_Database.addSheet( Category.RANK_SHEETS , attributes.getValue( "ID" ) , new Rank_Sheet() ); }
			catch( Add_Exception e ){ }
			headerID = attributes.getValue( "ID" );
			return;
		}
		
		Rank_Sheet sh = Engine_Database.getRankSheet( headerID );
		
		/*
		 * 			STATUS
		 ****************************
		 */
		if( super.isAheader("stats") ){
			
			if( attributes.getValue("exp") != null ) sh.setExp( Integer.parseInt(attributes.getValue("exp")) );
		}
	}
	
	/**
	 * Parses an move type block and adds the content to the data core.
	 */
	private void parseMoveType( Attributes attributes ){
		
		if( super.getLastHeader().equals("movetype") ){
			try{ Engine_Database.addSheet(Category.MOVE_SHEETS ,  attributes.getValue( "ID" ) , new Move_Sheet() ); }
			catch( Add_Exception e ){ }
			headerID = attributes.getValue( "ID" );
			return;
		}
		
		Move_Sheet sh = Engine_Database.getMoveSheet( headerID );
		
		
		/*
		 * 		  MOVE FIELDS
		 ****************************
		 */
		if( super.isAheader("fieldtarget") ){
			
			// create new sheet if you arrive a new XML object body and the ID isn't in the database
			addTileSheet( attributes.getValue("id") );
			Tile_Sheet shTarget = Engine_Database.getTileSheet( attributes.getValue("id") );

			if( attributes.getValue("move") != null ) sh.addTileMoveCost( shTarget, Integer.parseInt(attributes.getValue("move")) );
		}
	}
	
	/**
	 * Parses an resource block and adds the content to the data core.
	 */
	private void parseResource( Attributes attributes ){
		
		if( super.getLastHeader().equals("ressource") ){
			try{ Engine_Database.addSheet( Category.RESOURCE_SHEETS , attributes.getValue( "ID" ) , new Sheet() ); }
			catch( Add_Exception e ){ }
			headerID = attributes.getValue( "ID" );
			return;
		}
		
		//Sheet sh = Data.getRankSheet( Data.getIntegerID(headerID) );
	}
	
	/**
	 * Parses an weather block and adds the content to the data core.
	 */
	private void parseWeather( Attributes attributes ){

		if( super.getLastHeader().equals("weather") ){
			try{ Engine_Database.addSheet( Category.WEATHER_SHEETS , attributes.getValue( "ID" ) , new Weather_Sheet() ); }
			catch( Add_Exception e ){ }
			headerID = attributes.getValue( "ID" );
			return;
		}

		Weather_Sheet sh = Engine_Database.getWeatherSheet( headerID );
		
		/*
		 * 		    STATUS
		 ****************************
		 */
		if( super.isAheader("stats") ){
			
			if( attributes.getValue("chance") != null ) sh.setChance( Integer.parseInt(attributes.getValue("chance")) );
		}
	}

	/**
	 * Parses an tile block and adds the content to the data core.
	 */
	private void parseTile( Attributes attributes ){

		if( super.getLastHeader().equals("field") ){
			try{ Engine_Database.addSheet( Category.TILE_SHEETS , attributes.getValue( "ID" ) , new Tile_Sheet() ); }
			catch( Add_Exception e ){ }
			headerID = attributes.getValue( "ID" );
			return;
		}
		
		Tile_Sheet sh = Engine_Database.getTileSheet(headerID );
				
		/*
		 * 			  TAG
		 ****************************
		 */
		if( super.isAheader("tag") ){
			
			if( attributes.getValue("id") != null ) 		sh.addTag( Engine_Database.getIntegerTagID(attributes.getValue("id")) );
		}
		
		/*
		 * 			 FUNDS
		 ****************************
		 */
		else if( super.isAheader("funds") ){
			
			// checks all resources and adds it to the sheet if a value is given
			for( int i = 0 ; i < Engine_Database.getRessourceTable().size() ; i++ ){
				if( attributes.getValue("ressource_"+i ) != null ) 		sh.setFunds( Engine_Database.getResourceSheet(i) , Integer.parseInt( attributes.getValue("ressource_"+i) ) );
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
		else if( super.getLastHeader().equals("hidden") ){
			if( attributes.getValue("range") != null ){
				sh.setNeedRange( Integer.parseInt(attributes.getValue("range")) );
			}
		}
		else if( super.isAheader("unittarget") ){
			
			// create new sheet if you arrive a new XML object body and the ID isn't in the database
			try{ addUnitSheet( attributes.getValue("id") ); }
			catch( Add_Exception e ){ }
			Unit_Sheed shDet = Engine_Database.getUnitSheet( attributes.getValue("id") );
			
			sh.addDetectRange(shDet, Integer.parseInt(attributes.getValue("range")) );
		}
		else if( super.isAheader("tiletarget") ){
			
			// create new sheet if you arrive a new XML object body and the ID isn't in the database
			try{ addUnitSheet( attributes.getValue("id") ); }
			catch( Add_Exception e ){ } 
			Tile_Sheet shDet = Engine_Database.getTileSheet( attributes.getValue("id") );
			
			sh.addDetectRange(shDet, Integer.parseInt(attributes.getValue("range")) );
		}
		
		/*
		 * 		  BUILDTARGET
		 ****************************
		 */
		else if( super.isAheader("buildtarget") ){
			
			// create new sheet if you arrive a new XML object body and the ID isn't in the database
			try{ addUnitSheet( attributes.getValue("id") ); }
			catch( Add_Exception e ){ }
			Unit_Sheed shBuild = Engine_Database.getUnitSheet( attributes.getValue("id") );
			
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
			if( attributes.getValue("name") != null ) Engine_Database.setName( attributes.getValue("name") );
			if( attributes.getValue("author") != null ) Engine_Database.setAuthor( attributes.getValue("author") );
			if( attributes.getValue("modVersion") != null ) Engine_Database.setVersion( attributes.getValue("modVersion") );
		}
		
		/*
		 * 			 STATUS
		 ****************************
		 */
		else if( super.isAheader("stats") ){
			
			// save language
			if( attributes.getValue("language") != null ) Engine_Database.setLanguage( attributes.getValue("language") );
            if( attributes.getValue("tileset") != null) Engine_Database.setTileSet( attributes.getValue("tileset"));
		}
	}
	
	/**
	 * Parses an unit block and adds the content to the data core.
	 */
	private void parseUnit( Attributes attributes ){
		
		// create new sheet if you arrive a new XML object body and the ID isn't in the database
		if( super.getLastHeader().equals("unit") ){
			try{ addUnitSheet( attributes.getValue( "ID" ) ); }
			catch( Add_Exception e ){ }
			headerID = attributes.getValue( "ID" );
			return;
		}
		
		Unit_Sheed sh = Engine_Database.getUnitSheet( headerID );
		
		/*
		 * 			 COST
		 ****************************
		 */
		if( super.isAheader("cost") ){
			
			// checks all resources and adds it to the sheet if a value is given
			for( int i = 0 ; i < Engine_Database.getRessourceTable().size() ; i++ ){
				if( attributes.getValue("ressource_"+i ) != null ) 		sh.setCost( Engine_Database.getResourceSheet(i) , Integer.parseInt( attributes.getValue("ressource_"+i) ) );
			}
		}
		
		/*
		 * 		   MOVEMENT
		 ****************************
		 */
		else if( super.isAheader("movement") ){
			
			if( attributes.getValue("range") != null ) 		sh.setMoveRange( Integer.parseInt(attributes.getValue("range")) );
			if( attributes.getValue("type") != null ) 		sh.setMoveType( Engine_Database.getMoveSheet( attributes.getValue("type")) );
			if( attributes.getValue("vision") != null ) 	sh.setVision( Integer.parseInt(attributes.getValue("vision")) );
			if( attributes.getValue("capture") != null ) 	sh.setCaptureValue( Integer.parseInt(attributes.getValue("capture")) );
			if( attributes.getValue("weight") != null ) 	sh.setWeight( Integer.parseInt(attributes.getValue("weight")) );
			if( attributes.getValue("level") != null ) 		sh.setLevel( Integer.parseInt(attributes.getValue("level")) );
			if( attributes.getValue("hide") != null ) 		sh.setCanHide( Integer.parseInt(attributes.getValue("hide")) );
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
			
			if( attributes.getValue("id") != null ) 		sh.addTag( Engine_Database.getIntegerTagID(attributes.getValue("id")) );
		}
		
		/*
		 * 			 COMBAT
		 ****************************
		 */
		else if( super.getLastHeader().equals("combat") ){
			
			if( attributes.getValue("ammo") != null ) 					sh.setAmmo( Integer.parseInt(attributes.getValue("ammo")) );
		}
		else if( super.isAheader("weapon") ){
			String id = attributes.getValue("id");
			if( id != null ){
				sh.addWeapon( Engine_Database.getWeaponSheet(id) );
			}
		}
		
		/*
		 * 			 SUPPLY
		 ****************************
		 */
		else if( super.isAheader("supply") && super.isAheader("supplytarget") ){
			
			// if the target sheet not exist create new one
			try{ addUnitSheet( attributes.getValue("id") ); }
			catch( Add_Exception e ){ }
			Unit_Sheed sh_supply = Engine_Database.getUnitSheet( attributes.getValue("id") );
			
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
				try{ addUnitSheet( attributes.getValue("id") ); }
				catch( Add_Exception e ){ }
				Unit_Sheed sh_load = Engine_Database.getUnitSheet( attributes.getValue("id") );
				
				sh.addLoadType(sh_load);
			}
			else if( super.isAheader("unloadPlace") ){
				
				// if the target sheet not exist create new one
				try{ addTileSheet( attributes.getValue("id") ); }
				catch( Add_Exception e ){ }
				Tile_Sheet sh_load = Engine_Database.getTileSheet( attributes.getValue("id") );
				
				sh.addUnloadTile( sh_load );
			}
		}
	}
}

