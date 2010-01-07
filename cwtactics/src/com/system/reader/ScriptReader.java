package com.system.reader;

import org.xml.sax.Attributes;

import com.system.data.script.Script;
import com.system.data.script.ScriptFactory;
import com.system.data.script.ScriptLogic;
import com.system.data.script.ScriptLogic.ScriptKey;
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
                	Trigger trigger = ScriptLogic.getTrigger( attributes.getValue( "id" ) );
                	if( trigger != null ) ScriptFactory.addScript(trigger, new Script() );
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

