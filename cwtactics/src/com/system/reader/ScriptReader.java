package com.system.reader;

import org.xml.sax.Attributes;

import com.system.data.script.Script;
import com.system.data.script.ScriptFactory;
import com.system.data.script.ScriptLogic.Trigger;
import com.system.xml.Parser;

public class ScriptReader extends Parser{

	/*
	 *
	 * VARIABLES
	 * *********
	 * 
	 */

	/*
	 *
	 * CONSTRUCTORS
	 * ************
	 * 
	 */
	
	public ScriptReader(String file) {
		super(file);
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

	@Override
	public void entry( Attributes attributes ){
		
		if( attributes == null ) return;
		
		if( super.getLastHeader().equals("trigger") ){
            if( attributes != null ){
                if( attributes.getValue( "id" ) != null ){
                	Trigger trigger = null;
                		 if( attributes.getValue( "id" ).equals("TURNSTART_FIELDS")) 	trigger = Trigger.TURN_START_FIELDS;
                	else if( attributes.getValue( "id" ).equals("TURNSTART_UNITS")) 	trigger = Trigger.TURN_START_UNITS;
                	else if( attributes.getValue( "id" ).equals("TURNEND_FIELDS")) 		trigger = Trigger.TURN_END_FIELDS;
                	else if( attributes.getValue( "id" ).equals("TURNEND_UNITS")) 		trigger = Trigger.TURN_END_UNITS;
                	else if( attributes.getValue( "id" ).equals("UNIT_ATTACK")) 		trigger = Trigger.UNIT_ATTACK;
                	else if( attributes.getValue( "id" ).equals("UNIT_BUILDED")) 		trigger = Trigger.UNIT_BUILDED;
                	else if( attributes.getValue( "id" ).equals("UNIT_DEFEND")) 		trigger = Trigger.UNIT_DEFEND;
                	else if( attributes.getValue( "id" ).equals("UNIT_DESTROYED")) 		trigger = Trigger.UNIT_DESTROYED;
                	else if( attributes.getValue( "id" ).equals("UNIT_MOVED")) 			trigger = Trigger.UNIT_MOVED;
                	else if( attributes.getValue( "id" ).equals("UNIT_WILL_MOVE")) 		trigger = Trigger.UNIT_WILL_MOVE;
                	else if( attributes.getValue( "id" ).equals("WANT_TO_BUILD")) 		trigger = Trigger.WANT_TO_BUILD;
                	else if( attributes.getValue( "id" ).equals("WEATHER_CHANGED")) 	trigger = Trigger.WEATHER_CHANGED;
                	else if( attributes.getValue( "id" ).equals("PLAYER_LOOSED")) 		trigger = Trigger.PLAYER_LOOSED;
                	else if( attributes.getValue( "id" ).equals("BUILDING_CAPTURED")) 	trigger = Trigger.BUILDING_CAPTURED;
                	else if( attributes.getValue( "id" ).equals("VISION_UNIT")) 		trigger = Trigger.VISION_UNIT;
                	else if( attributes.getValue( "id" ).equals("VISION_TILE")) 		trigger = Trigger.VISION_TILE;
                	else if( attributes.getValue( "id" ).equals("MOVE_ONTO"))	 		trigger = Trigger.MOVE_ONTO;
                	
                	if( trigger == null ) System.err.println( "Error , wrong trigger time -->"+attributes.getValue("id"));
                	ScriptFactory.addScript(trigger, new Script() );
                }
            }
        }
		else if( super.getLastHeader().equals("main") ){
			if( attributes != null ){
                if( attributes.getValue( "condition" ) != null ){
                	
                	ScriptFactory.getLast().addMainCondition( attributes.getValue( "condition" ) );
                }
			}
		}
		else if( super.getLastHeader().equals("case") ){
			if( attributes != null ){
                if( attributes.getValue( "action" ) != null ){
         
                	ScriptFactory.getLast().addCase( attributes.getValue( "condition" ), attributes.getValue( "action" ) );
                }
			}
		}
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

