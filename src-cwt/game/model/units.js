var unit = {
  type: null
};

cwt.produceUnitData = function() {
  return cwt.makeArray(cwt.MAX_UNITS, () => Object.create(unit));
};

cwt.produceUnitFactory = function(events, units) {
  return {
    events,
    units,

    cleanUnits() {
      this.units.forEach(unit => unit.type = null);
    },

    createUnit(type, x, y) {
      this.units.find(unit => !unit.type).type = type;
      this.events.publish("game:unit:created", type, x, y);
    }
  };
};

cwt.produceUnitHandler = function(events, units) {
  return {
    events,
    units
  };
};