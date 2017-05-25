const gameCreateAiHandler = world => {


  const ai = {

    enabled: false,

    isActiveForPlayer: exports.noop,

    activateForPlayer: exports.noop,

    about: () => "DumbBoy 0.0.1",

    init() {
      exports.ai.enabled = true
      exports.ai.about = exports.always("ai-dumbBoy 0.0.1")
    }
  }
}
