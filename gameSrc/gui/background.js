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
   * Adds an image to the background image controller (3). The type of the argument is
   * an `base64` encoded `jpeg` image.
   *
   * @param base64
   */
  registerImage: function (base64) {
    assert(util.isString(base64) && base64.length > 0);

    // lazy create css
    if (!this.cssEl_) {
      this.cssEl_ = document.createElement("style");
      document.getElementsByTagName("head")[0].appendChild(this.cssEl_);
    }

    // add new css for the image with inline image content
    this.cssEl_.innerHTML = ".cwt_page {" +
        "background-image: url(data:image/jpeg;base64," + base64 + ");" +
        "background-repeat: no-repeat;" +
        "background-position: 0px 45px;" +
        "background-size: 100% calc(100% - 44px);" +
      "}";
  }
};