// (GameData) -> GameModel
cwt.gameModelFactory = (data) => ({

  map: cwt.mapModelFactory(data.width, data.height),

  turn: cwt.turnModelFactory(data.day, cwt.maybe(data.turnOwner).orElse(0)),

  players: cwt.intRange(1, cwt.MAX_PLAYERS)
    .map(i => cwt.playerFactory()),

  units: cwt.intRange(1, cwt.MAX_UNITS * cwt.MAX_PLAYERS)
    .map(i => cwt.unitFactory("INFT"))
});

// (MapData) -> GameData
cwt.gameDataByMapFactory = (map) => {

};

// (SaveData) -> GameData
cwt.gameDataBySaveFactory = (save) => {

};
