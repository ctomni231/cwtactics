class GameFactory {
  static create() {

    var msgBrooker = new MessageBrooker();
    var playerCtx = PlayerContextFactory.create();
    var tileDB = TileDBFactory.create();
    var unitDB = UnitDBFactory.create();
    var movetypeDB = MovetypeDBFactory.create();
    var weatherDB = WeatherDBFactory.create();
    var map = new Map(tileDB, msgBrooker);
    var turn = new Turn(playerCtx.players);
    var unitCtx = new UnitHandler(unitDB, MAX_PLAYERS * MAX_UNITS, msgBrooker);
    var commandInterpreter = CommandInterpreterFactory.create();

    var game = new Game({
      playerCtx,
      unitCtx,
      tileDB,
      unitDB,
      movetypeDB,
      weatherDB,
      weather: new WeatherHandler(weatherDB, msgBrooker),
      turn,
      map,
      mapLoader: MapLoaderFactory.create(map, turn, playerCtx.players, playerCtx.teams, unitCtx),
      msgBrooker,
      commandInterpreter
    });

    return game;
  }
}

class Game {

  constructor(deps) {
    this.tileDB = Require.InstanceOf(deps.tileDB, SheetDatabase);
    this.unitDB = Require.InstanceOf(deps.unitDB, SheetDatabase);
    this.movetypeDB = Require.InstanceOf(deps.movetypeDB, SheetDatabase);
    this.weatherDB = Require.InstanceOf(deps.weatherDB, SheetDatabase);
    this.playerCtx = Require.InstanceOf(deps.playerCtx, PlayerContext);
    this.unitCtx = Require.InstanceOf(deps.unitCtx, UnitHandler);
    this.turn = Require.InstanceOf(deps.turn, Turn);
    this.map = Require.InstanceOf(deps.map, Map);
    this.weather = Require.InstanceOf(deps.weather, WeatherHandler);
    this.commandInterpreter = Require.InstanceOf(deps.commandInterpreter, CommandInterpreter);
    this.mapLoader = Require.InstanceOf(deps.mapLoader, MapLoader);
  }
}
