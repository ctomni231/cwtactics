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

  // toFixedLength :: String -> String
  var toFixedLength = R.curry((wantedLength, s) => R.cond([
    [R.propSatisfies(R.gt(R.__, wantedLength), "length"),
      R.pipe(R.take(wantedLength - 3), R.append("..."), R.join(""))
    ],
    [R.propSatisfies(R.lt(R.__, wantedLength), "length"), s => {
      const rest = wantedLength - s.length;
      return R.join("", R.times(R.always(" "), rest)) + s;
    }],
    [R.T,
      R.identity
    ]
  ])(s));

  const testSuite = (name, testImpl) => {

    const groupTime = Date.now();
    const results = testImpl();
    const groupTimeDiff = Date.now() - groupTime;

    const numTests = R.length(results);
    const numFailed = R.length(R.filter(s => s.indexOf("[FAILED]") !== -1, results));
    const numPassed = R.length(R.filter(s => s.indexOf("[PASSED]") !== -1, results));

    console.groupCollapsed("SPEC-GROUP: " + toFixedLength(25, name) +
      " [SPECS: " + toFixedLength(2, numTests.toString()) +
      " PASSED: " + toFixedLength(2, numPassed.toString()) +
      " FAILED: " + toFixedLength(2, numFailed.toString()) + "] " +
      " [TIME: " + toFixedLength(4, groupTimeDiff.toString()) + "ms]");
    results.map(msg => console.log(msg));
    console.groupEnd();

    return true;
  };

  // (String, () => either FAILED, SUCCESS) => String
  const testCase = (desc, fn) => just(true)
    .map(any => Date.now())
    .ifPresent(time => either.tryIt(fn)
      .biMap(
        error => "[FAILED] " + error.stack,
        any => "[PASSED]")
      .fold(just, just)
      .map(result => result + " " + desc + " [TIME: " + (Date.now() - time) + "ms]")
      .get());

  // propertyPath:: [a] -> Lens
  const propertyPath = R.pipe(
    R.map(R.ifElse(R.is(Number), R.lensIndex, R.lensProp)),
    R.apply(R.compose));

  const demoData = {
    width: 10,
    height: 10,
    day: 0,
    turnOwner: 0,
    units: [
      { type: "UNTA", x: 8, y: 8 }
    ],
    unitTypes: {
      UNTA: { moveType: "MVTA" }
    },
    properties: [
      { type: "PRTA", x: 9, y: 10, owner: 0 },
      { type: "PRTA", x: 10, y: 10, owner: 1 },
      { type: "PRTA", x: 11, y: 10, owner: 1 },
      { type: "PRTA", x: 12, y: 10, owner: 1 },
      { type: "PRTA", x: 13, y: 10, owner: 1 }
    ],
    propertyTypes: {
      PRTA: { funds: 1000 },
      PRTB: {}
    },
    moveTypes: {
      MVTA: { costs: { TITA: 2, "*": 1 } }
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

  window.demoModel = cwtGame.createGame(demoData).fold(assertNeverCalled, id);

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------
  //
  //               CWT GAME SPECIFICATION
  //
  //               VERSION 0.35.902 [TARGET 0.36]
  // 
  // TODO: INTEGRATE MOVING API INTO THE ACTIONS
  // TODO: ADD FOG MECHANIC INTO THE SPECIFICATION
  // TODO: ADD ANDY CO MECHANIC
  // TODO: ADD MAX CO MECHANIC
  // TODO: ADD SAMI CO MECHANIC
  // TODO: ADD HEALTH-RELATIVE CAPTURE VALUE
  // TODO: FINISH ATTACK MECHANIC
  // TODO: ADD GET ACTIONS FOR POSITION 
  // TODO: ADD GET MOVE TARGETS 
  // TODO: ADD GET ATTACK RANGE 
  //
  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------


  testSuite("creating game", () => ([
    testCase("TBD", assertNeverCalled)
  ]));

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

    testCase("declined when capturer does not belongs to the turn owner", assertNeverCalled),

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
        R.set(propertyPath(["players", 0, "team"]), 1),
        R.set(propertyPath(["players", 1, "team"]), 1),
        R.curry(cwtGame.captureProperty)(0, 0),
        eitherFold(assertStartsWith("IAE-DTE"), assertNeverCalled)
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

    testCase("property changes its type when capture_change_to is given",
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

    testCase("changing owner leads into loss of the old owner when its left properties are lower than the minimum amount",
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
        R.set(propertyPath(["players", 0, "team"]), 1),
        R.set(propertyPath(["players", 1, "team"]), 2),
        R.set(propertyPath(["limits", "minimumProperties"]), 5),
        R.curry(cwtGame.captureProperty)(0, 0),
        eitherFold(assertNeverCalled, R.where({
          properties: R.pipe(R.reduce((a, b) => b.owner == 1 ? a + 1 : a, 0), assertEquals(0)),
          players: R.pipe(R.nth(1), R.prop("team"), assertEquals(-1))
        }))
      ))
  ]));

  // rocketId, firerId, tx, ty
  testSuite("fire rocket", () => ([

    testCase("declined when unit does not belongs to the turn owner", assertNeverCalled),

    testCase("illegal position will be declined",
      R.pipe(
        R.pipe(
          getTestModel,
          R.curry(cwtGame.fireRocket)(0, 0, -1, 0),
          eitherFold(assertStartsWith("IAE-IPV"), assertNeverCalled)),
        R.pipe(
          getTestModel,
          R.curry(cwtGame.fireRocket)(0, 0, 0, -1),
          eitherFold(assertStartsWith("IAE-IPV"), assertNeverCalled)),
        R.pipe(
          getTestModel,
          R.curry(cwtGame.fireRocket)(0, 0, 1000, 0),
          eitherFold(assertStartsWith("IAE-IPV"), assertNeverCalled)),
        R.pipe(
          getTestModel,
          R.curry(cwtGame.fireRocket)(0, 0, 0, 1000),
          eitherFold(assertStartsWith("IAE-IPV"), assertNeverCalled)))),

    testCase("illegal firer id will be declined",
      R.pipe(
        R.pipe(
          getTestModel,
          R.curry(cwtGame.fireRocket)(0, -1, 0, 0),
          eitherFold(assertStartsWith("IAE-IUI"), assertNeverCalled)),
        R.pipe(
          getTestModel,
          R.curry(cwtGame.fireRocket)(0, 50, 0, 0),
          eitherFold(assertStartsWith("IAE-IUI"), assertNeverCalled)))),

    testCase("illegal rocket silo id will be declined",
      R.pipe(
        R.pipe(
          getTestModel,
          R.curry(cwtGame.fireRocket)(-1, 0, 0, 0),
          eitherFold(assertStartsWith("IAE-IPI"), assertNeverCalled)),
        R.pipe(
          getTestModel,
          R.curry(cwtGame.fireRocket)(300, 0, 0, 0),
          eitherFold(assertStartsWith("IAE-IPI"), assertNeverCalled)))),

    testCase("non rocket silo will be declined",
      R.pipe(
        getTestModel,
        R.set(propertyPath(["properties", 0, "x"]), 0),
        R.set(propertyPath(["properties", 0, "y"]), 0),
        R.set(propertyPath(["propertyTypes", "PRTA", "rocket_range"]), 0),
        R.set(propertyPath(["unitTypes", "UNTA", "canFireRockets"]), true),
        R.set(propertyPath(["units", 0, "x"]), 0),
        R.set(propertyPath(["units", 0, "y"]), 0),
        R.set(propertyPath(["units", 0, "owner"]), 0),
        R.curry(cwtGame.fireRocket)(0, 0, 2, 0),
        eitherFold(assertStartsWith("iae:ipt"), assertNeverCalled)
      )),

    testCase("when firer doesnt able to fire a rocket silo then the call will be declined",
      R.pipe(
        getTestModel,
        R.set(propertyPath(["properties", 0, "x"]), 0),
        R.set(propertyPath(["properties", 0, "y"]), 0),
        R.set(propertyPath(["propertyTypes", "PRTA", "rocket_range"]), 1),
        R.set(propertyPath(["unitTypes", "UNTA", "canFireRockets"]), false),
        R.set(propertyPath(["units", 0, "x"]), 0),
        R.set(propertyPath(["units", 0, "y"]), 0),
        R.curry(cwtGame.fireRocket)(0, 0, 2, 0),
        eitherFold(assertStartsWith("iae:iut"), assertNeverCalled)
      )),

    testCase("when firer isnt on the rocket silo then the call will be declined",
      R.pipe(
        getTestModel,
        R.set(propertyPath(["properties", 0, "x"]), 0),
        R.set(propertyPath(["properties", 0, "y"]), 0),
        R.set(propertyPath(["propertyTypes", "PRTA", "rocket_range"]), 1),
        R.set(propertyPath(["unitTypes", "UNTA", "canFireRockets"]), true),
        R.set(propertyPath(["units", 0, "x"]), 1),
        R.set(propertyPath(["units", 0, "y"]), 0),
        R.curry(cwtGame.fireRocket)(0, 0, 2, 0),
        eitherFold(assertStartsWith("iae:spe"), assertNeverCalled)
      )),

    testCase("damages all units in range at the target position",
      R.pipe(
        getTestModel,
        R.set(propertyPath(["properties", 0, "x"]), 0),
        R.set(propertyPath(["properties", 0, "y"]), 0),
        R.set(propertyPath(["properties", 0, "owner"]), -1),
        R.set(propertyPath(["propertyTypes", "PRTA", "rocket_range"]), 3),
        R.set(propertyPath(["unitTypes", "UNTA", "canFireRockets"]), true),
        R.set(propertyPath(["units", 0, "x"]), 0),
        R.set(propertyPath(["units", 0, "y"]), 0),
        R.set(propertyPath(["units", 0, "owner"]), 0),
        R.set(propertyPath(["units", 1, "x"]), 4),
        R.set(propertyPath(["units", 1, "y"]), 0),
        R.set(propertyPath(["units", 1, "owner"]), 0),
        R.set(propertyPath(["units", 2, "x"]), 5),
        R.set(propertyPath(["units", 2, "y"]), 0),
        R.set(propertyPath(["units", 2, "owner"]), 1),
        R.set(propertyPath(["units", 3, "x"]), 6),
        R.set(propertyPath(["units", 3, "y"]), 0),
        R.set(propertyPath(["units", 3, "owner"]), 2),
        R.curry(cwtGame.fireRocket)(0, 0, 5, 0),
        eitherFold(assertNeverCalled, R.where({
          units: R.pipe(
            R.take(4),
            R.takeLast(3),
            R.map(R.prop("hp")),
            R.all(assertEquals(79)))
        }))
      )),

    testCase("damages no unit that are not in the range at the target position",
      R.pipe(
        getTestModel,
        R.set(propertyPath(["properties", 0, "x"]), 0),
        R.set(propertyPath(["properties", 0, "y"]), 0),
        R.set(propertyPath(["properties", 0, "owner"]), -1),
        R.set(propertyPath(["propertyTypes", "PRTA", "rocket_range"]), 1),
        R.set(propertyPath(["unitTypes", "UNTA", "canFireRockets"]), true),
        R.set(propertyPath(["units", 0, "x"]), 0),
        R.set(propertyPath(["units", 0, "y"]), 0),
        R.set(propertyPath(["units", 0, "owner"]), 0),
        R.curry(cwtGame.fireRocket)(0, 0, 2, 0),
        R.map(R.view(propertyPath(["units", 0, "hp"]))),
        eitherFold(assertNeverCalled, assertEquals(99))
      ))
  ]));

  testSuite("elapse time", () => ([

    testCase("negative time will be declined",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.elapseTime)(-100),
        eitherFold(assertStartsWith("IAE-PIE"), assertNeverCalled)
      )),

    testCase("decreases the left turn time in the limit object",
      R.pipe(
        getTestModel,
        R.set(propertyPath(["limits", "leftTurnTime"]), 100),
        R.curry(cwtGame.elapseTime)(50),
        R.map(R.view(propertyPath(["limits", "leftTurnTime"]))),
        eitherFold(assertNeverCalled, assertEquals(50))
      )),

    testCase("decreases the left game time in the limit object",
      R.pipe(
        getTestModel,
        R.set(propertyPath(["limits", "leftGameTime"]), 100),
        R.curry(cwtGame.elapseTime)(50),
        R.map(R.view(propertyPath(["limits", "leftGameTime"]))),
        eitherFold(assertNeverCalled, assertEquals(50))
      )),

    testCase("increases turn owner when leftTurnTime falls down to zero",
      R.pipe(
        getTestModel,
        R.set(propertyPath(["limits", "leftTurnTime"]), 100),
        R.set(propertyPath(["turn", "owner"]), 0),
        R.curry(cwtGame.elapseTime)(100),
        R.map(R.view(propertyPath(["turn", "owner"]))),
        eitherFold(assertNeverCalled, assertEquals(1))
      )),

    testCase("deactivates all players when game timit falls dawn to zero",
      R.pipe(
        getTestModel,
        R.set(propertyPath(["limits", "leftGameTime"]), 100),
        R.curry(cwtGame.elapseTime)(100),
        R.map(R.view(propertyPath(["players"]))),
        R.map(R.reduce((a, b) => b.team > -1 ? a + 1 : a, 0)),
        eitherFold(assertNeverCalled, assertEquals(0))
      ))
  ]));

  testSuite("yield game", () => ([

    testCase("decilines when a player is already disabled",
      R.pipe(
        getTestModel,
        R.set(propertyPath(["players", 0, "team"]), -1),
        R.curry(cwtGame.yieldGame)(0),
        eitherFold(assertStartsWith("iae:pad"), assertNeverCalled)
      )),

    testCase("decilines when the player id is invalid",
      R.pipe(
        R.pipe(
          getTestModel,
          R.curry(cwtGame.yieldGame)(-1),
          eitherFold(assertStartsWith("iae:ipi"), assertNeverCalled)
        ),
        R.pipe(
          getTestModel,
          R.curry(cwtGame.yieldGame)(4),
          eitherFold(assertStartsWith("iae:ipi"), assertNeverCalled)
        ))),

    testCase("when a player yields then he/she will be disabled",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.yieldGame)(0),
        R.map(R.view(propertyPath(["players", 0, "team"]))),
        eitherFold(assertNeverCalled, assertEquals(-1))
      ))
  ]));

  testSuite("produce unit", () => ([
    testCase("declined when factory does not belongs to the turn owner", assertNeverCalled),
    testCase("declined when factory id is invalid", assertNeverCalled),
    testCase("declined when unit type is invalid", assertNeverCalled),
    testCase("declined when player has too much units", assertNeverCalled),
    testCase("declined when player has not enough gold", assertNeverCalled),
    testCase("declined when factory is neutral", assertNeverCalled),
    testCase("declined when factory is occuppied by an unit", assertNeverCalled),
    testCase("declined when factory cannot build the given unit type", assertNeverCalled),
    testCase("subtracts the unit costs from the factory owners gold", assertNeverCalled),
    testCase("creates a new unit on the factory", assertNeverCalled),
    testCase("created new unit cannot act in the active turn", assertNeverCalled)
  ]));

  testSuite("destroy unit", () => ([

    testCase("declined when unit id is invalid (roob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.destroyUnit)(50),
        eitherFold(assertStartsWith("iae:iui"), assertNeverCalled))),

    testCase("declined when unit id is invalid (loob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.destroyUnit)(-1),
        eitherFold(assertStartsWith("iae:iui"), assertNeverCalled))),

    testCase("removes unit from the game round",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.destroyUnit)(0),
        R.map(R.view(R.propertyPath(["units", 0, "owner"]))),
        eitherFold(assertNeverCalled, assertEquals(-1)))),

    testCase("player looses game when he/she has no units left an noUnitsLeftMeansLoose is enabled",
      R.pipe(
        getTestModel,
        R.over(
          R.propertyPath(["units"]),
          R.map(R.evolve({ owner: R.always(-1) }))),
        R.set(R.propertyPath(["units", 0, "owner"]), 1),
        R.set(R.propertyPath(["cfg", "noUnitsLeftMeansLoose"]), true),
        R.curry(cwtGame.destroyUnit)(0),
        R.map(R.view(R.propertyPath(["players", 0, "team"]))),
        eitherFold(assertNeverCalled, assertEquals(-1))))
  ]));

  testSuite("attack units", () => ([

    testCase("declined when attacker id is invalid (roob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.attackUnit)(50, 0),
        eitherFold(assertStartsWith("iae:iui:att"), assertNeverCalled))),

    testCase("declined when attacker id is invalid (loob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.attackUnit)(-1, 0),
        eitherFold(assertStartsWith("iae:iui:att"), assertNeverCalled))),

    testCase("declined when attacker id is invalid (roob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.attackUnit)(0, 50),
        eitherFold(assertStartsWith("iae:iui:def"), assertNeverCalled))),

    testCase("declined when attacker id is invalid (loob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.attackUnit)(0, -1),
        eitherFold(assertStartsWith("iae:iui:def"), assertNeverCalled))),

    testCase("declined when attacker id is invalid (roob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.attackUnit)(50, 0),
        eitherFold(assertStartsWith("iae:iui:att"), assertNeverCalled))),

    testCase("declined when attacker cannot act", 
      R.pipe(
        getTestModel,
        R.set(R.propertyPath(["actables", 0]), true),
        R.curry(cwtGame.attackUnit)(50, 0),
        eitherFold(assertStartsWith("iae:iui:att"), assertNeverCalled))),

    testCase("attack lowers defenders health", assertNeverCalled),
    testCase("defender lowers attackers health when he/she survives and is direct and standing on a neighbour tile", assertNeverCalled),
    testCase("defender does not lowers attackers health when he/she dies", assertNeverCalled),
    testCase("defender does not lowers attackers health when he/she does not standing on a neighbour tile", assertNeverCalled),
    testCase("attack lowers defenders health", assertNeverCalled)
  ]));

  testSuite("activate power", () => ([
    testCase("declined when the player is is invalid", assertNeverCalled),
    testCase("declined when the player has already an activated power", assertNeverCalled),
    testCase("declined when the player has not enough power to activate", assertNeverCalled),
    testCase("set the power level of the player to POWER", assertNeverCalled),
    testCase("sets the power value of the player to zero", assertNeverCalled)
  ]));

  testSuite("activate super power", () => ([
    testCase("declined when the player is is invalid", assertNeverCalled),
    testCase("declined when the player has already an activated power", assertNeverCalled),
    testCase("declined when the player has not enough power to activate", assertNeverCalled),
    testCase("set the power level of the player to POWER", assertNeverCalled),
    testCase("sets the power value of the player to zero", assertNeverCalled)
  ]));

  testSuite("move unit", () => ([
    testCase("TBD", assertNeverCalled)
  ]));

  testSuite("resupply neightbours", () => ([
    testCase("declines when supplier id is invalid", assertNeverCalled),
    testCase("declines when supplier cannot act", assertNeverCalled),
    testCase("declines when no target is surrouding the supplier", assertNeverCalled),
    testCase("refills fuel in all own units in range", assertNeverCalled),
    testCase("refills ammo in all own units in range", assertNeverCalled),
    testCase("ignores allied units", assertNeverCalled),
    testCase("ignores enemy units", assertNeverCalled)
  ]));

  testSuite("unload unit", () => ([
    testCase("declines when load id is invalid", assertNeverCalled),
    testCase("declines when transporter id is invalid", assertNeverCalled),
    testCase("declines when load is not loaded by transporter", assertNeverCalled),
    testCase("declines when transporter cannot act", assertNeverCalled),
    testCase("declines when the tile in target direction is not empty", assertNeverCalled),
    testCase("declines when the load cannot act", assertNeverCalled)
  ]));

  testSuite("load unit", () => ([
    testCase("declines when load id is invalid", assertNeverCalled),
    testCase("declines when transporter id is invalid", assertNeverCalled),
    testCase("declines when load id is already loaded", assertNeverCalled),
    testCase("declines when transporter cannot load unit", assertNeverCalled),
    testCase("declines when transporter has no room left", assertNeverCalled),
    testCase("declines when the load cannot act", assertNeverCalled),
    testCase("load looses its position", assertNeverCalled),
    testCase("load is loaded in transporter", assertNeverCalled),
    testCase("transporters load count increases", assertNeverCalled)
  ]));

  // ------------------------------- CLIENT ------------------------------- 


})(window.cwtTest || (window.cwtTest = {}));