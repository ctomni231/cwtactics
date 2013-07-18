controller.loadFault = function( e, baton ){
  console.error( (e.message)? e.message: "UNKNOWN", (e.stack)? e.stack: "NO_STACK_GIVEN" );
  controller.loadError = e.message;
  baton.pass(true);
};