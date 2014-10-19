"use strict";

var SheetDatabaseObject = require("./sheetDatabase").SheetDatabaseObject;

exports.db = new SheetDatabaseObject({
    schema: {
        type: 'object',
        required: ['ID'],
        properties: {
            ID: {
                type: 'string',
                isID: true
            }
        }
    }
});