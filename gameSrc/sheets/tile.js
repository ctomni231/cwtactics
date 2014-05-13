cwt.TileSheet = new cwt.SheetDatabase({
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

