package com.client.library;

import com.cwt.logic.mapController.Fight;
import com.cwt.logic.mapController.Fog;
import com.cwt.logic.mapController.Move;
import com.cwt.logic.mapController.TurnController;
import com.cwt.logic.mapController.Weather;
import com.client.model.object.Game;
import com.cwt.model.mapObjects.Player;
import com.cwt.model.mapObjects.Tile;
import com.cwt.model.mapObjects.Unit;
import com.client.state.InGameState;
import com.system.data.Engine_Database;
import com.system.data.DynamicMemory;
import com.system.data.sheets.Unit_Sheed;
import com.system.data.sheets.Weapon_Sheed;
import com.system.data.sheets.Weather_Sheet;
import com.system.log.Logger;
import com.system.network.MessageServer;
import com.system.network.MessageServer.MessageMode;

public class CustomWars_Library {
	
	public static final int MAX_HEALTH = 99;
	
	
	public static void decreaseAttack( int value ){
		if( !Fight.checkStatus() ) return;
		Fight.changeAttackValue( -value );
	}

	public static void increaseAttack( int value ){
		if( !Fight.checkStatus() ) return;
		Fight.changeAttackValue( value );
	}
	
	public static int randomValue( int max ){
		return (int) Math.random() * max;
	}
	
	public static void decreaseMovePoints( int value ){
		Move.changeMovePoints(-value);
	}
	
	public static boolean attackersWeaponIs( String ID ){
		if( !Fight.checkStatus() ) return false;
		if( Fight.getAttackerWeapon().getID().equals(ID) ) return true;
		else return false;
	}
	
	public static Unit returnDefender(){
		if( !Fight.checkStatus() ) return null;
		return Fight.getDefender();
	}
	
	/*
	 * BOOLEAN
	 */
	

	public static boolean isTrue( boolean value ){
		return value;
	}
	
	public static boolean isFalse( boolean value ){
		return ( !value )? true : false;
	}
	
	public static boolean greater( int value1 , int value2 ){
		return ( value1 > value2 )? true : false;
	}
	
	public static boolean lower( int value1 , int value2 ){
		return ( value1 < value2 )? true : false;
	}
	
	public static boolean greaterThan( int value1 , int value2 ){
		return ( value1 >= value2 )? true : false;
	}
	
	public static boolean lowerThan( int value1 , int value2 ){
		return ( value1 <= value2 )? true : false;
	}
	
	public static boolean equals( int value1 , int value2 ){
		return ( value1 == value2 )? true : false;
	}
	
	public static boolean notEquals( int value1 , int value2 ){
		return ( value1 != value2 )? true : false;
	}
	
	public static int getPercentOf( int value , int percent ){
		return value*percent/100;
	}
	
	
	
	/*
	 * 
	 * 
	 * MAP
	 * 
	 */
	
	public static void startMoveAnimation(){
		InGameState.getMap().startMoveAnimation();
	}
	
	public static void waitAnimation(){
            //TODO: commented out; causes errors
		//if( InGameState.getMap().isAnimationRunning() ) MessageServer.send( "waitAnimation=" , true , MessageMode.LOCAL );
	}
	
	public static void turnEnd(){
		TurnController.nextTurn();
	}
	
	public static void processFog(){
		Fog.processFog();
	}
	
	//TODO fix and make safe
	public static int getResource( Player player , int resID ){
		return( player != null )? player.getResourceValue( resID ) : -1;
	}
	
	public static void changeResource( Player player , int resID , int value ){
		player.changeResource( resID , value );
	}
	
	public static void changeResources( boolean pay , Player player , int[] values ){
		int j = 1;
		if( pay ) j = -1;
		for( int i = 0 ; i < values.length ; i++ ) changeResource( player, i, values[i]*j );
	}
	
	public static boolean isWeather( String wt ){
		return ( wt != null && Engine_Database.getWeatherSheet(wt) == Weather.getWeather() )? true : false;
	}
	
	public static void changeWeather( Weather_Sheet sh , int days ){
		Weather.setWeather(sh);
		Weather.setLeftDays(days);
	}
	
	public static void defeatPlayer( Player player ){
		player.getTeam().removeMember(player);
	}
	
