controller.openedSection = null;
  
controller.openSection = function( id ){
  var element = document.getElementById(id);
  if( !element ) util.raiseError("unknown id",id);

  if( this.openedSection !== null ){
    this.openedSection.style.display = "none"; 
  }

  element.style.display = "";
  this.openedSection = element;
};