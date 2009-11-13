package com.system.data.script;

import com.client.model.object.Tile;
import com.client.model.object.Unit;
import com.system.ID;
import com.system.ID.Relationship;
import com.system.ID.TriggerTest;
import com.system.data.Data;

public class SingleCondition {

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */

	private ID.TriggerTest 	condition;
	private ID.Relationship relationship;
	private int 			value;

	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public SingleCondition( TriggerTest condition, Relationship relationship, int value) {
		this.condition 		= condition;
		this.relationship 	= relationship;
		this.value 			= value;
	}

	/*
	 *
	 * ACCESSING METHODS
	 * *****************
	 * 
	 */

	/*
	 *
	 * WORK METHODS
	 * ************
	 * 
	 */

	public boolean checkCondition(){
		
		// set variables
		int value 		= this.value;
		Tile field1 	= Trigger_Object.getField1();
		Unit unit1 		= Trigger_Object.getUnit1();
		Tile field2 	= Trigger_Object.getField2();
		Unit unit2 		= Trigger_Object.getUnit2();
		
		
		switch(condition){
		
			// check a field tag
			case FIELD_TAG :
				
				switch(relationship){
				
					// value is the integer ID of the tag
					case IS :
						if( Trigger_Object.getField1().sheet().hasTag(value) ) return true;
						break;
					case IS_NOT :
						if( !Trigger_Object.getField1().sheet().hasTag(value) ) return true;
						break;
					default :
						System.err.println("Error , a single condition contains an unknown id ("+relationship+")");
						break;
				}
				break;
				
			case FIELD_TYPE :
				
				if( Trigger_Object.getField1() == null ) break;
				switch(relationship){
				
				// value is the integer ID of the tag
				case IS :
					if( Trigger_Object.getField1().sheet() == Data.getTileSheet(value) ) return true;
					break;
				case IS_NOT :
					if( Trigger_Object.getField1().sheet() != Data.getTileSheet(value) ) return true;
					break;
				default :
					System.err.println("Error , a single condition contains an unknown id ("+relationship+")");
					break;
				}
				break;
				
			case UNIT_TYPE :
				
				if( Trigger_Object.getField1().getUnit() == null ) break;
				switch(relationship){
				
				// value is the integer ID of the tag
				case IS :
					if( Trigger_Object.getField1().getUnit().sheet() == Data.getUnitSheet(value) ) return true;
					break;
				case IS_NOT :
					if( Trigger_Object.getField1().getUnit().sheet() != Data.getUnitSheet(value) ) return true;
					break;
				default :
					System.err.println("Error , a single condition contains an unknown id ("+relationship+")");
					break;
				}
				break;
				
			// check a unit tag
			case UNIT_TAG :
				
				if( Trigger_Object.getField1().getUnit() == null ) break;
				switch(relationship){
				
					// value is the integer ID of the tag
					case IS :
						if( Trigger_Object.getField1().getUnit().sheet().hasTag(value) ) return true;
						break;
					case IS_NOT :
						if( !Trigger_Object.getField1().getUnit().sheet().hasTag(value) ) return true;
						break;
					default :
						System.err.println("Error , a single condition contains an unknown id ("+relationship+")");
						break;
				}
				break;
				
			// check a field tag
			case ENEMY_FIELD_TAG :
				
				switch(relationship){
				
					// value is the integer ID of the tag
					case IS :
						if( Trigger_Object.getField2().sheet().hasTag(value) ) return true;
						break;
					case IS_NOT :
						if( !Trigger_Object.getField2().sheet().hasTag(value) ) return true;
						break;
					default :
						System.err.println("Error , a single condition contains an unknown id ("+relationship+")");
						break;
				}
				break;
				
			// check a unit tag
			case ENEMY_TAG :
				
				if( Trigger_Object.getField1().getUnit() == null ) break;
				switch(relationship){
				
					// value is the integer ID of the tag
					case IS :
						if( Trigger_Object.getField2().getUnit().sheet().hasTag(value) ) return true;
						break;
					case IS_NOT :
						if( !Trigger_Object.getField2().getUnit().sheet().hasTag(value) ) return true;
						break;
					default :
						System.err.println("Error , a single condition contains an unknown id ("+relationship+")");
						break;
				}
				break;
				
			// check unit fuel
			case FUEL_OF_UNIT :
				
				if( Trigger_Object.getField1().getUnit() == null ) break;
				if( value == ID.FULL ) value = Trigger_Object.getField1().getUnit().sheet().getFuel();
				
				switch(relationship){
					case IS :
						if( Trigger_Object.getUnit1().getFuel() == value ) return true;
						break;
					case IS_NOT :
						if( Trigger_Object.getUnit1().getFuel() != value ) return true;
						break;
					case LESS_THAN :
						if( Trigger_Object.getUnit1().getFuel() < value ) return true;
						break;
					case MORE_THAN :
						if( Trigger_Object.getUnit1().getFuel() > value ) return true;
						break;
					default :
						System.err.println("Error , a single condition contains an unknown id ("+relationship+")");
						break;
				}
				break;
				
			// check unit ammo
			case AMMO_OF_UNIT :

				if( Trigger_Object.getField1().getUnit() == null ) break;
				if( value == ID.FULL ) value = Trigger_Object.getField1().getUnit().sheet().getAmmo();
				
				switch(relationship){
					case IS :
						if( Trigger_Object.getUnit1().getAmmo() == value ) return true;
						break;
					case IS_NOT :
						if( Trigger_Object.getUnit1().getAmmo() != value ) return true;
						break;
					case LESS_THAN :
						if( Trigger_Object.getUnit1().getAmmo() < value ) return true;
						break;
					case MORE_THAN :
						if( Trigger_Object.getUnit1().getAmmo() > value ) return true;
						break;
					default :
						System.err.println("Error , a single condition contains an unknown id ("+relationship+")");
						break;
				}
				break;
				
			// check unit health
			case HEALTH_OF_UNIT :

				if( Trigger_Object.getField1().getUnit() == null ) break;
				// 999999 is the code for full health
				if( value == ID.FULL ) value = 99;
				
				switch(relationship){
					case IS :
						if( Trigger_Object.getUnit1().getHealth() == value ) return true;
						break;
					case IS_NOT :
						if( Trigger_Object.getUnit1().getHealth() != value ) return true;
						break;
					case LESS_THAN :
						if( Trigger_Object.getUnit1().getHealth() < value ) return true;
						break;
					case MORE_THAN :
						if( Trigger_Object.getUnit1().getHealth() > value ) return true;
						break;
					default :
						System.err.println("Error , a single condition contains an unknown id ("+relationship+")");
						break;
				}
				break;
				
			case FIELD :
				
				if( Trigger_Object.getField1().getUnit() == null ) break;
				switch(relationship){
					case CAN_PAY_REPAIR :
						if( value == ID.UNIT && field1.sheet().canPay( field1.sheet().getRepairCost( unit1.sheet() , 20 ), field1.getOwner() ) ) return true;
						else if( value == ID.ENEMY_UNIT && field1.sheet().canPay( field1.sheet().getRepairCost( unit2.sheet() , 20 ), field1.getOwner() ) ) return true;
						break;
					case CAN_REPAIR :
						if( value == ID.UNIT && field1.sheet().canRepair( unit1.sheet() ) ) return true;
						else if( value == ID.ENEMY_UNIT && field1.sheet().canRepair( unit2.sheet() ) ) return true;
						break;
					case IS_OWNER_OF :
						if( value == ID.UNIT && unit1.getOwner() != field1.getOwner() ) return true;
						else if( value == ID.ENEMY_UNIT && unit2.getOwner() != field1.getOwner() ) return true;
						break;
				}
				break;
				
			case UNIT :
				
				if( Trigger_Object.getField1().getUnit() == null ) break;
				switch(relationship){
					case IS_OWNER_OF :
						if( value == ID.UNIT && unit1.getOwner() != field1.getOwner() ) return true;
						else if( value == ID.ENEMY_UNIT && unit2.getOwner() != field1.getOwner() ) return true;
						break;
				}
				break;
				
			default	:
				System.err.println("Error , a single condition contains an unknown id ("+condition+")");
				break;
		}
		
		return false;
	}
	
	/*
	 *
	 * INTERNAL METHODS
	 * ****************
	 * 
	 */

	/*
	 *
	 * OUTPUT METHODS
	 * **************
	 * 
	 */

}

