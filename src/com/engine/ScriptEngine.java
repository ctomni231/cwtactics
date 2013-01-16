package com.engine;

public class ScriptEngine extends EngineHolder{

	public ScriptEngine(Engine e) {
            super(e);
	}
	
	public float getWidth(){
            return Float.parseFloat(
                castString(
                    getProperty(ENGINE_MODULE.MODEL, "mapWidth" )
                )
            );
	}
	
	public static void main( String[] args ){
            
            boolean dev = true;

            Engine e = new Engine( dev );
            ScriptEngine eH = new ScriptEngine(e);

            // DO GAME COMMANDS ( LOAD MOD AND TEST MAP )
            while( 
             ! castBoolean(
                eH.callFunction(ENGINE_MODULE.CONTROLLER, "isBufferEmpty"))
            ){

                eH.callFunction(
                    ENGINE_MODULE.CONTROLLER,
                    "evalNextMessageFromBuffer"
                );
            }

            System.out.println("testMap width => "+ eH.getWidth() );

            System.out.println("testMap height => "+
              castString( eH.getProperty( ENGINE_MODULE.MODEL, "mapHeight"))
            );
	}
}
