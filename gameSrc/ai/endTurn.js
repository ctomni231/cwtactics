"use strict";

new require('../dumbBoy').AiAction(

  // use lowest possible rating here to make sure, that endTurn will be invoked at last
  function () {
    return 1;
  },

  function () {

  }
);