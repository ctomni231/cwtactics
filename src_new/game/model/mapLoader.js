class MapLoaderFactory {
  static create(map, turn, players, teams, units) {
    return new MapLoader(map, turn, players, teams, units, LoggerFactory.create());
  }
}

class MapLoader {

  constructor(map, turn, players, teams, units, log) {
    this.log = Require.InstanceOf(log, Logger);
    this.map = Require.InstanceOf(map, Map);
    this.turn = Require.InstanceOf(turn, Turn);
    this.players = Require.InstanceOf(players, PlayerHandler);
    this.teams = Require.InstanceOf(teams, TeamHandler);
    this.units = Require.InstanceOf(units, UnitHandler);
  }

  loadMap(map) {
    this.log.info("loading map " + map.name);

    this.turn.setDay(Types.isSomething(map.day) ? map.day : 0);
    this.turn.setTurnOwner(Types.isSomething(map.turn_owner) ? map.turn_owner : 0);

    this.map.setSize(Require.isInteger(map.width), Require.isInteger(map.height));
    this.map.fillWithTiles(Require.isString(map.fill_type));

    var players = this.players;
    var teams = this.teams;

    players.deactivatePlayers();
    if (Types.isSomething(map.players)) {
      if (Types.isInteger(map.players)) {
        for (var i = 0; i < map.players; i += 1) {
          players.activatePlayer(i);
          players.getPlayer(i).name = "Player " + id;
          teams.setTeam(i, i);
        }

      } else {
        map.players.forEach((data, index) => {
          players.activatePlayer(index);
          teams.setTeam(index, Types.isSomething(data.team) ? data.team : index);
          players.getPlayer(index).name = Types.isSomething(data.name) ? data.name : "Player " + index;
        });
      }
    }

    this.units.releaseAllUnits();
    if (Types.isSomething(map.units)) {
      map.units.forEach(data => {
        this.units.createUnitAt(data.type, players.getPlayer(data.owner), data.x, data.y);
      });
    }
  }
}
