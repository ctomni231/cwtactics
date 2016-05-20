var player = {
  name: "",
  team: -1
};

var playerChanger = {
  cleanPlayers() {
    this.model.forEach(player => player.team = -1);
  },

  activatePlayer(name, team) {
    var slot = this.types.isSomething(this.model.find(player => player.team === -1));
    slot.team = team;
    slot.name = name;
  }
};

cwt.producePlayerData = function() {
  var list = [];
  cwt.nTimes(4, () => list.push(Object.create(player)));
  return list;
};

cwt.producePlayerChanger = function(playerData) {
  return Object.assign(Object.create(playerChanger), {
    model: playerData,
    types: cwt.produceTypeAsserter()
  })
};