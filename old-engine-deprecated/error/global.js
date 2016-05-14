/*global window, console*/

window.onerror = function (error) {
  error = "[SYSTEM ERROR] " + error;
  controller.showErrorPanel("Critical Game Fault", error);
};
