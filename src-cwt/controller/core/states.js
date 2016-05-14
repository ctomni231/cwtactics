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
    STARTGAME: produceState(cwt.startGameState, "STARTGAME"),
    LOADING: produceState(cwt.loadingState, "LOADING", {
      requestData: cwt.requestResource,
      generateTimer: cwt.produceTimer,
      serial: cwt.executeJobs,
      events
    }),
    MAINMENU: produceState(cwt.mainMenuState, "MAINMENU"),
    LOADMAP: produceState(cwt.loadMapState, "LOADMAP")
  };
};