class WeatherDBFactory {
  static create() {
    return new SheetDatabase((sheet, data) => {
      sheet.defaultWeather = Types.isBoolean(data.defaultWeather) ? data.defaultWeather : false;
      sheet.minDuration = Require.isInteger(data.minDuration, data.id + ":minDuration");
      sheet.maxDuration = Require.isInteger(data.maxDuration, data.id + ":maxDuration");
    });
  }
}

class WeatherHandler {
  constructor(weatherDB, msgBrooker) {
    this.weatherDB = Require.InstanceOf(weatherDB, SheetDatabase);
    this.msgBrooker = msgBrooker;
    this.active = null;
    this.leftDays = 0;

    this.msgBrooker.subscribe("turn:next-day", () => this.leftDays--);
  }

  setWeather(id) {
    this.active = this.weatherDB.getSheet(id);
    var duration = this.active.minDuration;
    duration += parseInt(Math.random() * (this.active.maxDuration - duration), 10);
    this.leftDays = duration;
    this.msgBrooker.sendMessage("weather:changed", [id, duration]);
  }

  changeWeather() {
    setWeather(this.weatherDB.getRandomSheet());
  }
}
