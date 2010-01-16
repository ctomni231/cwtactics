package com.client.logic.command;

import com.client.model.Fog;
import com.client.model.Turn;
import com.client.model.Weather;
import com.client.model.object.Game;
import com.client.model.object.Map;
import com.client.model.object.Player;
import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.client.state.InGameState;
import com.system.data.Data;
import com.system.data.sheets.Unit_Sheed;
import com.system.data.sheets.Weapon_Sheed;
import com.system.data.sheets.Weather_Sheet;
import com.system.log.Logger;

public class Command {
	
	public enum Commands{
		
		
		/*
		 * Builds an unit onto a tile. 
		 */
		BUILD_UNIT{
			public void doCommand( String[] str ) {
				
				// get variables
				Tile property = Game.getMap().getTile(str[0],str[1]);
				Unit_Sheed sh = Data.getUnitSheet( str[2] );
				Player player = Game.getPlayer( Integer.parseInt(str[3]) );
				
				// create unit and add it to players stack
				Unit unit = new Unit( sh , player );
				property.setUnit(unit);
				player.addUnit(unit);
				
				// update graphic engine
				InGameState.getMap().updateMapItem( property.getPosX() , property.getPosY() );
			}
			
		},
		
		
		/*
		 * Unit captures a given property.  
		 */
		CAPTURE_BUILDING{
			
			public void doCommand( String[] str ){
				
				// get variables
				Tile property = Game.getMap().getTile(str[0],str[1]);
				Unit unit = Map.getUnit( Integer.parseInt( str[2]) );
				
				// decrease capture points
				property.decreaseCapPoints( unit.sheet().getCaptureValue() );
				
				// change owner if capture value of the property
				// is zero
				if( property.getCapPoints() == 0 ){
					
					property.changeOwner(unit.getOwner());
					property.resetCapPoints();
				}
			}
		},
		
		
		/*
		 * Changes the resource values of a player by a given 
		 * array of resource values.
		 */
		CHANGE_RESOURCE{
			
			public void doCommand( String[] args ){
				
				// get variables
				int multi = 1;
				if( Integer.parseInt( args[0]) == 1 ) multi = -1;
				Player player = Game.getPlayer( Integer.parseInt( args[1]) );
				
				for( int i = 2; i < args.length ; i++ ){
					
					String name = Data.getRessourceTable().get(i-2).getName();
					int value = Integer.parseInt(args[i]);
					
					// pay every cost from players resource pool
					player.changeResource( i-2 , multi * Integer.parseInt(args[i]) );
					
					// shows some debug information
					if( multi == -1 ) Logger.log( "Player "+player.getName()+" pays "+value+" of "+name );
					else Logger.log( "Player "+player.getName()+" got "+value+" of "+name );
				}
			}
		},
		
		
		/*
		 * Changes the weather to a given weather sheet 
		 * for a given period of time.
		 */
		CHANGE_WEATHER{
			
			public void doCommand( String[] args ){
				
				Weather_Sheet sh = Data.getWeatherSheet( args[0] );
				int days = Integer.parseInt( args[1]);
				
				Weather.setWeather(sh);
				Weather.setLeftDays(days);
				
				// debug
				Logger.log("Weather changes to "+sh.getName()+" for "+days+" days.");
			}
		},
		
		
		/*
		 * Decreases the ammo of an unit for 
		 * a given weapon.
		 */
		DECREASE_AMMO{

			public void doCommand( String[] str ) {
				
				// get variables
				Unit unit = Map.getUnit( Integer.parseInt( str[0] ) );
				Weapon_Sheed sheet = Data.getWeaponSheet( str[1] );
				
				// only decrease if the weapon uses ammo
				if( sheet.getUseAmmo() > 0 ) unit.decreaseAmmo( sheet.getUseAmmo() );
			}
		},
		
		DECREASE_FUEL{

			public void doCommand( String[] str ) {
				
				// get variables
				Unit unit = Map.getUnit( Integer.parseInt( str[0] ) );
				int amount = Integer.parseInt( str[1] );
				
				unit.decreaseFuel(amount);
			}
		},
		
		DEFEAT_PLAYER{

			public void doCommand( String[] str ) {
				
				// get variables
				Player player = Game.getPlayer( Integer.parseInt( str[0]) );
				
				player.getTeam().removeMember(player);
			}
		},
		
		/*
		 * Sets an unit onto a tile.
		 */
		TILE_SET_UNIT{
			
			public void doCommand( String[] str ) {

				// get variables
				Tile tile = Game.getMap().getTile(str[0],str[1]);
				Unit unit = null;
				if( str.length == 3 ) unit = Map.getUnit( Integer.parseInt( str[2]) );
				
				// set unit and update MapDraw
				tile.setUnit(unit);
				InGameState.getMap().updateMapItem( tile.getPosX() , tile.getPosY() );
			}
		},
		
