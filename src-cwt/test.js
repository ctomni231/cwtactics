const raiseError = function(msg = "UnknownError") {
  throw new Error(msg);
};

const devLog = (msg) => just(msg) 
  .map(msg => msg.replace(/\n/gi, "</br>").replace(/\s/gi, "&nbsp;"))
  .map(msg => msg + "</br>")
  .ifPresent(msg => document.getElementById("devOUT").innerHTML += msg);

const testGroup = (name) => devLog("[TEST-GROUP] " + name);

const testStatement = (expectedResult, fnThatReturnsActual, name) =>
  either.tryIt(fnThatReturnsActual)
  .bind(actual => actual != expectedResult ?
    left(new Error("expected:" + expectedResult + " but was:" + actual)) :
    right(actual))
  .fold(error => "FAILED, \n            reason: " + error.message, // + " stack: " + error.stack,
    result => "PASSED")
  .map(result => "[TEST-CASE][" + result + "] " + name);

const testFunction = (a, b, c) => {
  const time = Date.now();
  testStatement(a, b, c)
    .map(msg => msg + " [TIME: " + (Date.now() - time) + "ms]")
    .ifPresent(devLog);
};

const testTrueValue = testFunction.bind(null, true);
const testFalseValue = testFunction.bind(null, false);

const testContainsModelChange = (changeName, fn, name) => // WRONG IMPL
  testTrueValue(() => !!fn().changes.find(ev => changeName.find(el => el == ev.name)), name);

const defaultTestModel = gameDataForDemoPurposes();

testGroup("                                                                    ");
testGroup("------------------------------- CORE -------------------------------");
testGroup("                                                                    ");

const inc = x => x + 1;
testFunction(inc(inc(1)), () => compose(inc, inc)(1), "composition f.g with a is same as f(g(a))");

testGroup("                                                                    ");
testGroup("---------------------------- GAME CORE -----------------------------");
testGroup("                                                                    ");

testTrueValue(() => isDayChangeBetweenOwners(1, 0), "day between: 0 is before 1 and is a day change");
testFalseValue(() => isDayChangeBetweenOwners(0, 0), "day between: 0 is not before 0 and is no day change");
testFalseValue(() => isDayChangeBetweenOwners(0, 1), "day between: 1 is not before 0 and is no day change");

testFalseValue(() => areOwnedBySameTeam({ team: -1 }, { team: 0 }), "same team: active and inactive player not in same team");
testFalseValue(() => areOwnedBySameTeam({ team: 1 }, { team: 0 }), "same team: diff. team numbers means not in same team");
testTrueValue(() => areOwnedBySameTeam({ team: 1 }, { team: 1 }), "same team: same team numbers means in same team");

testFunction(5, () => getMoveCosts({ "KNWN": 5 }, "KNWN"), "get move costs: returns value on direct mapping");
testFunction(1, () => getMoveCosts({ "*": 1 }, "UKWN"), "get move costs: returns wildcard on missing value");
testFunction(0, () => getMoveCosts({}, "UKWN"), "get move costs: fallbacks to zero");

testFalseValue(() => propertyTypeFactory({}).isPresent(), "is property type: missing id will be declined");

testTrueValue(() => propertyTypeFactory({ id: "TEST" }).isPresent(), "is property type: base type + id is valid");

testFunction(0, () => distanceBetweenPositions(0, 0, 0, 0), "distance 0,0 and 0,0 is 0");
testFunction(1, () => distanceBetweenPositions(0, 1, 0, 0), "distance 0,1 and 0,0 is 1");
testFunction(1, () => distanceBetweenPositions(0, 0, 0, 1), "distance 0,0 and 0,1 is 1");
testFunction(2, () => distanceBetweenPositions(0, 1, 1, 0), "distance 0,1 and 1,0 is 2");
testFunction(2, () => distanceBetweenPositions(1, 0, 0, 1), "distance 1,0 and 0,1 is 2");

testFunction(
  distanceBetweenPositions(1, 1, 2, 2),
  () => distanceBetweenObjects({ x: 1, y: 1 }, { x: 2, y: 2 }),
  "distanceBetweenObjects and distanceBetweenPositions works same way");

testGroup("                                                                    ");
testGroup("---------------------------- GAME LOGIC ----------------------------");
testGroup("                                                                    ");

testFunction(1, () => tickTurn(createCopy(defaultTestModel, {
  turn: turnModelFactory(0, 2),
  weather: weatherModelFactory("TEST", 1)
})).turn.day, "tick turn with day change increases turn day");

