"use strict";

var SheetDatabaseObject = require("./sheetDatabase").SheetDatabaseObject;

exports.db = new SheetDatabaseObject({
    schema: {
        type: 'object',
        required: ['ID', "defense"],
        properties: {
            ID: {
                type: 'string',
                isID: true
            },
            defense: {
                type: "number",
                minimum: 0
            }
        }
    }
});