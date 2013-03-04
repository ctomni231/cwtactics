controller.engineAction({

  name:"changeWeather",
  
  key:"CWTH",
  
  /**
   * @methodOf controller.actions
   * @name changeWeather
   */
  action: function( wth, duration ){
    if( DEBUG ){
      util.log( "changing weather to",wth,"for",duration, "days" );
    }
    
    model.weatherDays = duration;
    model.weather = model.sheets.weatherSheets[ wth ];
    
    // WILL BE DONE AUTOMATICALLY
    // controller.pushAction("CCFO");
  }
});