cwt.game_state_add_state("load_map", {

  on_enter: function() {
    cwt.log_info("loading fake map");

    cwt.client_event_load_map({
      name: "development fake map",
      height: 10,
      width: 10,
      day: 10,
      fill_type: "PLIN",
      players: [{
        team: 3,
        name: "Willy Wonker"
      }, {
        team: 1
      }],
      units: [{
        type: "INFT",
        x: 2,
        y: 2,
        owner: 0
      }, {
        type: "INFT",
        x: 3,
        y: 4,
        owner: 0
      }, {
        type: "INFT",
        x: 3,
        y: 3,
        owner: 1
      }]
    });
  }
});