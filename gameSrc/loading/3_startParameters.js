cwt.Loading.create(function (next) {
  /*
   .andThen(function( err, baton ){
   if( err ) return err;
   baton.take();

   controller.storage_general.get("cwt_forceTouch",function( obj ){
   var  doIt = (obj && obj.value === true);
   if( !doIt ) doIt = getQueryParams(document.location.search).cwt_forceTouch === "1";

   if(  doIt ){
   if( this.DEBUG ) util.log("force to use touch controls");

   // enable touch and disable mouse ( cannot work together )
   controller.features_client.mouse = false;
   controller.features_client.touch = true;

   // mark forceTouch in the options
   controller.screenStateMachine.structure.OPTIONS.forceTouch = true;
   }

   baton.pass(false);
   });

   })

   .andThen(function( err, baton ){
   if( err ) return err;
   baton.take();

   controller.storage_general.get("cwt_animatedTiles",function( obj ){
   if( obj ){
   if( obj.value === true ) controller.screenStateMachine.structure.OPTIONS.animatedTiles = true;
   else                     controller.screenStateMachine.structure.OPTIONS.animatedTiles = false;

   } else if( getQueryParams(document.location.search).cwt_animatedTiles === "1" ){
   controller.screenStateMachine.structure.OPTIONS.animatedTiles = true;
   } else if( getQueryParams(document.location.search).cwt_animatedTiles === "0" ){
   controller.screenStateMachine.structure.OPTIONS.animatedTiles = false;
   }

   baton.pass(false);
   });

   })
   */

  // wipe out storage ?
  cwt.Storage.generalStorage.get("cwt_resetData",function( obj ){
    var  wipeOut = (obj && obj.value === true);
    if( !wipeOut ) {
      wipeOut = getQueryParams(document.location.search).cwt_resetData === "1";
    }

    if(  wipeOut ){
      if( this.DEBUG ) {
        cwt.log("wipe out cached data");
      }

      cwt.Storage.wipeOutAll(function () {
        next();
      });
    } else {
      next();
    }
  });

});