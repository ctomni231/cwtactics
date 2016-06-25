// (Int ?= 0, Int ?= 0) -> turnModel
cwt.turnModelFactory = (day = 0, owner = 0) => ({
  day,
  owner
});

// (players, turnModel) -> maybe<int>
cwt.getNextTurnOwner = function(players, model) {
  const currentId = model.turnOwner;
  const relativeNextId = cwt
    .rotate(players, currentId + 1)
    .findIndex(el => el.team >= 0) + 1;
  const absoluteNextId = (relativeNextId + currentId) % data.players.length;

  return currentId != absoluteNextId ? cwt.something(absoluteNextId) : cwt.nothing();
};

// (Int, Int) -> boolean
cwt.isDayChangeBetweenOwners = (idA, idB) => idB < idA;

// (players, turnModel) -> turnModel
cwt.xxx = (players, turns) => cwt
  .getNextTurnOwner(players, turns)
  .map(nextOwner => {
    const day = turnModel.day + (cwt.isDayBetweenTurnOwners(data.turnOwner, nextOwner) ? 1 : 0);
    return {
      day,
      nextOwner
    };
  })
  .ifNotPresent(cwt.error("GAME: no next turn owner found"));
