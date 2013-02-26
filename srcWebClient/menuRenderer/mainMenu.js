controller.registerMenuRenderer("__mainMenu__",function( content, entry, index ){
  entry.innerHTML = util.i18n_localized( content );
});