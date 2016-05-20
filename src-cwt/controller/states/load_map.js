cwt.loadMapState = {

  enter() {
    this.events.publish("game:map:load", {
      name: "development fake map",
      height: 15,
      width: 15,
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
};
