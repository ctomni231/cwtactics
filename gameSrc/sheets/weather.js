/**
 * Weather sheet database.
 */
cwt.WeatherSheet = new cwt.SheetDatabase({
  schema: {
    type: 'object',
    required: ['ID'],
    properties: {
      ID: {
        type: 'isID'
      },
      defaultWeather: {
        type: 'boolean'
      }
    }
  },

  afterCheck: function (sheet) {
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