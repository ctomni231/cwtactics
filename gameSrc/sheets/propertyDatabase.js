"use strict";

var SheetDatabaseObject = require("./sheetDatabase").SheetDatabaseObject;

exports.db = new SheetDatabaseObject({
    schema: {
        type: 'object',
        required: ['ID', "defense", "vision"],
        properties: {
            ID: {
                type: 'string',
                isID: true
            },
            defense: {
                type: 'integer',
                minimum: 0
            },
            vision: {
                type: 'integer',
                minimum: 0
            },
            capturePoints: {
                type: 'integer',
                minimum: 1
            },
            blocker: {
                type: 'boolean'
            }
        }
    }
});