class UnitDBFactory {
  static create() {
    return new SheetDatabase((sheet, data) => {});
  }
}

class UnitHandler {

  constructor(unitDB, maxUnits, msgBrooker) {
    this.types = Require.InstanceOf(unitDB, SheetDatabase);
    this.units = Utility.createFilledListBySupplier(maxUnits, (index) => new Unit());
    this.positions = {};
    this.msgBrooker = msgBrooker;

    this.releaseAllUnits();
  }

  _getFreeId() {
    for (var i = 0; i < this.units.length; i += 1) {
      if (this.units[i].owner === -1) {
        return i;
      }
    }
    Require.isTrue(false, "no free unit slot left");
  }

  _getPositionCode(x, y) {
    return (x * 1000) + y;
  }

  createUnitAt(type, owner, x, y) {
    var unitId = this._getFreeId();
    this.setUnitOwner(unitId, owner);
    this.setUnitPosition(unitId, x, y);
  }

  setUnitOwner(unitId, owner) {
    this.getUnitById(unitId).owner = Require.InstanceOf(owner, Player).id;
  }

  setUnitPosition(unitId, x, y) {
    Require.isNothing(this.positions[this._getPositionCode(x, y)]);

    var unit = this.getUnitById(unitId);
    delete this.positions[this._getPositionCode(unit.x, unit.y)];

    unit.x = Require.isInteger(x);
    unit.y = Require.isInteger(y);

    Require.isTrue(unit.x >= 0 && unit.y >= 0);
    this.positions[this._getPositionCode(x, y)] = unitId;

    this.msgBrooker.sendMessage("unit:set-position", [unitId, x, y]);
  }

  releaseUnit(unitId) {
    this.getUnitById(unitId).owner = -1;
  }

  releaseAllUnits() {
    this.units.forEach(unit => unit.owner = -1);
  }

  getUnitById(id) {
    return this.units[cwt.require_integer(id)];
  }

  getUnitByPosition(x, y) {
    return Require.isSomething(this.positions[this._getPositionCode(x, y)], "no unit at {" + x + ", " + y + "}");
  }
}

class Unit {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.owner = -1;
  }
}
