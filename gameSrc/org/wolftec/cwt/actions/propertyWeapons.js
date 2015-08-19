//"use strict";
//
//require('../actions').unitAction({
//  key: "silofire",
//
//  relation: [
//    "S", "T",
//    cwt.Relationship.RELATION_SAME_THING,
//    cwt.Relationship.RELATION_NONE
//  ],
//
//  relationToProp: [
//    "S", "T",
//    cwt.Player.RELATION_NONE
//  ],
//
//  condition: function (data) {
//    if (!cwt.Silo.isRocketSilo(data.target.property)) return false;
//    if (!cwt.Silo.canBeFired(data.target.property, data.source.unit)) return false;
//    return true;
//  },
//
//  prepareSelection: function (data) {
//    data.selectionRange = data.target.property.type.rocketsilo.range;
//  },
//
//  isTargetValid: function (data, x, y) {
//    return cwt.Silo.canBeFiredTo(data.target.property, x, y);
//  },
//
//  toDataBlock: function (data, dataBlock) {
//    dataBlock.p1 = data.source.x;
//    dataBlock.p2 = data.source.y;
//    dataBlock.p3 = data.targetselection.x;
//    dataBlock.p4 = data.targetselection.y;
//    dataBlock.p5 = data.source.unit.owner.id;
//  },
//
//  parseDataBlock: function (dataBlock) {
//    cwt.Silo.fireSilo(
//      dataBlock.p1,dataBlock.p2,
//      dataBlock.p3,dataBlock.p4,
//      cwt.Player.getInstance(dataBlock.p5)
//    );
//  }
//});
//
//require('../actions').unitAction({
//  key: "fireCannon",
//
//  relation: [
//    "S", "T",
//    cwt.Relationship.RELATION_SAME_THING
//  ],
//
//  condition: function (data) {
//    return (
//      cwt.Cannon.isCannonUnit(data.source.unit) &&
//        cwt.Cannon.hasTargets(data.source.x, data.source.y, null)
//      );
//  },
//
//  targetSelectionType: "A",
//  prepareTargets: function (data) {
//    cwt.Cannon.fillCannonTargets(data.source.x, data.source.y, data.selection);
//  },
//
//  toDataBlock: function (data, dataBlock) {
//    dataBlock.p1 = data.source.x;
//    dataBlock.p2 = data.source.y;
//    dataBlock.p3 = data.targetselection.x;
//    dataBlock.p4 = data.targetselection.y;
//  },
//
//  parseDataBlock: function (dataBlock) {
//    cwt.Cannon.fireCannon(dataBlock.p1, dataBlock.p2,dataBlock.p3, dataBlock.p4);
//  }
//
//});
//
//require('../actions').unitAction({
//  key:"fireLaser",
//
//  relation:[
//    "S","T",
//    cwt.Relationship.RELATION_SAME_THING
//  ],
//
//  condition: function( data ){
//    return cwt.Laser.isLaser(data.target.unit);
//  },
//
//  toDataBlock: function (data, dataBlock) {
//    dataBlock.p1 = data.target.x;
//    dataBlock.p2 = data.target.y;
//  },
//
//  parseDataBlock: function (dataBlock) {
//    cwt.Laser.fireLaser(dataBlock.p1,dataBlock.p2);
//  }
//});
