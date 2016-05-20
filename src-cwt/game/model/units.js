var unit = {
  type: null
};

var unitHandler = {

};

var unitFactory = {
  cleanUnits() {
    this.units.forEach(unit => unit.type = null);
  },

  createUnit(type, x, y) {
    this.units.find(unit => !unit.type).type = type;
    this.events.publish("game:unit:created", type, x, y);
  }
}

cwt.produceUnitData = function() {
  var list = [];
  cwt.nTimes(50, () => list.push(Object.create(unit)));
  return list;
};

cwt.produceUnitFactory = function(events, units) {
  return Object.assign(Object.create(unitFactory), {
    units,
    events
  });
};

cwt.produceUnitHandler = function(events, units) {
  return Object.assign(Object.create(unitHandler), {
    events
  });
};
