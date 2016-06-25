const mapChanger = {

  setSize(width, height) {
    this.model.width = this.types.isInteger(width);
    this.model.height = this.types.isInteger(height);
    if (!(width > 0 && height > 0)) cwt.raiseError("IllegalMapSize");
  },

  setTile(x, y, type) {
    this.model.map[x][y] = this.typeDB.getSheet(type);
    this.events.publish("map:tile:set", x, y, type);
  },

  fillWithType(type) {
    for (var x = 0; x < this.model.width; x += 1) {
      for (var y = 0; y < this.model.height; y += 1) {
        this.setTile(x, y, type);
      }
    }
  }
};

const tileType = {
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
};

const tileTypeValidators = {/*
  id: cwt.types.isString,
  defense: cwt.types.isInteger,
  blocksVision: cwt.types.isBoolean,
  capturePoints: cwt.types.isInteger,
  looseAfterCaptured: cwt.types.isBoolean,
  changeAfterCaptured: cwt.types.isString,
  notTransferable: cwt.types.isBoolean,
  funds: cwt.types.isInteger,
  vision: cwt.types.isInteger,
  supply: cwt.types.isSomething,
  repairs: cwt.types.isSomething,
  produces: cwt.types.isSomething,
  builds: cwt.types.isSomething,
  // to be optimized
  cannon: cwt.types.isSomething,
  laser: cwt.types.isSomething,
  bigProperty: cwt.types.isSomething,
  rocketsilo: cwt.types.isSomething,
  changeTo: cwt.types.isString,
  hp: cwt.types.isInteger,
  destroyedType: cwt.types.isString,
  blocker: cwt.types.isBoolean,
  // must be removed somehow
  assets: cwt.types.isSomething */
};

const isValidTileType = function(types, data) {
  return false; // return Object.keys(data).every(key => tileTypeValidators[key](data[key]));
};

/**
   @param data object
            data object which contains the whole data for a tile sheet
   @return sheet
            a sheet object which is a valid tile-type object
 */
cwt.produceTileType = function(data) {
  var tile = cwt.produceInstance(tileType, data);
  if (!isValidTileType(cwt.types, tile)) {
    cwt.raiseError("InvalidTiletype: " + data.id);
  }
  return tile;
};

cwt.produceMapStruct = function() {
  return {
    map: cwt.makeArray(cwt.MAX_MAP_WIDTH, () => []),
    width: 0,
    height: 0
  };
};

cwt.produceMapChanger = function(map, events, typeDB) {
  return cwt.produceInstance(mapChanger, {
    model:map,
    typeDB,
    events,
    types: cwt.produceTypeAsserter()
  });
};
