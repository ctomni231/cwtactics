/**
 * Error panel object.
 *
 * @namespace
 * @type {Object}
 */
cwt.ErrorPanel = {

  panel: document.getElementById("cwt_errorPanel"),

  header: document.getElementById("cwt_errorPanel_reason"),

  stack: document.getElementById("cwt_errorPanel_data"),

  buttons: controller.generateButtonGroup(
    document.getElementById("cwt_errorPanel"),
    "cwt_panel_header_small cwt_page_button cwt_panel_button",
    "cwt_panel_header_small cwt_page_button cwt_panel_button button_active",
    "cwt_panel_header_small cwt_page_button cwt_panel_button button_inactive"
  ),

  /**
   *  True if the error panel is visible, else false.
   */
  visible: false,

  /**
   * Shows the error panel by a given error message and type.
   *
   * @param msg
   * @param type
   * @param stackData
   */
  show: function (msg, type, stackData) {
    this.stack.innerHTML = msg;
    this.header.innerHTML = type;
    this.panel.style.display = "block";
    this.visible = true;
  },

  /**
   * Hides the error panel.
   */
  hide: function () {
    this.panel.style.display = "none";
    this.visible = false;
  }
};