		HIDE_UNIT{

			public void doCommand( String[] str ) {
				
				// get variables
				boolean hide = false;
				Unit unit = Map.getUnit( Integer.parseInt( str[0] ) );
				if( Integer.parseInt( str[1] ) == 1 ) hide = true; 
				
				unit.setHidden(hide);
			}
		},
		
		LOAD_UNIT{

			public void doCommand( String[] str ) {
				
				// get variables
				boolean loading = false;
				Unit apc = Map.getUnit( Integer.parseInt( str[0] ) );
				Unit load = Map.getUnit( Integer.parseInt( str[1] ) );
				if( Integer.parseInt( str[2] ) == 1 ) loading = true; 
				
				// if loading true load unit, else unload it from apc
				if( loading ) 	apc.addLoad( load );
				else 			apc.removeLoad(load);
			}
		},
		
		PROCESS_FOG{

			public void doCommand( String[] str ) {
				Fog.processFog();
			}
		},
		
		REPAIR_UNIT{

			public void doCommand( String[] str ) {
				
				Unit unit = Map.getUnit( Integer.parseInt( str[0] ) );
				int health = Integer.parseInt( str[1] );
				
				unit.increaseHealth(health);
			}
		},
		
		RESUPPLY_UNIT{

			public void doCommand( String[] str ) {
				
				//TODO Code is missing xD
			}
		},
		
		SET_DAMAGE{

			public void doCommand( String[] str ) {
				
				Unit unit = Map.getUnit( Integer.parseInt( str[0] ) );
				int damage = Integer.parseInt( str[1] );
				
				if( damage <= 0 ) return;
				
				// GIVE DAMAGE
				unit.decreaseHealth(damage);
				
				// REMOVE UNIT IF HEALTH IS 0
				if( unit.getHealth() == 0 ){
					
					Tile tile = Game.getMap().findTile(unit);
					
					//TODO show destroy animation
					
					// REMOVE UNIT INSTANCE FROM GAME INSTANCES
					unit.getOwner().removeUnit(unit);
					
					// TODO add Tile_Set_Unit command locally here!
				}
			}
		},
		
		START_MOVE_ANIMATION{

			public void doCommand( String[] str ) {
				InGameState.getMap().startMoveAnimation();
			}
		},
		
		WAIT_ANIMATION{

			public void doCommand( String[] str ) {

				if( InGameState.getMap().isAnimationRunning() ){
					//TODO code missing xD
					MessageServer.sendLocalToFirstPos( null );
				}
			}
		},
		
		TRY_REPAIR{

			public void doCommand( String[] str ) {
				
				// get variables
				Tile tile = Game.getMap().getTile( str[0], str[1] );
				Unit unit = Map.getUnit( Integer.parseInt( str[2] ) );
				int amount = Integer.parseInt( str[3] );
				Player player = unit.getOwner();
				int[] cost = tile.sheet().getRepairCost( unit.sheet() , amount );
				
				// can player pay this amount of money ?
				for( int i = 0 ; i < cost.length ; i++ ){
					
					// if you can't pay that resource, skip repair
					if( player.getResourceValue(i) - cost[i] < 0 ) return; 
				}
				
				// increase health and decrease resources of player
				//MessageServer.sendLocalToFirstPos( new RepairUnit(unit, amount) );
				//MessageServer.sendLocalToFirstPos( new ChangeResource(cost, tile.getOwner() , true) );
			}
		},
		
		TURN_END{

			public void doCommand( String[] str ) {
				
				Turn.nextTurn();
			}
		},
		
		UNIT_ATTACK{

			public void doCommand( String[] str ) {
				
				// get variables
				Unit attacker = Map.getUnit( Integer.parseInt( str[0] ) );
				Unit defender = Map.getUnit( Integer.parseInt( str[1] ) );
				Weapon_Sheed weapon =  Data.getWeaponSheet( str[2] );
				int attack = Integer.parseInt( str[3] );
				
				//MessageServer.sendLocalToFirstPos( new SetDamage( defender , attack) );
				//MessageServer.sendLocalToFirstPos( new DecreaseAmmo( attacker , weapon ) );
			}
		},
		
		UNIT_CAN_ACT{

			public void doCommand( String[] str ) {
				
				// get variables
				boolean canAct = false;
				Unit unit = Map.getUnit( Integer.parseInt( str[0] ) );
				if( Integer.parseInt(str[1]) == 1 ) canAct = true;
				
				unit.canAct(canAct);
			}
		};
		
		// ABSTRACT METHODS
		public abstract void doCommand( String[] str );

	}

}
