/**
 *
 */
cwt.PropertySheet = new cwt.SheetDatabase({
  schema: {
    type: 'object',
    required: ['ID'],
    properties: {
      ID: {
        type: 'isID'
      },
      defense: {
        type:  'integer',
        minimum: 0
      },
      vision: {
        type:  'integer',
        minimum: 0
      },
      capturePoints: {
        type:  'integer',
        minimum: 1
      },
      blocker: {
        type:  'boolean'
      }
    }
  }
});

/**
 * Invisible property type.
 */
cwt.PropertySheet.registerSheet({
  "ID"            : "PROP_INV",
  "defense"       : 0,
  "vision"        : 0,
  "capturePoints" : 1,
  "blocker"       : true,
  "assets"        : {}
});