// =========================================================================================================
//                                           CONTROLLER 
// =========================================================================================================


// String -> Promise
const jsonIO = (path) => new Promise((resolve, reject) => {
  const request = new XMLHttpRequest();

  request.onreadystatechange = () => {
    if (request.readyState == 4) {
      if (request.status == 200) {
        try {
          resolve(JSON.parse(request.responseText));
        } catch (error) {
          reject("JSONException: " + error);
        }
      } else {
        reject(request.statusText);
      }
    }
  };

  request.open("get", path + (path.indexOf("?") < 0 ? "?" : "&") + (parseInt(Math.random() * 100000, 10)), true);
  request.send();
});

// (String) -> Promise
const cachedJsonIO = (path) => new Promise((resolve, reject) =>
  localforage
  .getItem(path)
  .then(value => {
    if (value == null) {
      jsonIO(path)
        .then(data => localforage.setItem(path, data))
        .then(data => resolve(data));
    } else {
      resolve(value);
    }
  })
  .catch(function(err) {
    reject(err);
  }));

const _logIO = {
  putLn: (str) => {
    console.log(str);
    return _logIO;
  },

  bind: (fn) => fn()
};

// () -> { putLn }
const logIO = () => _logIO;

// LoopMonad :: () -> LoopMonad Int
const loop = () => {
  var lastTime = (new Date()).getTime();

  const loop = () => {
    const now = (new Date()).getTime();
    const delta = now - lastTime;
    lastTime = now;

    for (var i = mappers.length - 1; i >= 0; i--) {
      mappers[i](delta);
    }

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  const mappers = [];

  const stub = {
    then: (fn) => {
      mappers.push(fn);
      return stub;
    }
  };

  return stub;
};


// =========================================================================================================
//                                               GUI 
// =========================================================================================================

const gameCanvas = document.getElementById("gamecanvas");
const gameCanvasCtx = gameCanvas.getContext("2d");

gameCanvas.width = CANVAS_WIDTH;
gameCanvas.height = CANVAS_HEIGHT;

// =========================================================================================================
//                                               DATA 
// =========================================================================================================

const log = str => document.getElementById("devOUT").innerHTML += "&nbsp;" + str + "</br>";

var gameState;

// =========================================================================================================
//                                              STARTUP
// =========================================================================================================

logIO()
  .putLn("STARTING CustomWarsTactics")
  .putLn("VERSION: " + VERSION)
  .bind(() => {
    gameState = gameDataForDemoPurposes();
    return loop();
  })
  .then(delta => gameState = createCopy(gameState, {
    limits: gameLimitFactory(gameState.limits.elapsedTime + delta, gameState.limits.elapsedTurns)
  }))
  .then(delta => gameState = Math.random() < 0.05 ?
    actions.nextTurn(gameState).model : gameState)
  .then(delta => {
    gameCanvasCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gameCanvasCtx.fillStyle = "white";
    gameCanvasCtx.font = "9px Arial";

    gameCanvasCtx.fillText("DAY = " + gameState.turn.day, 4, 12);
    gameCanvasCtx.fillText("TURNOWNER = " + gameState.turn.owner, 4, 22);

    gameCanvasCtx.fillText("PLAYER 0 MONEY = " + gameState.players[0].money, 4, 102);
    gameCanvasCtx.fillText("PLAYER 1 MONEY = " + gameState.players[1].money, 4, 112);
    gameCanvasCtx.fillText("PLAYER 2 MONEY = " + gameState.players[2].money, 4, 122);

    gameCanvasCtx.fillText("UNIT 0 (P1) HP = " + gameState.units[0].hp, 4, 172);
    gameCanvasCtx.fillText("FUEL = " + gameState.units[0].fuel, 104, 172);

    gameCanvasCtx.fillText("UNIT 1 (P2) HP = " + gameState.units[1].hp, 4, 182);
    gameCanvasCtx.fillText("UNIT 2 (P2) HP = " + gameState.units[2].hp, 4, 192);
    gameCanvasCtx.fillText("UNIT 3 (P2) HP = " + gameState.units[3].hp, 4, 202);

    gameCanvasCtx.fillText("GAME TIME = " + gameState.limits.elapsedTime + "ms", 4, 222);
    gameCanvasCtx.fillText("DELTA = " + delta + "ms", 4, 232);
  });