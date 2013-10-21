// Define event
controller.defineEvent("criticalError");

util.scoped(function() {

  function error( type,where,desc ){
    if( !where ) where = "unknown place";
    if( !desc ) desc = "";

    controller.events.trownError( type,where,desc );
    util.error( "Error ("+type+"): "+desc+" in "+where );
  };

  model.errorClient = function( where,desc ){
    error( "Client",where,desc );
  };

  model.errorUnknown = function( where,desc ){
    error( "Unknown",where,desc );
  };

  model.errorIllegalArguments = function( where,desc ){
    error( "Illegal Arguments",where,desc );
  };

  model.errorCorruptDataModel = function( where,desc ){
    error( "Corrupt Data Model",where,desc );
  };

  model.errorLogicFault = function( where,desc ){
    error( "Logic Fault",where,desc );
  };

});
