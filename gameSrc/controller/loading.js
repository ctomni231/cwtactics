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

  hasCachedData: false,

  /**
   * Adds a loading function in the loading process.
   *
   * @param {Function} loader
   */
  create: function (loader) {
    this.loaders_.push(loader);
  },

  /**
   * Starts the loading process. After the loading process the loading stuff will be removed. The Loading namespace
   * will remain with a property with value true as marker. This property will be named deInitialized.
   *
   * @param {Function} callback
   */
  startProcess: function (loadingBar, callback) {
    if (cwt.DEBUG) {
      console.log("start loading process");
    }

    function setProgress(bar,i) {
      return function (next) {
        bar.setPercentage(i);
        next();
      }
    }

    cwt.Loading.hasCachedData = localStorage.getItem("cwt_hasCache");

    var loaders = [];
    var step = parseInt(100/this.loaders_.length);
    for (var i = 0, e=this.loaders_.length; i<e; i++ ){
      loaders.push(this.loaders_[i]);
      loaders.push(setProgress(loadingBar,(i+1)*step));
    }

    callAsSequence(loaders, function () {

      // remove functions that never be called again
      delete this.loaders_;
      delete this.create;
      delete this.startProcess;

      // place marker
      this.initialized = true;

      // invoke callback if given
      if (callback) {
        localStorage.setItem("cwt_hasCache",true);

        callback();
      }
    });
  }
};