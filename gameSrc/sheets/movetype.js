"use strict";

var SheetDatabaseObject = require("./sheetDatabase").SheetDatabaseObject;

exports.db = new SheetDatabaseObject({
    schema: {
        type: 'object',
        required: ['ID', 'costs'],
        properties: {
            ID: {
                type: 'string',
                isID: true
            },
            costs: {
                type: 'object',
                patternProperties: {
                    "\w+": {
                        type: 'integer',
                        minimum: -1,
                        maximum: 100,
                        not: 0
                    }
                }
            }
        }
    }
});