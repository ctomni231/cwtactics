package com.engine;

/**
 *
 * @author BlackCat
 */
public class EngineTesterMain {
 
  public static void main( String[] args ){
  
    EngineApi.loadEngine();
    EngineApi.loadDevStuff();
    
    while( EngineApi.hasNextAction() ){
      EngineApi.flushNextAction();
    }
    
    JsContext.logger.fine( EngineApi.getModelObject().getPropertyAsString("mapWidth") );
    JsContext.logger.fine( EngineApi.getModelObject().getPropertyAsString("mapHeight") );
  }
  
}
