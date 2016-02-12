/*global window, console*/

window.onerror = function (error) {
  // TODO send email options ?
  console.error("[SYSTEM ERROR] " + error);
};
