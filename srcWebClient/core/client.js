// Holds several screen related data and logic.
//
var view = window.view = {};

// registers generic error listener
window.onerror = function( e ){
  controller.showErrorPanel( "Critical Game Fault", e.stack );
};
