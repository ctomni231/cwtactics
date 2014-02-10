//
//
controller.modification_load = util.singleLazyCall( function( err, baton ){
  if( DEBUG ) util.log( "loading modification" );

  var MOD_KEY = "modification_data";

  function addModPart( file, baton ){
    baton.take();
    util.grabRemoteFile({
      path: MOD_PATH + file + ".json",
      json: true,
      
      error: function( msg ){
        baton.drop(msg);
      },
      
      success: function( resp ){
        mod[file] = resp;
        baton.pass();
      }
    });
  }
  
  function loadLanguage(p,b){ 
    
    // try to grab browser specific language
    var lang = window.navigator.language;
    if( lang && lang !== "en" ){

      b.take();
      util.grabRemoteFile({
        path: MOD_PATH + "/language_" + lang + ".json",
        json: true,
        
        error: function( msg ){
          util.grabRemoteFile({
            path: MOD_PATH + "/language.json",
            json: true,
            
            error: function( msg ){
              baton.drop({ 
                message:msg, 
                stack:null 
              });
            },
            
            success: function( resp ){
              mod["language"] = resp;
              b.pass();
            }
          });
        },
        
        success: function( resp ){
          mod["language"] = resp;
          b.pass();
        }
      });
    }
    else addModPart( "language", b );
  }
  
  // lock 
  baton.take();
  
  var mod;
  
  // create the loading workflow here
  jWorkflow.order()
  
    // **1.** check stored data
    .andThen(function( p,b ){
      b.take();
      controller.storage_general.get( MOD_KEY,function( obj ){
        if( !obj ){
          mod = {};
          b.pass(true);
        }
        else{
          mod = obj.value;
          b.pass(false);
        }
      })
    })

    // **2.** exists then skip loading
    .andThen(function( modExists,subBaton ){
      if( modExists ){
        if( DEBUG ) util.log( "grab new modification" );

        subBaton.take();

        // load all components of a modification
        jWorkflow.order()
          .andThen(function(p,b){ addModPart( "header",     b ); })
          .andThen(function(p,b){ addModPart( "co",         b ); })
          // .andThen(function(p,b){ addModPart( "credits",    b ); })
          .andThen(function(p,b){ addModPart( "fraction",   b ); })
          .andThen(function(p,b){ addModPart( "gamemode",   b ); })
          .andThen(function(p,b){ addModPart( "maps",       b ); })
          .andThen(function(p,b){ addModPart( "movetypes",  b ); })
          .andThen(function(p,b){ addModPart( "globalrules",b ); })
          .andThen(function(p,b){ addModPart( "sounds",     b ); })
          .andThen(function(p,b){ addModPart( "menu",       b ); })
          .andThen(function(p,b){ addModPart( "tiles",      b ); })
          .andThen(function(p,b){ addModPart( "units",      b ); })
          .andThen(function(p,b){ addModPart( "weathers",   b ); })
          .andThen(function(p,b){ addModPart( "assets",     b ); })
          .andThen(function(p,b){ addModPart( "graphics",   b ); })
          .andThen(function(p,b){ addModPart( "tips",       b ); })
          .andThen(loadLanguage)
          .start(function(p){

            if( p ){
              if( DEBUG ) util.log( "failed to grab modification" );
              subBaton.drop(p);
            } else {
              if( DEBUG ) util.log( "finished grabbing modification" );
              subBaton.pass(true);
            }
          });
      } else {
        return false;
      }
    })

    // **3.** save mod
    .andThen(function(modGrabbed,b){

      // do not save the modification in the debug mode
      if(!DEBUG){
        if( modGrabbed ){
          b.take();
          controller.storage_general.set(MOD_KEY,mod,function(){
            b.pass();
          });
        }
      } else {
        util.log("will not caching modification data because being in debug mode");
      }
    })

    // **4.** place mod
    .andThen(function(){
      model.modification_load( mod );
    })

    // **5.** end flow callback
    .start(function( p ){
      if( p ) baton.drop( p );
      else 		baton.pass();
    });
});