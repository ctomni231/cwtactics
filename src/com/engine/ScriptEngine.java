package com.engine;

public class ScriptEngine extends EngineHolder{

	public ScriptEngine(Engine e) {
		super(e);
	}
	
	public float getWidth(){
		return Float.parseFloat(asString(callFunction(ENGINE_MODULE.GAME, "mapWidth" )));
	}
	
	public static void main( String[] args ){
		boolean dev = true;

        Engine e = new Engine( dev );
        ScriptEngine eH = new ScriptEngine(e);
        
        // SHOULD BE 0
        logger.fine("controller.currentState = "+
          asString( eH.getProperty( ENGINE_MODULE.CONTROLLER, "currentState"))
        );
        
        System.out.println("Width:"+eH.getWidth());
	}
}