	public static Unit getTriggerUnit(){
		return DynamicMemory.getUnit();
	}
	
	public static Tile getTriggerTile(){
		return DynamicMemory.getTile();
	}
	
	public static Unit getUnit( int x , int y ){
		Tile tile = getTile(x, y);
		return ( tile != null )? tile.getUnit() : null;
	}
	
	public static Tile getTile( int x , int y ){
		return Game.getMap().getTile(x, y);
	}
	
	public static void setSight( int value ){
		Fog.setSight(value);
	}
	
	public static void changeSight( int value ){
		Fog.changeSight(value);
	}
	
	
	/*
	 * 
	 * 
	 * UNIT
	 * 
	 * 
	 */
	
	public static void setHealth( Unit unit , int health) {
		unit.setHealth( health );
		if( unit.getHealth() == 0 ){
			
			Tile tile = Game.getMap().findTile(unit);
			
			//TODO show destroy animation
			
			// REMOVE UNIT INSTANCE FROM GAME INSTANCES
			unit.getOwner().removeUnit(unit);
			setUnit( tile, null);
		}
	}
	
	public static void increaseHealth(Unit unit , int health ){
		setHealth( unit, unit.getHealth() + health);
	}
	
	public static void decreaseHealth( Unit unit , int health ){
		setHealth( unit, unit.getHealth() - health);
	} 
	
	public static void setAmmo( Unit unit , int ammo ) {
		unit.setAmmo( ammo );
	}
	
	public static void increaseAmmo( Unit unit , int ammo ){
		setAmmo( unit, unit.getAmmo() + ammo);
	}
	
	public static void decreaseAmmo(  Unit unit , int ammo ){
		setAmmo( unit, unit.getAmmo() - ammo);
	} 
	
	public static void setFuel(  Unit unit , int fuel ) {
		unit.setFuel( fuel );
	}
	
	public static void increaseFuel(  Unit unit , int fuel ){
		setFuel( unit, unit.getFuel() + fuel);
	}
	
	public static void decreaseFuel(  Unit unit , int fuel ){
		setFuel( unit, unit.getFuel() - fuel);
	} 
	
	public static void destroyUnit(  Unit unit ){
		
		// first destroy loads, but serverMSG is true, so will be done locally
		if( unit.getNumberOfLoads() > 0 ) for( Unit load : unit.getLoadedUnits() ){ destroyUnit(load); } 
		
		// remove this unit from owners unit list
		unit.getOwner().removeUnit(unit);
	}
	
	public static int getLeftLoadSpace( Unit unit ){
		int space = unit.sheet().canLoadWeight();
		for( Unit load : unit.getLoadedUnits() ) space -= load.sheet().getWeight();
		return space;
	}
	
	public static boolean canLoadUnit( Unit unit , Unit load ){
		
		if( unit.getLoadedUnits().contains(unit) ) return false;
		int weight = unit.sheet().getWeight();
		
		// IF THE UNIT HAS LOADS, THE WEIGHT INCREASES BY THE LOAD OF THE WEIGHT
		if( unit.getNumberOfLoads() > 0 ) for( Unit load2 : load.getLoadedUnits() ) weight += load2.sheet().getWeight();
		
		// IF MORE WEIGHT THAN SPACE LEFT, RETURN FALSE
		if( weight > getLeftLoadSpace(unit) ) return false;
		return true;
	}
	

	public static int getUnitID( Unit unit ){
		return ( unit.getOwner().getID() * 10000 ) + unit.getOwner().getUnits().indexOf(unit);
	}
	
	public static void unitCanAct(  Unit unit , boolean value ){
		unit.canAct(value);
	}
		
	public static void hideUnit(  Unit unit , boolean value ){
		unit.setHidden(value);
	}
	
	public static void loadUnit(  Unit apc , Unit unit , boolean load ){
		if( load ) apc.addLoad(unit); 
		else apc.removeLoad(unit);
	}
	
	public static void resupplyUnit( boolean serverMSG ){
		//TODO implement!
	}

