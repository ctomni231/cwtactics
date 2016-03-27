class PlayerContextFactory {
  static create() {
    var players = new PlayerHandler(MAX_PLAYERS);
    var teams = new TeamHandler(players);
    return new PlayerContext(players, teams);
  }
}

class PlayerContext {
  constructor(players, teams) {
    this.players = Require.InstanceOf(players, PlayerHandler);
    this.teams = Require.InstanceOf(teams, TeamHandler);
  }
}

class TeamHandler {

  constructor(players) {
    this.players = Require.InstanceOf(players, PlayerHandler);
  }

  inSameTeam(playerIdA, playerIdB) {
    return this.getTeam(playerIdA) == this.getTeam(playerIdB);
  }

  getTeam(playerId) {
    this.players.getPlayer(playerId).team;
  }

  setTeam(playerId, team) {
    this.players.getPlayer(playerId).team = Require.isInteger(team);
  }
}

class PlayerHandler {

  constructor(maxPlayers) {
    this.players = Utility.createFilledListBySupplier(maxPlayers, (index) => new Player(index));
  }

  deactivatePlayers() {
    this.players.forEach(player => player.id = -player.id);
  }

  activatePlayer(id) {
    var player = this.getPlayer(id);
    player.id = Math.abs(player.id);
  }

  isPlayerActive(id) {
    return this.getPlayer(id).id < 0;
  }

  isPlayer(id) {
    Require.isInteger(id);
    return id >= 0 && id < MAX_PLAYERS;
  }

  isNeutralPlayerId(id) {
    return this.getNeutralPlayerId() === id;
  }

  getNeutralPlayerId() {
    return MAX_PLAYERS;
  }

  getPlayer(id) {
    Require.isInteger(id);
    Require.isTrue(id >= 0 && id < MAX_PLAYERS);
    return this.players[id];
  }
}

class Player {
  constructor(id) {
    this.id = id;
    this.name = "Player " + id;
    this.team = id;
  }
}
