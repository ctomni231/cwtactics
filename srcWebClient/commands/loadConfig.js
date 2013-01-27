controller.registerCommand({

  key:"loadConfig",
  localAction: true,

  // ------------------------------------------------------------------------
  condition: util.FUNCTION_FALSE_RETURNER,

  // ------------------------------------------------------------------------
  action: function(){
    var config = controller.storage.get("CWT_CONFIG")
    if( config === null ){

      if( CLIENT_DEBUG ){
        util.logInfo("creating fresh configuration object");
      }

      config = {
        lastUpdate: new Date()
      };

      controller.storage.set("CWT_CONFIG", config);
    }

    if( CLIENT_DEBUG ){
      util.logInfo(
        "loaded configuration object (timestamp:",
        config.lastUpdate,
        ")"
      );
    }

    // TODO do what is needed :P
  }
});