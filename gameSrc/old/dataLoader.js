controller.dataLoader_start = function( loadDescComponent, loadBarComponent ){



    // **6.B** set custom background for this game instance
    .andThen(function(p,b){
      b.take();

      var el = model.data_menu.bgs[ parseInt( model.data_menu.bgs.length*Math.random(), 10 ) ];
      controller.storage_assets.get( model.data_assets.images + "/"+el,function( obj ){
        if( obj ){
          if( this.DEBUG ) {
            cwt.log("set custom background to",el);
          }

          controller.background_registerAsBackground( obj.value );
        }

        b.pass();
      });
    })

};
