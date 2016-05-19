var turnHandler = {

  setDay(day) {
    this.day = day;
    this.events.publish("turn:day", day);
  },

  setTurnOwner(id) {
    this.turnOwner = id;
    this.events.publish("turn:owner", id);
  },

  pickNextTurnOwner() {
    let currentOwnerId = this.turnOwner;
    let nextOwnerId = currentOwnerId;
    do {

      nextOwnerId++;
      if (nextOwnerId === this.players.getNeutralPlayerId()) {
        nextOwnerId = 0;
        this.setDay(this.day + 1);
      }

      if (this.players.isPlayerActive(nextOwnerId)) {
        this.setTurnOwner(nextOwnerId);
      }

    } while (currentOwnerId != nextOwnerId);

    cwt.raiseError("unable to pick a new turn owner");
  }
};

cwt.produceTurn = function(events, players) {
  var types = cwt.produceTypeAsserter();

  var turn = cwt.produceInstance(turnHandler, {
    events: events,
    players: players
  });

  // TODO factory should no doing things like that 
  turn.setDay(0);
  turn.setTurnOwner(0);

  return turn;
};