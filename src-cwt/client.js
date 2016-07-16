  // =========================================================================================================
  //                                                 GAME STATE
  // =========================================================================================================

  // [GameModel]
  let history = [];

  // maybe GameModel
  let gameState = cwtCore.nothing();

  // GameAction:: {id: Int, actionName: String, actionMeta: ?}

  // [GameAction]
  let allowedActions = [];

  /*
    // ((GameModel) => GameModel') => (GameModel => { model: maybe GameModel', changes: [GameModelChange]})
    const gameAction = (action) =>
      (model) => maybe(action(model))
      .biMap(
        (data) => [data, gameModelDifference(model, data)],
        () => [null, []])
      .map({
        model: maybe(data[0]),
        changes: data[1]
      })
      .get();
  */

  // TODO: may end game here ?
  // (Int) => { changes: [GameModelChange], allowedActions: [GameAction] }
  exports.doActionAndReturnNextPossibleOnes = () => ({
    changes: [],
    allowedActions
  });

  // TODO: MAYBE TO UNSAFE ?
  exports.devInitGame = (data) => null;

  // TODO: MAYBE TO UNSAFE ?
  exports.wipeEverything = () => {
    gameState = nothing();
    return [];
  };

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