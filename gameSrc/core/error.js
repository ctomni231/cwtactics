/* Registers generic error listener. */
window.onerror = function (e) {
  cwt.ErrorPanel.show("Critical Game Fault", e.stack);
};