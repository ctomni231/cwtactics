const mapLoader = {
  loadMap(mapData) {
    
    this.mapChanger.setSize(map.width, map.height);
    this.mapChanger.fillWithTiles(map.fill_type);

    this.turn.setDay(cwt.optional(map.day).orElse(0));
    this.turn.setTurnOwner(cwt.optional(map.turn_owner).orElse(0));

    this.playerChanger.cleanPlayers();
    if (this.typeCheck.isInteger(map.players)) {
      cwt.nTimes(map.players, index => this.playerChanger.activatePlayer("Player:" + index, index));
    } else {
      map.players.forEach((data, index) => this.playerChanger.activatePlayer(
        cwt.optional(data.name).orElse("Player:" + index),
        cwt.optional(data.team).orElse(index)
      ));
    }

    this.unitFactory.cleanUnits();
    cwt.optional(map.units).ifPresent(units => units.forEach(data => this.units.createUnitAt(data.type, data.x, data.y)));
  }
};

cwt.produceMapLoader = function(events, unitFactory, mapChanger, playerChanger, turn) {
  return Object.assign(Object.create(mapLoader), {
    events,
    unitFactory,
    turn,
    mapChanger,
    playerChanger,
    types: cwt.produceTypeAsserter(),
    typeCheck: cwt.produceTypeChecker(),
    logger: cwt.produceLogger("MAPLOADER")
  });
};