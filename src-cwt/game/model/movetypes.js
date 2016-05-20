const baseMoveType = {
  costs: {
    "*": 0
  },

  getMoveCosts(targetType) {
    return cwt.optional(this.costs[targetType]).orElse(0);
  }
};

const isValidMoveType = function(data) {
  return cwt.all([
    cwt.types.isString(data.id),
    cwt.types.isMapOf(data.costs, cwt.types.isInteger)
  ]);
};

cwt.produceMoveType = function(data) {
  return cwt.expect(cwt.produceInstance(baseMoveType, data), isValidMoveType);
};
