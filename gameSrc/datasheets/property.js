/**
 *
 */
cwt.PropertySheet = new cwt.SheetDatabase({

  check: function (sheet) {

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