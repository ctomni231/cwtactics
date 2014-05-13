cwt.Gameflow.addInGameState({
  id: "INGAME_IDLE",

  init: function (gameData) {

    /**
     * Position object with rich information about the selected position by an action and some relations.
     *
     * @memberOf cwt.Gameflow.globalData
     */
    gameData.source = new cwt.Position();

    /**
     * Position object with rich information about the selected position by an action and some relations.
     *
     * @memberOf cwt.Gameflow.globalData
     */
    gameData.target = new cwt.Position();

    /**
     * Position object with rich information about the selected position by an action and some relations.
     *
     * @memberOf cwt.Gameflow.globalData
     */
    gameData.targetselection = new cwt.Position();

    /**
     *
     * @memberOf cwt.Gameflow.globalData
     * @implements cwt.InterfaceSelection
     */
    gameData.selection = {

      /** @private */
      len_: cwt.MAX_MOVE_LENGTH * 4,

      /** @private */
      data_: null,

      /** @private */
      centerX_: 0,

      /** @private */
      centerY_: 0,

      setCenter: function (x, y, defValue) {

        // lazy initialization
        if (!this.data_) {
          this.data_ = [];
          for (var i = 0; i < this.len_; i++) {
            this.data_[i] = [];
          }
        }

        this.centerX = Math.max(0, x - (this.len_ - 1));
        this.centerY = Math.max(0, y - (this.len_ - 1));

        // clean data
        for (var rx = 0; rx < this.len_; rx++) {
          for (var ry = 0; ry < this.len_; ry++) {
            this.data_[rx][ry] = defValue;
          }
        }
      },

      getValue: function (x, y) {
        x = x - this.centerX_;
        y = y - this.centerY_;

        if (x < 0 || y < 0 || x >= this.len_ || y >= this.len_) {
          return cwt.INACTIVE;
        } else {
          return this.data_[x][y];
        }
      },

      setValue: function (x, y, value) {
        x = x - this.centerX_;
        y = y - this.centerY_;

        if (x < 0 || y < 0 || x >= this.len_ || y >= this.len_) {
          throw Error("Out of Bounds");
        } else {
          this.data_[x][y] = value;
        }
      },

      /**
       *
       * @param {number} x
       * @param {number} y
       * @return {boolean}
       */
      hasActiveNeighbour: function (x, y) {
        x = x - this.centerX_;
        y = y - this.centerY_;

        if (x < 0 || y < 0 || x >= this.len_ || y >= this.len_) {
          throw Error("Out of Bounds");
        }

        if ((x > 0 && this.len_[x - 1][y] > 0) ||
          (y > 0 && this.len_[x][y - 1] > 0) ||
          (x < this.data_ - 1 && this.data_[x + 1][y] > 0) ||
          (y < this.data_ - 1 && this.data_[x][y + 1] > 0)) {

          return true;
        } else {
          return false;
        }
      },

      /**
       *
       * @param {number} x
       * @param {number} y
       * @param {number} minValue
       * @param {boolean} walkLeft
       * @param {Function} cb
       * @param {*?} arg
       */
      nextValidPosition: function (x, y, minValue, walkLeft, cb, arg) {
        x = x - this.centerX_;
        y = y - this.centerY_;

        if (x < 0 || y < 0 || x >= this.len_ || y >= this.len_) {
          if (walkLeft) {
            // start bottom right
            x = this.len_ - 1;
            y = this.len_ - 1;

          } else {
            // start top left
            x = 0;
            y = 0;

          }
        }

        // walk to the next position
        var mod = (walkLeft) ? -1 : +1;
        y += mod;
        for (; (walkLeft) ? x >= 0 : x < this.len_; x += mod) {
          for (; (walkLeft) ? y >= 0 : y < this.len_; y += mod) {
            if (this.data_[x][y] >= minValue) {
              // valid position
              cb(x, y, arg);
              return;

            }
          }

          y = (walkLeft) ? this.len_ - 1 : 0;
        }
      },

      /**
       *
       * @param {Function} cb
       * @param {*} arg
       * @param {number} minValue
       * @return {boolean}
       */
      nextRandomPosition: function (cb, arg, minValue) {
        if (minValue === void 0) {
          minValue = 0;
        }

        var n = parseInt(Math.random() * this.len_, 10);
        for (var x = 0; x < this.len_; x++) {
          for (var y = 0; y < this.len_; y++) {
            if (this.data_[x][y] >= minValue) {
              n--;

              if (n < 0) {
                cb(x, y, arg);
                return true;
              }
            }
          }
        }

        return false;
      }
    };
  },

  enter: function (gameData) {
    gameData.source.clean();
    gameData.target.clean();
    gameData.targetselection.clean();
  },

  ACTION: function (gameData) {
    gameData.source.set(x, y);
    gameData.target.set(x, y);

    cwt.Gameflow.changeState("INGAME_MOVEPATH");
  }
});
