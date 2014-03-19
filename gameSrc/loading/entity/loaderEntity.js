/**
 * The data loading process.
 *
 * @namespace
 */
cwt.Loading = {

  /**
   * @private
   */
  loaders_: [],

  /**
   * Adds a loading function in the loading process.
   *
   * @param {Function} callback
   */
  create: function (callback) {
    this.loaders_.push(callback);
  },

  /**
   * Starts the loading process. After the loading process the loading stuff will be removed. The Loading namespace
   * will remain with a property with value true as marker. This property will be named deInitialized.
   *
   * @param {Function} callback
   */
  startProcess: function (callback) {
    callAsSequence(this.loaders_, function () {

      // remove functions that never be called again
      delete this.loaders_;
      delete this.create;
      delete this.startProcess;

      // place marker
      this.deInitialized = true;

      // invoke callback if given
      if (callback) {
        callback();
      }
    });
  }
};