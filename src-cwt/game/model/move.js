cwt.produceMovingController = function() {
  return {
    
    moveUnit(map, x, y, way) {

    },

    getMoveCosts(map, x, y, way) {
      assert(model.map_isValidPosition(x, y));

      var v;
      var tmp;

      // grab costs from property or  if not given from tile
      tmp = model.property_posMap[x][y];
      if (tmp) {

        // nobody can move onto an invisible property
        if (tmp.type.blocker) v = -1;
        else v = movetype.costs[tmp.type.ID];
      } else v = movetype.costs[model.map_data[x][y].ID];
      if (typeof v === "number") return v;

      // check wildcard
      v = movetype.costs["*"];
      if (typeof v === "number") return v;

      // no match then return `-1`as not move able
      return -1;
    }
  }
}