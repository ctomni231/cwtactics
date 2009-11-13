package com.system.reader;

import org.xml.sax.Attributes;

import com.system.ID;
import com.system.data.script.Script;
import com.system.data.script.ScriptFactory;
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
                	ID.Trigger trigger = null;
                		 if( attributes.getValue( "id" ).equals("TURNSTART_FIELDS")) 	trigger = ID.Trigger.TURN_START_FIELDS;
                	else if( attributes.getValue( "id" ).equals("TURNSTART_UNITS")) 	trigger = ID.Trigger.TURN_START_UNITS;
                	else if( attributes.getValue( "id" ).equals("TURNEND_FIELDS")) 		trigger = ID.Trigger.TURN_END_FIELDS;
                	else if( attributes.getValue( "id" ).equals("TURNEND_UNITS")) 		trigger = ID.Trigger.TURN_END_UNITS;
                	else if( attributes.getValue( "id" ).equals("UNIT_ATTACK")) 		trigger = ID.Trigger.UNIT_ATTACK;
                	else if( attributes.getValue( "id" ).equals("UNIT_BUILDED")) 		trigger = ID.Trigger.UNIT_BUILDED;
                	else if( attributes.getValue( "id" ).equals("UNIT_DEFEND")) 		trigger = ID.Trigger.UNIT_DEFEND;
                	else if( attributes.getValue( "id" ).equals("UNIT_DESTROYED")) 		trigger = ID.Trigger.UNIT_DESTROYED;
                	else if( attributes.getValue( "id" ).equals("UNIT_MOVED")) 			trigger = ID.Trigger.UNIT_MOVED;
                	else if( attributes.getValue( "id" ).equals("UNIT_WILL_MOVE")) 		trigger = ID.Trigger.UNIT_WILL_MOVE;
                	else if( attributes.getValue( "id" ).equals("WANT_TO_BUILD")) 		trigger = ID.Trigger.WANT_TO_BUILD;
                	else if( attributes.getValue( "id" ).equals("WEATHER_CHANGED")) 	trigger = ID.Trigger.WEATHER_CHANGED;
                	else if( attributes.getValue( "id" ).equals("PLAYER_LOOSED")) 		trigger = ID.Trigger.PLAYER_LOOSED;
                	else if( attributes.getValue( "id" ).equals("BUILDING_CAPTURED")) 	trigger = ID.Trigger.BUILDING_CAPTURED;
                	else if( attributes.getValue( "id" ).equals("VISION_UNIT")) 		trigger = ID.Trigger.VISION_UNIT;
                	else if( attributes.getValue( "id" ).equals("VISION_TILE")) 		trigger = ID.Trigger.VISION_TILE;
                	
                	if( trigger == null ) System.err.println( "Error , wrong trigger time -->"+attributes.getValue("id"));
                	ScriptFactory.addScript(trigger, new Script() );
                }
            }
        }
		else if( super.getLastHeader().equals("condition") ){
			if( attributes != null ){
                if( attributes.getValue( "text" ) != null ){
                	
                	ScriptFactory.getLast().addCondition( attributes.getValue( "text" ) );
                }
			}
		}
		else if( super.getLastHeader().equals("action") ){
			if( attributes != null ){
                if( attributes.getValue( "text" ) != null ){
                	
                	ScriptFactory.getLast().addAction( attributes.getValue( "text" ) );
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

