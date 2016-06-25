// TYPE: actionArgs :: [p1, p2, p3, p4, p5]

// () -> map<(gameModel, actionArgs) -> gameModel>
cwt.actionMapFactory = () => ({

  moveUnit(gameModel, actionArgs) {

    },

    captureProperty(gameModel, actionArgs) {

    },

    loadUnit(gameModel, actionArgs) {

    },

    unloadUnit(gameModel, actionArgs) {

    },

    produceUnit(gameModel, actionArgs) {

    },

    attackUnit(gameModel, actionArgs) {

    },

    fireRocket(gameModel, actionArgs) {

    },

    explodeSelf(gameModel, actionArgs) {

    },

    activateCoPower(gameModel, actionArgs) {

    },

    activateScoPower(gameModel, actionArgs) {

    },

    activateTagCoPower(gameModel, actionArgs) {

    },

    yieldGame(gameModel, actionArgs) {

    },

    nextTurn: (gameModel, actionArgs) => cwt.cloneMap(gameModel, {
      turn: cwt.turnModelFactory(gameModel.players, gameModel.turns)
    })
});
