// # Mod Loading Module
//
// Simple strategy here:
// 
// 1. Load the internal mod header 
// 2. Load the external mod header
// 3. If the internal mod header is not available or the internal one outdated then re-download mod file
// 4. Use storage mod file 

controller.loadModification = util.singleLazyCall( function( err, baton ){
  if( err ) {
    if( constants.DEBUG ) util.log( "break at load modification due error from previous inits" );
    return baton.pass( true );
  }

  var DEFAULT_MOD_PATH = "../../../mod/cwt";

  if( constants.DEBUG ) util.log( "loading modification" );
  baton.take();

  // create the loading workflow here
  jsFlow
  
    // **FIRST:** grab header files 
    .andThen(function( p,b ){
      b.take();
      controller.storage.get( "mod.header", function( obj ){
        util.grabRemoteFile( {
          
          path: DEFAULT_MOD_PATH + "/header.json",
          json: true,
          
          error: function( msg ){
            baton.drop({ message:msg , stack:null });
          },
            
          success: function( resp ){
            b.pass( [obj.value,resp] );
          }
          
        } );
      } );
    })
    
    // **SECOND:** grab body file
    .andThen(function( p,b ){
      var locale = p[0];
      var remote = p[1];
      
      if( !locale || locale.version < remote.version ){
        // grab new mod body if the current mod header is outdated or not available
        
        util.grabRemoteFile( {
          
          path: DEFAULT_MOD_PATH + "/body.json",
          json: true,
          
          error: function( msg ){
            baton.drop({ message:msg , stack:null });
          },
            
          success: function( resp ){
            controller.storage.set("mod.header",remote,function(){
              controller.storage.set("mod.body",resp,function(){
                b.pass( resp );
              });
            });
          }
          
        });
      }
      else{
        // else use mod from the storage
        
        controller.storage.get("mod.body",function( obj ){
          b.pass( obj.value );
        });
      }
    })
    
    // **LAST:** load mod
    .andThen(function( mod ){
      controller.stateMachine.event( "start", mod );
    })
    
    .start(function( p ){
      if( p ){
        // error was thrown
        
        baton.drop({ where:"modLoader", error:p });
        
      }
      else{
        // no errors at all
        
        baton.pass();
      }
    });
} );