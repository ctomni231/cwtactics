cwt.AiAction = my.Class({

  constructor: function (ratingFn, evaluateFn) {
    "use strict";

    cwt.assert(typeof ratingFn === "function");
    cwt.assert(typeof evaluateFn === "function");

    this.rating = ratingFn;
    this.evaluate = evaluateFn;
  },

  evaluate: function (aiModel) {
    "use strict";

    this.evaluate(aiModel);
  },

  getRating: function (aiModel) {
    "use strict";

    return this.rating(aiModel);
  }
});