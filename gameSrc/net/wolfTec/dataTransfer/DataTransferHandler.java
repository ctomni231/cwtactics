package net.wolfTec.dataTransfer;

import net.wolfTec.cwt.Constants;
import net.wolfTec.loading.Modification;

public class DataTransferHandler {

	public static final String LOG_HEADER = Constants.logHeader("datatransfer");

	public final AudioTransfer audio;
	public final ImageTransfer image;
	public final MapTransfer map;
	public final ConfigTransfer config;
	public final URLParameterTransfer urlParam;
	public Modification mod;

	public DataTransferHandler() {
		audio = new AudioTransfer();
		image = new ImageTransfer();
		map = new MapTransfer();
		config = new ConfigTransfer();
		urlParam = new URLParameterTransfer();
	}
}
// TODO entfernen

/*
 cwt.assert(Array.isArray(data.units));
 cwt.assert(Array.isArray(data.prps));
 cwt.assert(cwt.WeatherSheet.sheets.hasOwnProperty(data.wth));
 cwt.assert(data.trOw >= 0 && data.trOw < 9999999);
 cwt.assert(data.day >= 0 && data.day < 9999999);
 cwt.assert(data.gmTm >= 0);
 cwt.assert(data.tnTm >= 0);
 // check_ data
 cwt.assert(playerData[0] >= 0 && playerData[0] < cwt.Player.MULTITON_INSTANCES);
 cwt.assert(typeof playerData[1] === "string");
 cwt.assert(playerData[3] >= 0 && playerData[3] < cwt.Player.MULTITON_INSTANCES);
 cwt.assert(playerData[2] >= 0 && playerData[2] < 999999);
 cwt.assert(playerData[4] >= 0 && playerData[4] < 999999);

 // check_ map data
 cwt.assert(unitData[0] >= 0 && unitData[0] < cwt.Unit.MULTITON_INSTANCES);
 cwt.assert(cwt.UnitSheet.sheets.hasOwnProperty(unitData[1]));
 cwt.assert(that.isValidPosition(unitData[2], unitData[3]));
 cwt.assert(unitData[4] >= 1 && unitData[4] <= 99);

 var type = cwt.UnitSheet.sheets[unitData[1]];
 cwt.assert(unitData[5] >= 0 && unitData[5] <= type.ammo);
 cwt.assert(unitData[6] >= 0 && unitData[6] <= type.fuel);
 cwt.assert(typeof unitData[7] === "number");
 cwt.assert(unitData[8] >= -1 && unitData[8] < cwt.Player.MULTITON_INSTANCES);
 cwt.assert(unitData.length < 10 || typeof unitData[9] === "boolean");
 cwt.assert(unitData.length < 11 || typeof unitData[10] === "boolean");


 // check_ map data
 cwt.assert(propData[0] >= 0 && propData[0] < cwt.Property.MULTITON_INSTANCES);
 cwt.assert(propData[1] >= 0 && propData[1] < that.width);
 cwt.assert(propData[2] >= 0 && propData[2] < that.height);
 cwt.assert(cwt.PropertySheet.sheets.hasOwnProperty(propData[3]));
 cwt.assert(propData[5] >= -1 && propData[5] < cwt.Player.MULTITON_INSTANCES);

 //cwt.assert(
 //  (util.isString(propData[3]) && !util.isUndefined(model.data_tileSheets[propData[3]].capturePoints)) ||
 //    typeof model.data_tileSheets[propData[3]].cannon !== "undefined" ||
 //    typeof model.data_tileSheets[propData[3]].laser !== "undefined" ||
 //    typeof model.data_tileSheets[propData[3]].rocketsilo !== "undefined"
 //);

 //cwt.assert((util.intRange(propData[4], 1, // capture points
 //  model.data_tileSheets[propData[3]].capturePoints)) ||
 // (util.intRange(propData[4], -99, -1)) ||
 //  typeof model.data_tileSheets[propData[3]].rocketsilo !== "undefined"
 //);





 (function () {

 function placeCannonMetaData(x, y) {
 var prop = model.property_posMap[x][y];
 var cannon = prop.type.cannon;
 var size = prop.type.bigProperty;

 cwt.assert(x - size.x >= 0);
 cwt.assert(y - size.y >= 0);

 var ax = x - size.actor[0];
 var ay = y - size.actor[1];
 var ox = x;
 var oy = y;
 for (var xe = x - size.x; x > xe; x--) {

 y = oy;
 for (var ye = y - size.y; y > ye; y--) {

 // place blocker
 if (x !== ox || y !== oy) {
 if (this.DEBUG) util.log("creating invisible property at", x, ",", y);
 model.events.property_createProperty(prop.owner, x, y, "PROP_INV");
 }

 // place actor
 if (x === ax && y === ay) {
 if (this.DEBUG) util.log("creating cannon unit at", x, ",", y);
 model.events.createUnit(model.unit_getFreeSlot(prop.owner), prop.owner,
 x, y, "CANNON_UNIT_INV");
 }

 }
 }
 }

 // // Places the necessary meta units for bigger properties.
 //
 model.event_on("gameround_start", function () {
 for (var x = 0, xe = model.map_width; x < xe; x++) {
 for (var y = 0, ye = model.map_height; y < ye; y++) {

 var prop = model.property_posMap[x][y];
 if (prop) {

 if (prop.type.bigProperty && prop.type.cannon) {
 placeCannonMetaData(x, y);
 } else if (prop.type.cannon) {
 if (this.DEBUG) util.log("creating cannon unit at", x, ",", y);
 model.events.createUnit(model.unit_getFreeSlot(prop.owner), prop.owner,
 x, y, "CANNON_UNIT_INV");
 } else if (prop.type.laser) {
 if (this.DEBUG) util.log("creating laser unit at", x, ",", y);
 model.events.createUnit(model.unit_getFreeSlot(prop.owner), prop.owner,
 x, y, "LASER_UNIT_INV");
 }

 }
 }
 }
 });

 })();
 //*/