controller.openedSection = null;
  
controller.openSection = function( id ){
  if( id === null ) return;
  
  var element = document.getElementById(id);
  if( !element ) model.criticalError( constants.error.CLIENT_ERROR, constants.error.CLIENT_DATA_ERROR );

  if( this.openedSection !== null ){
    this.openedSection.style.display = "none"; 
  }

  element.style.display = "";
  this.openedSection = element;
};