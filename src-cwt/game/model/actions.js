cwt.produceModelOalHandler = function() {

  const actions = [
    (x, y) => "nextTurn"
  ];

  return {
    createActions(x, y) {
      return [{
        x,
        y,
        actions: actions.map(action => action(x, y) || null).filter(el => el != null)
      }];
    }
  };
};