package com.system.reader;

import java.util.ArrayList;

import com.system.input.KeyValue_Parser;
import com.system.triggerEngine.Script_Database;
import com.system.triggerEngine.script.Script;
import com.system.triggerEngine.script.object.Action;
import com.system.triggerEngine.script.object.Case;
import com.system.triggerEngine.script.object.CommandList_Action;
import com.system.triggerEngine.script.object.Condition;

public class ScriptReader extends KeyValue_Parser{
	
	public ScriptReader(String file) {
		super(file);
		addCodeWords();
	}

	private void addCodeWords(){
		super.addCodeWord("ID");
		super.addCodeWord("IF");
		super.addCodeWord("WHEN");
		super.addCodeWord("CASE");
		super.addCodeWord("DO");
		super.addCodeWord("DO_SWITCH");
		super.addCodeWord("DEFAULT");		
	}

	public void parse(){
		
		super.parserFile();
		ArrayList<String> keys = super.getKeys();
		ArrayList<String> values = super.getValues();
		Script s = null;
		Case caseObj = null;
		for( int i = 0 ; i < keys.size() ; i++ ){
			String strC = values.get(i).replaceAll("_%%_", "#");
			if( keys.get(i).equals("ID") ){
				s = new Script();
			}
			if( keys.get(i).equals("WHEN") ){
				for( String str : strC.split("#") ) Script_Database.addScript( str,  s);
			}
			if( caseObj == null ){
				if( keys.get(i).equals("IF") ){
					for( String str : strC.split("#") ) s.setMain( new Condition( str ) );
				}
				else if( keys.get(i).equals("DEFAULT")){
					for( String str : strC.split("#") ) s.setDefault( new CommandList_Action( str ) );
				}
				else if( keys.get(i).equals("CASE") ){ 
					caseObj = new Case(); 
					for( String str : strC.split("#") ) caseObj.setCondition( new Condition( str ) ); 
					s.addCase( caseObj );
				}
			}
			else{
				if( keys.get(i).equals("DO") ){
					for( String str : strC.split("#") ) caseObj.setAction( new CommandList_Action(  str ) ); 
				}
				else if( keys.get(i).equals("DEFAULT")){
					for( String str : strC.split("#") ) s.setDefault( new CommandList_Action( str ) );
				}
			}
		}
	}
	
}

