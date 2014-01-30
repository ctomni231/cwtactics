// registers generic error listener
window.onerror = function (e) {
  controller.showErrorPanel("Critical Game Fault", e.stack);
};