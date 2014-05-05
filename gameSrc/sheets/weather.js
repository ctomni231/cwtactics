/**
 * Weather sheet database.
 */
cwt.WeatherSheet = new cwt.SheetDatabase({

  check: function ( sheet ) {
    if (sheet.defaultWeather) {
      cwt.WeatherSheet.defaultWeather = sheet;
    }
  }

});

/**
 * Holds the default weather type.
 *
 * @type {null}
 */
cwt.WeatherSheet.defaultWeather = null;