testFunction(0, () => tickTurn(createCopy(defaultTestModel, {
  turn: turnModelFactory(0, 2),
  weather: weatherModelFactory("TEST", 1)
})).weather.day, "tick turn with day change decreases weather left days");

testFunction(0, () => tickTurn(createCopy(defaultTestModel, {
  turn: turnModelFactory(0, 2),
  weather: weatherModelFactory("TEST", 1),
  limits: createCopy(defaultTestModel.limits, { leftDays: 1 })
})).limits.leftDays, "tick turn with day change decreases turn limit");

testFunction(4000, () => payFundsToTurnOwner(createCopy(defaultTestModel, {
  turn: turnModelFactory(0, 1)
})).players[1].money, "pay funds to turn owner increases gold on turn-owner gold depot");

testFunction(0, () => payFundsToTurnOwner(createCopy(defaultTestModel, {
  turn: turnModelFactory(0, 1)
})).players[2].money, "pay funds to turn owner does not changes gold on non-turn-owners gold depot");

testFunction(defaultTestModel.units[0].fuel - 5, () => drainFuelOnTurnOwnerUnits(createCopy(defaultTestModel, {
  turn: turnModelFactory(0, 0)
})).units[0].fuel, "drain fuel lowers fuel on turn-owner units which have turnStartFuelConsumption");

testFunction(defaultTestModel.units[5].fuel, () => drainFuelOnTurnOwnerUnits(createCopy(defaultTestModel, {
  turn: turnModelFactory(0, 0)
})).units[5].fuel, "drain fuel ignores turn-owner units which not have turnStartFuelConsumption");

testFunction(defaultTestModel.units[1].fuel, () => drainFuelOnTurnOwnerUnits(createCopy(defaultTestModel, {
  turn: turnModelFactory(0, 0)
})).units[1].fuel, "drain fuel ignores non turn-owner units");

testFunction(defaultTestModel.units[0].hp + 20, () => repairTurnOwnerUnitsOnProperties(createCopy(defaultTestModel, {
  turn: turnModelFactory(0, 0)
})).units[0].hp, "property repairs own unit on turn start");

testFunction(99, () => repairTurnOwnerUnitsOnProperties(createCopy(defaultTestModel, {
  turn: turnModelFactory(0, 0)
})).units[4].hp, "property repair goes not higher than 99");

testFunction(defaultTestModel.units[5].hp, () => repairTurnOwnerUnitsOnProperties(createCopy(defaultTestModel, {
  turn: turnModelFactory(0, 0)
})).units[5].hp, "property repair ignores allied and enemy units");

testGroup("                                                                    ");
testGroup("----------------------------- ACTIONS ------------------------------");
testGroup("                                                                    ");

testContainsModelChange(
  ["changedDay"],
  () => actions.nextTurn(createCopy(defaultTestModel, {
    turn: turnModelFactory(0, 2)
  })),
  "next turn changes day");

testContainsModelChange(
  ["earnsMoney"],
  () => actions.nextTurn(createCopy(defaultTestModel, {
    turn: turnModelFactory(0, 2)
  })),
  "next turn increases turn owners gold depot");

testTrueValue(() => !!actions.nextTurn(createCopy(defaultTestModel, {
  turn: turnModelFactory(0, 2),
  limits: createCopy(defaultTestModel.limits, {
    leftDays: 1
  })
})).changes.find(ev => ev.name === "dayLimitReached"), "next turn day limit reaches zero");

testContainsModelChange(
  ["movedUnit"],
  () => actions.moveUnit(defaultTestModel, 0, [1, 1, 1, 1]),
  "moving unit should move the unit on map");

testContainsModelChange(
  ["movedUnit"],
  () => actions.moveUnit(defaultTestModel, 0, [1, 1, 1, 2, 2]),
  "moving unit cannot be trapped by allied units");

testContainsModelChange(
  ["movedUnit", "trappedMove"],
  () => actions.moveUnit(defaultTestModel, 0, [1, 2, 2]),
  "moving unit can be trapped by enemy units");

testContainsModelChange(
  ["unitDepletesFuel"],
  () => actions.moveUnit(defaultTestModel, 0, [1, 1, 1, 1]),
  "moving unit depletes fuel");

testContainsModelChange(
  ["createdUnit", "producedUnit"],
  () => actions.produceUnit(defaultTestModel, 10, "INFT"),
  "production creates unit");

testContainsModelChange(
  ["paysMoney"],
  () => actions.produceUnit(defaultTestModel, 10, "INFT"),
  "production decreases producers gold depot");