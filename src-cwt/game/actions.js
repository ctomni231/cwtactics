const actionCheckers = [
  (x, y) => "nextTurn"
];

const actionEvaluators = {

  nextTurn(model) {
    model.turn.pickNextTurnOwner();
  }
};

cwt.produceModelOalPusher = function(model) {
  return (action) => actionEvaluators[action](model);
};

cwt.produceModelOalGrabber = function(model) {
  return (x, y) => [{
    x,
    y,
    actions: actionCheckers.map(fn => fn(x, y)).filter(el => !!el)
  }];
};