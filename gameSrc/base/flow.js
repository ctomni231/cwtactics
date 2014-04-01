/**
 * Appends a callback to be called with every element of a given list.
 *
 * @param flow
 * @param list
 * @param cb
 */
cwt.iterateListByFlow = function( flow, list, cb ){

  var data = {
    i:0,list:list
  };

  // load elements
  for( var i=0,e=list.length; i<e; i++ ){
    flow.andThen(function(p,b){
      cb.call(this,p,b);
      this.i++;
    },data);
  }

  // check some things
  flow.andThen(function(data){
    cwt.assert(list   === this.list);
    cwt.assert(this.i === this.list.length);
  },data);
};