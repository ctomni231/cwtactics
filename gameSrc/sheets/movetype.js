/**
 * Movetype sheet holds the static data of an unit type.
 *
 * @class
 */
cwt.MovetypeSheet = new cwt.SheetDatabase({
  schema: {
    type: 'object',
    required: ['ID','costs'],
    properties: {
      ID: {
        type: 'isID'
      },
      costs:{
        type: 'object',
        patternProperties: {
          '\w+': {
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

/**
 * Registers a non movable move type.
 */
cwt.MovetypeSheet.registerSheet({
  "ID"    : "NO_MOVE",
  "sound" : null,
  "costs" : {
    "*" : -1
  }
});