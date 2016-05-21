cwt.producePlayerData = function() {
  return cwt.makeArray(cwt.MAX_PLAYERS, () => ({
    name: "",
    team: -1
  }));
};

cwt.producePlayerChanger = function(model) {
  const types = cwt.produceTypeAsserter();

  return {
    cleanPlayers() {
      model.forEach(player => player.team = -1);
    },

    activatePlayer(name, team) {
      var slot = types.isSomething(model.find(player => player.team === -1));
      slot.team = team;
      slot.name = name;
    }
  };
};