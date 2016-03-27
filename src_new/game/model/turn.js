class Turn {

  constructor(players) {
    this.players = Require.InstanceOf(players, PlayerHandler);
    this.setTurnOwner(0);
    this.setDay(0);
  }

  setDay(day) {
    this.day = day;
  }

  setTurnOwner(id) {
    Require.isTrue(this.players.isPlayer(id));
    this.turnOwner = id;
    cwt.game_event_turn_changed(this.day, this.turnOwner);
  }

  pickNextTurnOwner() {
    var current_owner_id, next_possible_owner_id;

    current_owner_id = this.turnOwner;
    next_possible_owner_id = current_owner_id;
    do {

      next_possible_owner_id += 1;
      if (next_possible_owner_id === this.players.getNeutralPlayerId()) {
        next_possible_owner_id = 0;

        // if the next possible turn owner is player 0 then
        // it means that means all players acted and the next
        // day starts
        this.setDay(this.day + 1);
      }

      if (this.players.isPlayerActive(next_possible_owner_id)) {
        this.setTurnOwner(this.players.getPlayer(next_possible_owner_id));
        return next_possible_owner_id;
      }

    } while (current_owner_id != next_possible_owner_id);

    Require.isTrue(false, "unable to pick a new turn owner");
  }
}