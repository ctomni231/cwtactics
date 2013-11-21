controller.registerMenuRenderer("__mainMenu__",
function( content, entry, index ){
  
  entry.innerHTML = model.data_localized( content );
});