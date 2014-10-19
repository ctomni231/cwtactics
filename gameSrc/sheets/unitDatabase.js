"use strict";

var SheetDatabaseObject = require("./sheetDatabase").SheetDatabaseObject;

exports.db = new SheetDatabaseObject({

    checks: {
        isMovetypeId: function (v, p) {
            return exports.movetypes.isValidId(v) === p;
        }
    },

    schema: {
        type: 'object',
        required: ['ID', "cost", "range", "vision", "fuel", "movetype"],
        properties: {
            ID: {
                type: 'string',
                isID: true
            },
            cost: {
                type: "integer",
                minimum: -1,
                not: {
                    type: "integer",
                    "enum": [0]
                }
            },
            range: {
                type: "integer",
                minimum: 0,
                maximum: constants.MAX_SELECTION_RANGE
            },
            vision: {
                type: "integer",
                minimum: 1,
                maximum: constants.MAX_SELECTION_RANGE
            },
            fuel: {
                type: "integer",
                minimum: 0,
                maximum: 99
            },
            ammo: {
                type: "integer",
                minimum: 0,
                maximum: 99
            },
            dailyFuelDrain: {
                type: "integer",
                minimum: 1,
                maximum: 99
            },
            dailyFuelDrainHidden: {
                type: "integer",
                minimum: 2,
                maximum: 99
            },
            suicide: {
                type: 'object',
                required: ["damage", "range"],
                properties: {
                    damage: {
                        type: "integer",
                        minimum: 1,
                        maximum: 10
                    },
                    range: {
                        type: "integer",
                        minimum: 1,
                        maximum: constants.MAX_SELECTION_RANGE
                    },
                    nodamage: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }
                }
            },
            movetype: {
                type: "string",
                isMovetypeId: true
            },
            maxloads: {
                type: "integer",
                minimum: 1
            },
            canload: {
                type: "array",
                items: {
                    type: "string"
                }
            },
            captures: {
                type: "integer",
                minimum: 1
            },
            stealth: {
                type: "boolean"
            },
            supply: {
                type: "array",
                items: {
                    type: "string"
                }
            },
            attack: {
                type: "object",
                properties: {
                    minrange: {
                        type: "integer",
                        minimum: 1
                    },
                    maxrange: {
                        type: "integer",
                        minimum: 2
                    },
                    main_wp: {
                        type: "object",
                        patternProperties: {
                            "[a-zA-Z]*": {
                                type: "integer",
                                minimum: 1
                            }
                        }
                    },
                    sec_wp: {
                        type: "object",
                        patternProperties: {
                            "[a-zA-Z]*": {
                                type: "integer",
                                minimum: 1
                            }
                        }
                    }
                }
            }
        }
    }
});