var state = {
  enter() {},
  update() {},
  render() {},
  exit() {}
};

cwt.produceGamestates = function(events) {
  function produceState(stateImpl, name, dependencies = {}) {
    return Object.assign(Object.assign(Object.create(state), stateImpl), Object.assign({
      log: cwt.produceLogger(name)
    }, dependencies));
  }

  return {
    STARTGAME: produceState(startGameState, "STARTGAME"),
    LOADING: produceState(loadingState, "LOADING", {
      requestData: cwt.requestResource,
      generateTimer: cwt.produceTimer,
      serial: cwt.executeJobs,
      events
    }),
    MAINMENU: produceState(mainMenuState, "MAINMENU"),
    LOADMAP: produceState(loadMapState, "LOADMAP")
  };
};