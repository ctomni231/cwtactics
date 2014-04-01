/**
 * @namespace
 * @type {Object}
 */
cwt.Background = {

  /**
   *
   */
  cssEl_: null,

  /**
   * Adds an assets to the background assets controller. The type of the argument is
   * an `base64` encoded `jpeg` assets.
   *
   * @param base64
   */
  registerImage: function (base64) {
    cwt.assert(util.isString(base64) && base64.length > 0);

    // lazy create css
    if (!this.cssEl_) {
      this.cssEl_ = document.createElement("style");
      document.getElementsByTagName("head")[0].appendChild(this.cssEl_);
    }

    // add new css for the assets with inline assets content
    this.cssEl_.innerHTML = ".cwt_page {" +
        "background-assets: url(aw2:assets/jpeg;base64," + base64 + ");" +
        "background-repeat: no-repeat;" +
        "background-position: 0px 45px;" +
        "background-size: 100% calc(100% - 44px);" +
      "}";
  }
};