(function(exports) {

  const compose = cwtCore.compose;
  const either = cwtCore.either;
  const eitherLeft = cwtCore.eitherLeft;
  const eitherRight = cwtCore.eitherRight;
  const validation = cwtCore.validation;
  const maybe = cwtCore.maybe;
  const just = cwtCore.just;
  const nothing = cwtCore.nothing;
  const createCopy = cwtCore.createCopy;
  const identity = cwtCore.identity;
  const id = cwtCore.id;

  const assertNeverCalled = any =>
    assertThat(false, "unreachable point was reached: " + any);

  const printOnScreen = (msg) => just(msg)
    // .map(msg => msg.replace(/\n/gi, "</br>").replace(/\s/gi, "&nbsp;") + "</br>")
    // .ifPresent(msg => document.getElementById("devOUT").innerHTML += msg);
    .ifPresent(msg => console.log(msg));

  const assertThat = (expression, msg) => {
    if (!expression) {
      throw new Error(msg);
    }
  };

  const assertStartsWith = R.curry(
    (startsWith, string) => assertThat(string.indexOf(startsWith) === 0, "expected: " + string + " to starts with " + startsWith));

  const assertEquals = R.curry(
    (expected, actual) => assertThat(expected === actual, "expected: " + expected + ", but was: " + actual));

  const assertTrue = assertEquals(true);

  const assertFalse = assertEquals(false);

  const assertNotEquals = R.curry(
    (expected, actual) => assertThat(expected !== actual, "expected actual not to be: " + expected + ", but it was"));

  // (String, () => [String]) => #
  const testSuite = (name, testImpl) => testImpl()
    .map(result => "TEST-CASE [" + name + "]" + result)
    .map(printOnScreen);

  // (String, () => either FAILED, SUCCESS) => String
  const testCase = (desc, fn) => just(true)
    .map(any => Date.now())
    .ifPresent(time => either.tryIt(fn)
      .biMap(
        error => "[FAILED, " + error.message + "] " + error.stack,
        any => "[PASSED]")
      .fold(just, just)
      .map(result => " " + desc + " " + result + " [TIME: " + (Date.now() - time) + "ms]")
      .get());

  // propertyPath:: [a] -> Lens
  const propertyPath = R.pipe(
    R.map(R.ifElse(R.is(Number), R.lensIndex, R.lensProp)),
    R.apply(R.compose));

  // ------------------------------- CORE ------------------------------- 

  testSuite("compose", () => ([

    testCase("(f.g x) is the same as f(g(x))", () => {
      const inc = x => x + 1;
      const composedInc = compose(inc, inc);

      assertEquals(inc(inc(1)), composedInc(1));
    }),

    testCase("(f.g.h.i x) is the same as ((f.g (h.i x)))", () => {
      const inc = x => x + 1;
      const composedInc = compose(inc, inc);
      const multiComposedInc = compose(composedInc, composedInc);

      assertEquals(composedInc(composedInc(1)), multiComposedInc(1));
    })
  ]));

  // ------------------------------- GAME ------------------------------- 

  const demoData = {
    width: 10,
    height: 10,
    day: 0,
    turnOwner: 0,
    units: [
      { type: "UNTA", x: 8, y: 8 }
    ],
    unitTypes: {
      UNTA: {
        moveType: "TITA"
      }
    },
    properties: [
      { type: "PRTA", x: 9, y: 10, owner: 0 },
      { type: "PRTB", x: 10, y: 10, owner: 1 },
      { type: "PRTB", x: 11, y: 10, owner: 1 },
      { type: "PRTB", x: 12, y: 10, owner: 1 },
      { type: "PRTB", x: 13, y: 10, owner: 1 }
    ],
    propertyTypes: {
      PRTA: {
        funds: 1000
      },
      PRTB: {}
    },
    moveTypes: {
      MVTA: {
        costs: {
          TITA: 2,
          "*": 1
        }
      }
    },
    weatherTypes: {
      WSUN: {}
    }
  };

  const testGameModel = cwtGame.createGame(demoData).fold(assertNeverCalled, id);

  const propertyTurnOwner = R.lensPath(["turn", "owner"]);
  const propertyTurnDay = R.lensPath(["turn", "day"]);
  const lensUnitStats = R.lensPath(["actables"]);

  const getTestModel = R.partial(R.identity, [testGameModel]);

  const eitherFold = R.invoker(2, "fold");

  const evolvePlayer0 = R.over()

  window.demoModel = cwtGame.createGame(demoData).fold(assertNeverCalled, id);

  testSuite("nextTurn", () => ([

    testCase("changes turn owner", () =>
      R.pipe(
        getTestModel,
        cwtGame.nextTurn,
        R.map(R.view(propertyTurnOwner)),
        eitherFold(assertNeverCalled, assertNotEquals(testGameModel.turn.owner)))),

    testCase("when the last player ends his turn, then the day counter increases",
      R.pipe(
        getTestModel,
        R.set(propertyTurnOwner, 3),
        cwtGame.nextTurn,
        R.map(R.view(propertyTurnDay)),
        eitherFold(assertNeverCalled, assertEquals(testGameModel.turn.day + 1)))),

    testCase("after a day change the day limit counter decreases",
      R.pipe(
        getTestModel,
        R.set(propertyTurnOwner, 3),
        cwtGame.nextTurn,
        R.map(R.view(R.lensPath(["limits", "leftDays"]))),
        eitherFold(assertNeverCalled, assertEquals(testGameModel.limits.leftDays - 1)))),

    testCase("increases the gold of the turn owner by the sum of all funds given by properties",
      R.pipe(
        getTestModel,
        R.lensProp("players"),
        R.lensIndex(0),
        cwtGame.nextTurn,
        eitherFold(assertNeverCalled, assertEquals(testGameModel.players[1].gold + 2000))))
  ]));

  testSuite("wait action", () => ([

    testCase("sets the unit into wait status",
      R.pipe(
        getTestModel,
        R.over(lensUnitStats, R.over(R.lensIndex(0), R.T)),
        R.curry(cwtGame.wait)(0),
        R.map(R.view(R.lensPath(["actables", 0]))),
        eitherFold(assertNeverCalled, assertEquals(false)))),

    testCase("does not changes the state of other units",
      R.pipe(
        getTestModel,
        R.over(lensUnitStats, R.map(R.T)),
        R.curry(cwtGame.wait)(0),
        R.map(R.view(R.lensProp("actables"))),
        R.map(R.reduce((a, b) => b ? a + 1 : a, 0)),
        eitherFold(assertNeverCalled, assertEquals(49)))),

    testCase("cannot set unit into wait status if unit id is illegal (left OOB)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.wait)(-1),
        eitherFold(assertStartsWith("IAE-IUI"), assertNeverCalled))),

    testCase("cannot set unit into wait status if unit id is illegal (right OOB)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.wait)(50),
        eitherFold(assertStartsWith("IAE-IUI"), assertNeverCalled))),

    testCase("cannot set unit into wait status if they cannot act",
      R.pipe(
        getTestModel,
        R.over(lensUnitStats, R.over(R.lensIndex(0), R.F)),
        R.curry(cwtGame.wait)(0),
        eitherFold(assertStartsWith("IAE-UCA"), assertNeverCalled)))
  ]));

  testSuite("capture action", () => ([

    testCase("game declines call when capturer and property aren't on the same tile",
      R.pipe(
        getTestModel,
        R.set(propertyPath(["actables", 0]), true),
        R.set(propertyPath(["units", 0, "x"]), 1),
        R.set(propertyPath(["units", 0, "y"]), 1),
        R.set(propertyPath(["properties", 0, "x"]), 2),
        R.set(propertyPath(["properties", 0, "y"]), 2),
        R.curry(cwtGame.captureProperty)(0, 0),
        eitherFold(assertStartsWith("IAE-SFE"), assertNeverCalled)
      )),

    testCase("game declines call on illegal unit id (left-oob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.captureProperty)(-1, 0),
        eitherFold(assertStartsWith("IAE-IUI"), assertNeverCalled)
      )),

    testCase("game declines call on illegal unit id (right-oob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.captureProperty)(50, 0),
        eitherFold(assertStartsWith("IAE-IUI"), assertNeverCalled)
      )),

    testCase("game declines call on non-actable unit id",
      R.pipe(
        getTestModel,
        R.set(propertyPath(["actables", 0]), false),
        R.curry(cwtGame.captureProperty)(0, 0),
        eitherFold(assertStartsWith("IAE-UCA"), assertNeverCalled)
      )),

    testCase("a capture lowers the capture points of the property",
      R.pipe(
        getTestModel,
        R.set(propertyPath(["actables", 0]), true),
        R.set(propertyPath(["units", 0, "hp"]), 99),
        R.set(propertyPath(["units", 0, "x"]), 1),
        R.set(propertyPath(["units", 0, "y"]), 1),
        R.set(propertyPath(["properties", 0, "x"]), 1),
        R.set(propertyPath(["properties", 0, "y"]), 1),
        R.set(propertyPath(["properties", 0, "points"]), 20),
        R.set(propertyPath(["properties", 0, "owner"]), 1),
        R.curry(cwtGame.captureProperty)(0, 0),
        R.map(R.view(propertyPath(["properties", 0, "points"]))),
        eitherFold(assertNeverCalled, assertEquals(10))
      )),

    testCase("a capture changes the owner of the property if points fall down to zero",
      R.pipe(
        getTestModel,
        R.set(propertyPath(["actables", 0]), true),
        R.set(propertyPath(["units", 0, "hp"]), 99),
        R.set(propertyPath(["units", 0, "x"]), 1),
        R.set(propertyPath(["units", 0, "y"]), 1),
        R.set(propertyPath(["units", 0, "owner"]), 0),
        R.set(propertyPath(["properties", 0, "x"]), 1),
        R.set(propertyPath(["properties", 0, "y"]), 1),
        R.set(propertyPath(["properties", 0, "points"]), 10),
        R.set(propertyPath(["properties", 0, "owner"]), 1),
        R.curry(cwtGame.captureProperty)(0, 0),
        R.map(R.view(propertyPath(["properties", 0]))),
        eitherFold(assertNeverCalled, R.allPass([
          R.propSatisfies(assertEquals(20), "points"),
          R.propSatisfies(assertEquals(0), "owner")
        ]))
      )),

    testCase("a capture changes the type of the property if changes type is given",
      R.pipe(
        getTestModel,
        R.set(propertyPath(["actables", 0]), true),
        R.set(propertyPath(["units", 0, "hp"]), 99),
        R.set(propertyPath(["units", 0, "x"]), 1),
        R.set(propertyPath(["units", 0, "y"]), 1),
        R.set(propertyPath(["units", 0, "owner"]), 0),
        R.set(propertyPath(["properties", 0, "x"]), 1),
        R.set(propertyPath(["properties", 0, "y"]), 1),
        R.set(propertyPath(["properties", 0, "points"]), 10),
        R.set(propertyPath(["properties", 0, "owner"]), 1),
        R.curry(cwtGame.captureProperty)(0, 0),
        R.map(R.view(propertyPath(["properties", 0]))),
        eitherFold(assertNeverCalled, R.pipe(
          R.tap(R.propSatisfies(assertEquals(20), "points")),
          R.tap(R.propSatisfies(assertEquals(0), "owner"))))
      )),

    testCase("changing owner leads into a loss of the previous owner when capture_loose_after_captured is enabled",
      R.pipe(
        getTestModel,
        R.set(propertyPath(["actables", 0]), true),
        R.set(propertyPath(["units", 0, "x"]), 1),
        R.set(propertyPath(["units", 0, "y"]), 1),
        R.set(propertyPath(["units", 0, "owner"]), 0),
        R.set(propertyPath(["properties", 0, "x"]), 1),
        R.set(propertyPath(["properties", 0, "y"]), 1),
        R.set(propertyPath(["properties", 0, "owner"]), 1),
        R.set(propertyPath(["properties", 0, "points"]), 1),
        R.set(propertyPath(["properties", 0, "type"]), "PRTA"),
        R.set(propertyPath(["propertyTypes", "PRTA", "capture_loose_after_captured"]), true),
        R.curry(cwtGame.captureProperty)(0, 0),
        eitherFold(assertNeverCalled, R.pipe(
          R.where({ 
            properties: R.pipe(R.reduce((a, b) => b.owner == 1 ? a + 1 : a, 0), assertEquals(0)),
            players: R.pipe(R.nth(0), R.prop("team"), assertEquals(-1))
          })
        ))
      )),

    testCase("game declines call when capturer and property are in the same team",
      R.pipe(
        getTestModel,
        R.set(propertyPath(["actables", 0]), true),
        R.set(propertyPath(["units", 0, "x"]), 1),
        R.set(propertyPath(["units", 0, "y"]), 1),
        R.set(propertyPath(["units", 0, "owner"]), 0),
        R.set(propertyPath(["properties", 0, "x"]), 1),
        R.set(propertyPath(["properties", 0, "y"]), 1),
        R.set(propertyPath(["properties", 0, "owner"]), 1),
        R.set(propertyPath(["properties", 0, "points"]), 1),
        R.set(propertyPath(["properties", 0, "type"]), "PRTA"),
        R.set(propertyPath(["propertyTypes", "PRTA", "capture_change_to"]), "PRTB"),
        R.set(propertyPath(["players", 0, "team"]), 1),
        R.set(propertyPath(["players", 1, "team"]), 2),
        R.curry(cwtGame.captureProperty)(0, 0),
        R.map(R.view(propertyPath(["properties", 0, "type"]))),
        eitherFold(assertNeverCalled, assertEquals("PRTB"))
      ))
  ]));

  testSuite("test group", () => ([

    testCase("testA",
      R.pipe(x => x)),

    testCase("testB",
      R.pipe(x => x))
  ]));

  // ------------------------------- CLIENT ------------------------------- 


})(window.cwtTest || (window.cwtTest = {}));