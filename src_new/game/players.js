var players;

cwt.players_initialize = function() {
  players = cwt.list_created_filled_list_with_provider(MAX_PLAYERS, function(index) {
    return {
      id: index,
      team: -1
    };
  });
};

cwt.players_deactivate_all = function() {
  for (var i = 0; i < players.length; i += 1) {
    players[i].team = -1;
  }
};

cwt.players_set_team = function(id, team) {
  cwt.players_get_player(id).team = cwt.require_integer(team);
};

cwt.players_is_active_player = function(id) {
  return cwt.players_get_player(id).team > -1;
};

cwt.players_is_neutral_id = function(id) {
  return cwt.players_get_neutral_id() === id;
};

cwt.players_is_player_id = function(id) {
  cwt.require_integer(id);
  return id >= 0 && id < MAX_PLAYERS;
};

cwt.players_get_neutral_id = function() {
  return MAX_PLAYERS;
};

cwt.players_get_player = function(id) {
  cwt.require_integer(id);
  cwt.assert_true(id >= 0 && id < MAX_PLAYERS);

  return players[id];
};