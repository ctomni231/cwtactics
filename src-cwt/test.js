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

  const assertNeverCalled = () => assertThat(false, "unreachable point was reached");

  const printOnScreen = (msg) => just(msg)
    .map(msg => msg.replace(/\n/gi, "</br>").replace(/\s/gi, "&nbsp;") + "</br>")
    .ifPresent(msg => document.getElementById("devOUT").innerHTML += msg);

  const assertThat = (expression, msg) => {
    if (!expression) {
      throw new Error(msg);
    }
  };

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

  // ------------------------------- CORE ------------------------------- 

  testSuite("test-API", () => ([
    testCase("equals 1, 1 will pass", () => assertEquals(1, 1)),
    testCase("equals 1, 2 will fail", () => assertEquals(1, 2))
  ]));

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
      { type: "PRTA", x: 9, y: 10 },
      { type: "PRTB", x: 10, y: 10 },
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

  window.demoModel = cwtGame.createGame(demoData).fold(assertNeverCalled, id);

  testSuite("nextTurn", () => ([

    testCase("changes turn owner", () =>
      eitherRight(testGameModel)
      .bind(cwtGame.nextTurn)
      .fold(assertNeverCalled,
        model => assertNotEquals(testGameModel.turn.owner, model.turn.owner))),

    testCase("when the last player ends his turn, then the day counter increases", () =>
      eitherRight(testGameModel)
      .map(model => createCopy(model, {
        turn: createCopy(model.turn, { owner: 3 })
      }))
      .bind(cwtGame.nextTurn)
      .fold(assertNeverCalled,
        model => assertEquals(testGameModel.turn.day + 1, model.turn.day))),

    testCase("after a day change the day limit counter decreases", () =>
      eitherRight(testGameModel)
      .map(model => createCopy(model, {
        turn: createCopy(model.turn, { owner: 3 })
      }))
      .bind(cwtGame.nextTurn)
      .fold(assertNeverCalled,
        model => assertEquals(testGameModel.limits.leftDays - 1, model.limits.leftDays)))
  ]));

  // ------------------------------- CLIENT ------------------------------- 


})(window.cwtTest || (window.cwtTest = {}));