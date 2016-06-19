cwt.testGroup("turn");

cwt.testBefore("turn", data => {
  data.events = cwt.mockedEvents();
  data.players = [{}, {}, {}, {}];
  data.turn = cwt.produceTurn(data.events, data.players);
});

cwt.testCase("test", {}, data => {});

cwt.testCase("set day raises an event", {
  parameters: cwt.makeArray(1000, i => i)
}, data => {
  data.turn.setDay(data.parameter);
  data.events.publishCalledAtLeastOnceWith("turn:day", data.parameter);
});

cwt.testCase("set day raises an error on faulty data", {
  expectsError: "IAE",
  parameters: [null, undefined, false, -1, 99, "1", 1.7]
}, data => {
  data.turn.setDay(data.parameter);
});

cwt.testCase("set turnowner raises an event", {
  parameters: [0, 1, 2, 3]
}, data => {
  data.turn.setTurnOwner(data.parameter);
  data.events.publishCalledAtLeastOnceWith("turn:turnowner", data.parameter);
});

cwt.testCase("set turnowner raises an error on illegal player id", {
  expectsError: "IAE",
  parameters: [-1, 4]
}, data => {
  data.turn.setTurnOwner(data.parameter);
});

cwt.testCase("set turnowner raises an error on faulty data", {
  expectsError: "IAE",
  parameters: [null, undefined, false, -1, 99, "1", 1.7]
}, data => {
  data.turn.setTurnOwner(data.parameter);
});