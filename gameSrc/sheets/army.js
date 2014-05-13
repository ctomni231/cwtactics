/**
 * Database for army sheet objects.
 *
 * @type {cwt.SheetDatabase}
 */
cwt.ArmySheet = new cwt.SheetDatabase({
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