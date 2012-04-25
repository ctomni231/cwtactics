/**
 * validator schema for an unit sheet.
 */
sheets.UnitSheet = {
  type: 'object',
  properties:{

    ID: {
      type:'string'
      //notPropertyOf: cwtSheets.sheetKeys
    },

    maxAmmo: {
      type:'integer',
      minimum:0,
      maximum:99
    },

    maxFuel: {
      type:'integer',
      minimum: 0,
      maximum:99
    },

    moveRange: {
      type:'integer',
      minimum: 0,
      maximum:15
    },

    //@TODO fix it, only movesheets should be possible
    moveType: {
      type:'string'
      //isPropertyOf: cwtSheets.sheetKeys,
      //valueValidsSchema: cwtSheets.Schema.MoveTypeSheet
    }
  }
};

/**
 * vaidator schema for a move type sheet.
 */
sheets.MoveTypeSheet= {
  type: 'object',
  properties: {
    ID: {
      type:'string'
      //notPropertyOf: cwtSheets.sheetKeys
    }
  }
};

/**
 * validator schema for a property sheet.
 */
sheets.PropertySheet = {
  type: 'object',
  properties: {

    ID: {
      type:'string'
      //notPropertyOf: cwtSheets.sheetKeys
    },

    capturePoints: {
      format:'int',
      minimum: 1,
      maximum:99
    }
  }
};

sheets.TileSheet = {
  type: 'object',
  properties: {

    ID: {
      type:'string'
      //notPropertyOf: cwtSheets.sheetKeys
    },

    defense: {
      format:'int',
      minimum: 0,
      maximum:5
    }
  }
};