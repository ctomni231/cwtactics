/**
  
  JSLIX HOME

 */
const gameCreateClient = function () {

  const client = Object.create(gameClient)

  // debug output
  client.debug = msg => console.log("CWT::" + msg)

  // inject error debug out
  window.onerror = err => gameClient.debug(err.message || err)

  return client
}
