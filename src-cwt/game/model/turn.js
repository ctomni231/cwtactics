/**
  @param events
  @param players

  @return {
    setDay(day)
    setTurnOwner(id)
    pickNextTurnOwner()
  }
 */ 
cwt.produceTurn = function(events, players) {
  var types = cwt.produceTypeAsserter();

  var day = 0;
  var owner = 0;

  var turn = {

    setDay(day) {
      day = day;
      events.publish("turn:day", day);
    },

    setTurnOwner(id) {
      owner = id;
      events.publish("turn:owner", id);
    },

    pickNextTurnOwner() {
      const currentOwnerId = owner;
      const nextOwnerId = players.rotate(currentOwnerId + 1).findIndex(el => el.team >= 0);
      if (nextOwnerId < owner) {
        this.setDay(day + 1);
      }
      if (currentOwnerId == nextOwnerId) {
        cwt.raiseError("same owner selected");
      }
      this.setTurnOwner(nextOwnerId);
    }
  };

  return turn;
};