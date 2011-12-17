/**
 * Module description...
 * 
 * @TODO
 *   - implement key and touch handlers
 *  
 * @author BlackCat
 * @since 5.12.2011
 */
define(function(){
  
  /***********
   * PRIVATE *
   ***********/
  
  var _isGrabbed = false;
  var _moveTouch = null;
  var _startTouch = null;
  
  
  /******************
   * IMPLEMENTATION *
   ******************/
  
  return {
    
    /**
     * Should be invoked, on a touch moving event.
     */
    __touchMove__: function( e ) 
    {
      // if grabbed, call custom handler
      if( _moveTouch !== null ) _moveTouch(e);

      e.preventDefault();
      return false;
    },

    /**
     * Should be invoked, on a touch moving event.
     */
    __touchStart__: function( e ) 
    {
      // if grabbed, call custom handler
      if( _startTouch !== null ) _startTouch(e);

      e.preventDefault();
      return false;
    },

    /**
     * Grabs the fokus of the input.
     * 
     * @return true, if fokus is grabbed, else false
     */
    grabInputFocus: function( moveF, startF)
    {
      // if already grabbed by another resource, return null
      if( _isGrabbed ) return false;
      
      // set data
      _moveTouch = moveF;
      _startTouch = startF;
      _isGrabbed = !_isGrabbed;
      return true;
    },
    
    /**
     * Releases the fokus and removes the custom input handlers.
     */
    releaseInputFocus: function()
    {
      // reset data
      _moveTouch = null;
      _startTouch = null;
      _isGrabbed = !_isGrabbed;
    }
  }
});