	public static void tryCapture(  Tile tile , Unit unit ){
		int value = tile.getCapPoints() - unit.sheet().getCaptureValue();
		setCapPoints( tile, value);
		if( tile.getCapPoints() == 0 ){
			changeOwner( tile, unit.getOwner());
			resetCapPoints( tile);
		}
	}
	
	public static void buildUnit(  Tile tile , Unit_Sheed sh , Player player ){
		// create unit and add it to players stack
		Unit unit = new Unit( sh , player );
		player.addUnit(unit);
		setUnit( tile, unit);
	}
	
	public static void unitAttack(  Unit attacker, Unit defender , Weapon_Sheed sh , int damage ){
		setHealth( defender, defender.getHealth()-damage);
		if( sh.getUseAmmo() > 0 ) decreaseAmmo( attacker, sh.getUseAmmo() );
	}
	
	public static int getMaxAmmo( Unit unit ){
		return ( unit != null )? unit.sheet().getAmmo() : 0;  
	}
	
	public static int getMaxFuel( Unit unit ){
		return ( unit != null )? unit.sheet().getFuel() : 0;  
	}
	
	public static int getMaxHealth( Unit unit ){
		return ( unit != null )? MAX_HEALTH : 0;
	}
	
	public static int getHealth( Unit unit ){
		return ( unit != null )? unit.getHealth() : 0;  
	}
	
	public static int getAmmo( Unit unit ){
		return ( unit != null )? unit.getAmmo() : 0;  
	}
	
	public static int getFuel( Unit unit ){
		return ( unit != null )? unit.getFuel() : 0;  
	}
	
	public static boolean isHidden( Unit unit ){
		if( unit == null ) return false;
		return unit.isHidden();
	}
	
	public static Player getOwner( Unit unit ){
		return ( unit != null )? unit.getOwner() : null;
	}
	
	// TODO safer!
	public static int getPrice( Unit unit , String resID ){
		return ( unit != null )? unit.sheet().getCost( Engine_Database.getRessourceSheet(resID) ) : -1;
	}
	
	public static boolean typeOfUnit( Unit unit , String type ){
		if( unit != null && unit.sheet().getID().equals(type) ) return true;
		else return false;
	}
	
	public static boolean unitHasTag( Unit unit , String tag ){
		if( unit != null && unit.sheet().hasTag( Engine_Database.getIntegerTagID(tag) ) ) return true;
		else return false;
	}
	
	
	/*
	 * 
	 * 
	 * TILE
	 * 
	 * 
	 */
	
	public static void setUnit( Tile tile , Unit unit ){
		tile.setUnit(unit);
		InGameState.getMap().updateMapItem( tile.getPosX() , tile.getPosY() );
	}
	
	public static void setCapPoints( Tile tile , int value ){
		if( value < 0 ) value = 0;
		tile.setCapPoints(value);
	}
	
	public static void decreaseCapPoints( Tile tile , int value ){
		setCapPoints( tile, tile.getCapPoints() - value );
	}
	
	public static void resetCapPoints( Tile tile ){
		setCapPoints( tile , tile.sheet().getCapturePoints() );
	}
	
	public static Player getOwnerOfTile( Tile tile ){
		return ( tile != null )? tile.getOwner() : null;
	}
	
	public static int getID( Tile tile ){
		return Game.getMap().getSizeX() * tile.getPosY() + tile.getPosX();
	}
	
	public static void changeOwner( Tile tile , Player player ){
		
		// remove property from previous owners list
		if( tile.getOwner() != null ) tile.getOwner().removeProperty(tile);
		
		// set new owner and add property to the list
		// of the new owner
		tile.setOwner(player);
		player.addProperty(tile);
	}
	
	public static boolean canRepair( Tile tile , Unit unit ){
		if( tile == null || unit == null ) return false;
		if( tile.sheet().canRepair( unit.sheet() ) ) return true;
		return false;
	}
	
	public static boolean typeOfTile( Tile tile , String type ){
		if( tile != null && tile.sheet().getID().equals(type) ) return true;
		else return false;
	}
	
	public static boolean tileHasTag( Tile tile , String tag ){
		Logger.log(""+tile+"---"+tag);
		if( tile != null && tile.sheet().hasTag( Engine_Database.getIntegerTagID(tag) ) ) return true;
		else return false;
	}
	
}
