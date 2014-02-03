/**
 *
 * @namespace
 * @type {Object}
 */
cwt.MessagePanel = {

  /**
   * Time that a panel will be opened when no time was given
   * by the message request.
   */
  DEFAULT_MESSAGE_TIME: 2000,

  /**
   *
   */
  panel: document.getElementById("cwt_info_box"),

  /**
   *
   */
  contentDiv: document.getElementById("cwt_info_box_content"),

  /**
   *
   */
  timeLeft: 0,

  /**
   *
   * @param delta
   */
  update: function (delta) {
    if (this.timeLeft > 0) {
      this.timeLeft -= delta;
      if (this.timeLeft <= 0) {
        this.panel.style.opacity = 0;
        this.panel.style.top = "-1000px";

        cwt.Input.releaseBlock();
      }
    }
  },

  /**
   *
   * @param delay
   */
  close: function (delay) {
    this.timeLeft = (delay) ? delay : 1;
  },

  /**
   *
   * @return {Boolean}
   */
  hasMessage: function () {
    return this.timeLeft > 0;
  },

  /**
   *
   * @param msg
   * @param time
   */
  show: function (msg, time) {
    if (arguments.length === 1) time = this.DEFAULT_MESSAGE_TIME;

    this.contentDiv.innerHTML = msg;

    this.panel.style.opacity = 1;
    this.panel.style.top = "96px";

    this.timeLeft = time;
    cwt.Input.requestBlock();
  }

};