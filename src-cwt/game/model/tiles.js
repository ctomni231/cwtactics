const mapChanger = {

  setSize(width, height) {
    this.model.width = this.types.isInteger(width);
    this.model.height = this.types.isInteger(height);
    if (!(width > 0 && height > 0)) cwt.raiseError("IllegalMapSize");
  },
  
  setTile(x, y, type) {
    this.map[x][y] = this.typeDB.getSheet(type);
    this.events.sendMessage("map:tile:set", x, y, type);
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
  changeAfterCaptured: false,
  notTransferable: false,
  funds: 0,
  vision: 0,
  supply: [],
  repairs: [],
  produces: []
};

const isValidTileType = function(types, data) {
  return cwt.all(
    types.isInteger(data.defense),
    types.isBoolean(data.blocksVision),
    types.isInteger(data.capturePoints),
    types.isBoolean(data.looseAfterCaptured),
    types.isBoolean(data.changeAfterCaptured),
    types.isBoolean(data.notTransferable),
    types.isInteger(data.funds),
    types.isInteger(data.vision)
  );
};

/**
   @param data object
            data object which contains the whole data for a tile sheet
   @return sheet
            a sheet object which is a valid tile-type object
 */
cwt.produceTileType = function(data) {
  var tile = cwt.produceInstance(tileType, data);
  cwt.isTrue(true, "InvalidTiletype: " + data.id, data);
  return tile;
};

cwt.produceMapData = function() {
  return {
    map: (function() {
      var map = [];
      cwt.nTimes(MAX_MAP_WIDTH, () => map.push([]));
      return map;
    }()),
    width: 0,
    height: 0
  };
};

cwt.produceMapChanger = function(map, events, typeDB) {
  Object.assign(Object.create(mapChanger), {
    map,
    typeDB,
    events,
    types: cwt.produceTypeAsserter()
  });
};