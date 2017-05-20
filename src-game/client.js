/**
  
  JSLIX HOME

 */
(function(api) {

  api.init = () => {
    
    // debug output
    api.debug = msg => console.log("CWT::" + msg)

    // inject error debug out
    window.onerror = err => api.debug(err.message || err)
  }

})(cwt.client)