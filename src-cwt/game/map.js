const tileTypeBase = cwt.immutable({
  defense: 0,
  blocksVision: false,
  capturePoints: -1,
  looseAfterCaptured: false,
  changeAfterCaptured: "",
  notTransferable: false,
  funds: 0,
  vision: 0,
  supply: [],
  repairs: [],
  produces: [],
  builds: [],
  rocketsilo: {},
  cannon: {},
  bigProperty: {},
  laser: {},
  blocker: false,
  changeTo: "",
  hp: 0,
  destroyedType: ""
});

// () -> MapModel
cwt.mapModelFactory = (width, height) => ({
  tiles: cwt.intRange(1, width).map(columnId =>
    cwt.intRange(1, height).map(rowId =>
      cwt.tileModelFactory("PLIN")))
});

// (String) -> TileModel
cwt.tileModelFactory = (type) => ({
  type
});

// (Map) -> TileTypeModel
cwt.tileTypeModelFactory = (data) => cwt.flyweight(tileTypeBase, data);

// (MapModel, Int, Int) -> TileModel
cwt.getMapTile = (mapModel, x, y) => mapModel.tiles[x][y];
