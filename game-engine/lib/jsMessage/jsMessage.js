/**
 * jsMessage is a message based communication library for javaScript. It's mainly designed for Custom Wars Tactics, but
 * can be used in other games and applications as well.
 *
 * @namespace
 */
var jsMessage = function(){

  var MAX_UID = 1000000;

  // private context variables
  var filterIds = {};
  var filters = [];

  // API that will be public
  var API = {};

  // message function that passes a message through all registered filters
  API.message = function( message ){
    //TODO support converters here, currently a direct js object is needed

    var filter;
    for( var i=0; filter=filters[i]; i++ ){

      // if return value of the filter equals false, then break the filter chain execution
      if( filter( message ) === false ) break;
    }
  };

  // extend filter function
  API.addFilter = function( filterAPI, priority ){
    //TODO save priority of already added filters to make sure that a TAIL filter is not going to be the first after
    //TODO adding another filter(s)

    var prios = jsMessage.Priority;
    if( typeof priority === 'undefined' ) priority = prios.TAIL;

    var filter = filterAPI.filter;
    if( !filter ) throw Error('filter API must contain a filter property that contains the filter function');

    // APPEND AT HEAD
    if( priority === prios.HEAD ) filters.splice( 0, 0, filter);

    // APPEND AT TAIL
    else if( priority === prios.TAIL ) filters.push( filter );

    // INSERT IN THE MIDDLE
    else if( priority === prios.CENTRAL ) filters.splice( parseInt( filters.length/2, 10 ), 0, filter);

    // INSERT IN THE ARRAY AT A RANDOM POSITION
    else if( priority === prios.RANDOM ){
      var index = parseInt( Math.random()*filters.length-1 , 10 );
      filters.splice(index,0,filter);
    }

    else throw Error('unknown priority \''+priority+'\' ...must be member of jsMessage.Priority');

    // generate uid
    var uid;
    var i = 0;
    while( true ){
      if( i === 3 ) throw Error('could not grab an unique number after three times');

      // generate an id and check its uniqueness
      uid = parseInt( Math.random()*MAX_UID, 10 );
      if( !filterIds.hasOwnProperty(uid) ){

        // register filter with its generated id
        filterIds[uid] = filter;
        break;
      }

      i++;
    }
  };

  // remove filter function
  API.removeFilter = function( fuid ){
    var fObj = filterIds[ fuid ];
    var index = filters.indexOf( fObj );

    // remove it
    filters.splice( index, 1 );
  };

  // Returns the public API of a filter
  API.getFilter = function( fuid ){

    // check existence
    if( !filterIds.hasOwnProperty(fuid) ) throw Error('filter with id \''+fuid+'\' is not registered');

    // return public filter API
    return filterIds[ fuid ];
  };

  return API;
};

jsMessage.Priority = {
     HEAD: 999999,
     TAIL: 999998,
   RANDOM: 999997,
  CENTRAL: 999996
};
 
/**
 * Contains all registered filters for a jsMessage context.
 */
jsMessage.filter = {};