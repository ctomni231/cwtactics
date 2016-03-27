class Map {

  constructor(tileDB, msgBrooker) {
    this.map = [];
    for (var x = 0; x < MAX_MAP_WIDTH; x += 1) {
      this.map[x] = [];
    }
    this.width = 10;
    this.height = 10;
    this.tileDB = Require.InstanceOf(tileDB, SheetDatabase);
    this.msgBrooker = Require.InstanceOf(msgBrooker, MessageBrooker);
  }

  setSize(width, height) {
    Require.isInteger(width);
    Require.isInteger(height);
    Require.isTrue(width > 0 && height > 0);

    this.width = width;
    this.height = height;
  }

  fillWithTiles(tileType) {
    // we're doing this to make sure that we got a valid tile type
    this.tileDB.getSheet(tileType);

    for (var x = 0; x < this.width; x += 1) {
      for (var y = 0; y < this.height; y += 1) {
        this.setTile(x, y, tileType);
      }
    }
  }

  getTile(x, y) {
    return this.map[x][y];
  }

  setTile(x, y, type) {
    Require.isInteger(y);
    Require.isInteger(x);
    Require.isString(type);

    this.map[x][y] = type;
    this.msgBrooker.sendMessage("map:tile-set-type", [x, y, type]);
  }
}
