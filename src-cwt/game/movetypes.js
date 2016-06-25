const baseMoveType = cwt.immutable({});

// (MoveType, String) -> Int
cwt.getMoveCosts = (movetype, tileType) =>
  cwt.either(cwt.maybe(movetype.costs[tileType]),
    cwt.either(cwt.maybe(movetype.costs["*"]),
      cwt.just(0)));
