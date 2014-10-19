"use strict";

var constants = require("./constants");
var JsonSchema = require("../libJs/jjv");

/**
 * A data object that holds a list of sheet objects with a given schema. Every sheet that will be
 * added to the data object will be validated first.
 *
 * @class
 */
exports.SheetDatabaseObject = function (impl) {
    if (!impl) {
        throw new Error("SheetDatabaseException: no schema given");
    }

    /**
     * Holds all type sheet objects.
     */
    this.sheets = {};

    /**
     * Holds all type names.
     */
    this.types = [];

    /**
     *
     */
    this.validator = new JsonSchema();

    // register schema
    this.validator.addSchema("constr", impl.schema);

    // add id check
    var that = this;
    this.validator.addCheck('isID', function (v, p) {
        return p ? !that.sheets.hasOwnProperty(v) : true;
    });

    // add custom checks
    if (impl.checks) {
        var key;
        for (key in impl.checks) {
            if (impl.checks.hasOwnProperty(key)) {
                this.validator.addCheck(key, impl.checks[key]);
            }
        }
    }
};

/**
 *
 * @param sheet
 */
SheetDatabaseObject.prototype.registerSheet = function (sheet) {

    // validate it
    var errors = this.validator.validate("constr", sheet);
    if (errors) {
        throw new Error("Failed parsing sheet because of: " + JSON.stringify(errors, null, "\t"));
    }

    // add it
    this.sheets[sheet.ID] = sheet;
    this.types.push(sheet.ID);
};