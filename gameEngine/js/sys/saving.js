(function(){
  
  var savers = {};
  
  if( !JSON )
  {
    //error JSON missing 
  }
  
  function connect( tokenName, savingFunc )
  {
    if( savers[tokenName] )
    {
      //error
    }
      
    savers[tokenName] = savingFunc;
  }
    
  /**
   * Parses the data block and calls the corresponding saving algorithms.
   */
  function loadBlock( dataBlock )
  {
    if( dataBlock.constructor != Array )
    {
      //error
    }

    var handler,element;
    for( element in dataBlock )
    {
      handler= savers[element.__ID__];
      if( handler ) handler( element );
      else
      {
        //error, unknown save block
      }
    }
  }

  /**
   * Invokes a saving process. All saving handlers will be called to save 
   * the global status. At the end, the result object will be converted to
   * JSON.
   */
  function saveBlock()
  {
    var result = [];
    var block,handlerName;

    for( handlerName in savers )
    {
      block={};
      if( savers.hasOwnProperty(handlerName) ) 
        savers[handlerName]( block );

      if( !block.__ID__ ) block.__ID__ = handlerName;
      else{} // error

      // push it into data block
      result.push(block);
    }

    // save block to some place
  }

    
  // EXPORT API
  if( typeof define === 'function' ) define(function(){ 
    return {
      saveBlock: saveBlock,
      loadBlock: loadBlock,
      connect: connect
    }; 
  });
  else nekoPersist= {
    saveBlock: saveBlock,
    loadBlock: loadBlock,
    connect: connect
  };
  
})();