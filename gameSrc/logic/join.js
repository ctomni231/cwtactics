var constants = require("../constants");
var assert = require("../functions").assert;
var Unit = require("../model/unit").Unit;

//
// Logic object for the join mechanic.
//
cwt.Join = {

  //
  // Returns **true** if two units can join each other, else **false**. In general both **source** and **target** has
  //to be units of the same type and the target must have 9 or less health points. Transporters cannot join each
  // other when they contain loaded units.
  //
  canJoin: function(source, target) {
    if (constants.DEBUG) {
      assert(source instanceof Unit && target instanceof Unit);
    }

    if (source.type !== target.type) return false;

    // don't increase HP to more then 10
    if (target.hp >= 90) return false;

    // do they have loads?
    if (cwt.Transport.hasLoads(source) || cwt.Transport.hasLoads(target)) return false;

    return true;
  },

  //
  // Joins two units together. If the combined health is greater than the maximum
  // health then the difference will be payed to the owners resource depot.
  //
  join: function(source, x, y) {
    if (this.DEBUG) cwt.assert(source instanceof cwt.UnitClass);

    var target = cwt.Model.mapData[x][y].unit;
    if (this.DEBUG) cwt.assert(target instanceof cwt.UnitClass);
    if (this.DEBUG) cwt.assert(source.type === target.type);

    // hp
    target.heal(cwt.Unit.pointsToHealth(cwt.Unit.healthToPoints(source)), true);

    // ammo
    target.ammo += source.ammo;
    if (target.ammo > target.type.ammo) {
      target.ammo = target.type.ammo;
    }

    // fuel
    target.fuel += source.fuel;
    if (target.fuel > target.type.fuel) {
      target.fuel = target.type.fuel;
    }

    // TODO experience points

    cwt.Lifecycle.destroyUnit(x, y, true);
  }

};
