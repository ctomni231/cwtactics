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

const tiletypeNormalizer = function(types, sheet) {
  types.isInteger(data.defense);

  /*
  sheet.blocksVision = !!data.blocksVision;
  sheet.capturePoints = Types.isInteger(data.capturePoints) ? data.capturePoints : -1;
  sheet.looseAfterCaptured = !!data.looseAfterCaptured;
  sheet.changeAfterCaptured = !!data.changeAfterCaptured;
  sheet.notTransferable = !!data.notTransferable;
  sheet.funds = Types.isInteger(data.funds) ? data.funds : 0;
  sheet.vision = Types.isInteger(data.vision) ? data.vision : 0;
  */
  sheet.supply = cwt.optional(sheet.supply).orElse([]);
  sheet.repairs = cwt.optional(sheet.repairs).orElse([]);
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

cwt.produceTiletypeNormalizer = function() {
  return cwt.partialApplyLeft(tiletypeNormalizer, cwt.produceTypeAsserter());
};