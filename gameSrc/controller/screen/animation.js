cwt.Animation = {

  /**
   *
   * @private
   */
  selection_: controller.stateMachine.data.selection,

  /**
   *
   * @private
   */
  data_: [

    // UNIT
    0, 3, 0, 250, 0,

    // UNIT SIMPLE
    0, 3, 0, 250, 0,

    // SELECTION
    0, 7, 0, 150, 0,

    // STATUS
    0, 20, 0, 300, 0,

    // PROPERTY
    0, 4, 0, 400, 0,

    // ANIMATED TILES (4)
    0, 4, 0, 500, 0,

    // ANIMATED TILES (8)
    0, 8, 0, 500, 0
  ],

  /**
   * @private
   */
  unitStepper_: 1,

  /**
   *
   * @param key
   * @return current step of the given sprite type
   */
  getSpriteStep: function (key) {
    switch (key) {

      case "UNIT":
        return this.data_[0];

      case "UNIT_SIMPLE":
        return this.data_[5];

      case "SELECTION":
        return this.data_[10];

      case "STATUS":
        return this.data_[15];

      case "PROPERTY":
        return this.data_[20];

      case "ANIM_TILES":
        return this.data_[25];

      case "ANIM_TILES_EXT":
        return this.data_[30];
    }

    return 0;
  },

  updateSpriteAnimations: function (delta) {
    var flagged = false;

    for (var i = 0, e = this.data_.length; i < e; i += 5) {

      // add time to animation slot
      this.data_[i + 2] += delta;

      // if slot reaches maximum time per step
      if (this.data_[i + 2] >= this.data_[i + 3]) {
        this.data_[i + 2] = 0;

        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        // special unit animation
        if (i === 0) {
          this.data_[i] += this.unitStepper_;

          if (this.unitStepper_ === -1) {

            // breaks lower border
            if (this.data_[i] === -1) {
              this.data_[i] = 1;
              this.unitStepper_ = +1;
            }
          }
          else {

            // breaks upper border
            if (this.data_[i] === this.data_[i + 1]) {
              this.data_[i] = (this.data_[i + 1] - 2);
              this.unitStepper_ = -1;
            }
          }
        }
        // normal animations
        else {
          this.data_[i] += 1;
          if (this.data_[i] === this.data_[i + 1]) this.data_[i] = 0;
        }

        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        // set re-render flag
        flagged = true;
        this.data_[i + 4] = 1;

        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        if (flagged) {
          var x = 0;
          var yS = 0;
          var xe = model.map_width;
          var ye = model.map_height;


          if (this.data_[4] === 1 ||
            this.data_[9] === 1 ||
            this.data_[24] === 1 ||
            this.data_[29] === 1) {

            for (; x < xe; x++) {
              for (var y = yS; y < ye; y++) {

                // units or selection tiles
                if (this.data_[4] === 1 ||
                  this.data_[9] === 1) {

                  if (model.unit_posData[x][y] !== null) {
                    view.redraw_markPosWithNeighboursRing(x, y);
                  }
                }

                // status needs only an updated step number
                // the graphics will be updated with unit redraws

                // properties
                if (this.data_[24] === 1) {

                  if (model.property_posMap[x][y] !== null) {
                    view.redraw_markPosWithNeighboursRing(x, y);
                  }
                }

                // animated tiles (solves also extendet anims)
                if (this.data_[29] === 1 || this.data_[34] === 1) {

                  if (view.animatedTiles[ model.map_data[x][y].ID ]) {
                    view.redraw_markPos(x, y);
                  }
                }

              }
            }
          }

          var focusExists = (
            controller.stateMachine.state === "MOVEPATH_SELECTION" ||
              controller.stateMachine.state === "ACTION_SELECT_TARGET_A" ||
              controller.stateMachine.state === "ACTION_SELECT_TARGET_B" ||
              controller.attackRangeVisible
            );

          // units or selection tiles

          if (focusExists && this.data_[14] === 1) {
            this.selection_.rerenderNonInactive();
          }
        }

        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        // reset all "screen" flags
        this.data_[4] = 0;
        this.data_[9] = 0;
        this.data_[14] = 0;
        this.data_[19] = 0;
        this.data_[24] = 0;
        this.data_[29] = 0;
        this.data_[34] = 0;

        // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

      }
    }
  }
};