var modelHandler = {

};

cwt.produceModel = function(events) {
  let turn = cwt.produceTurn(events, "players");

  return Object.assign(Object.create(modelHandler), {
    turn
  });
};  