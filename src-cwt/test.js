cwtGame.doTest = () => {


};

(function(exports) {

  const assertThat = (expression, msg) => {
    if (!expression) {
      throw new Error(msg);
    }
  };

  const assertNeverCalled = any =>
    assertThat(false, "unreachable point was reached: " + any);

  const assertStartsWith = R.curry(
    (startsWith, string) => assertThat(string.indexOf(startsWith) === 0, "expected: " + string + " to starts with " + startsWith));

  const assertEquals = R.curry(
    (expected, actual) => assertThat(expected === actual, "expected: " + expected + ", but was: " + actual));

  const assertTrue = assertEquals(true);

  const assertFalse = assertEquals(false);

  const assertNotEquals = R.curry(
    (expected, actual) => assertThat(expected !== actual, "expected actual not to be: " + expected + ", but it was"));

  const testSuite = (name, testImpl) => {

    const groupTime = Date.now();
    const results = testImpl();
    const groupTimeDiff = Date.now() - groupTime;

    const numTests = R.length(results);
    const numFailed = R.length(R.filter(R.test(/\[FAILED\]/), results));
    const numPassed = R.length(R.filter(R.test(/\[PASSED\]/), results));

    const lineDesc = R.join(" ", [
      "SPEC-GROUP:", RExt.mapToFixedLength(25, name),
      "[SPECS: ", RExt.mapToFixedLength(2, numTests.toString()),
      "PASSED: ", RExt.mapToFixedLength(2, numPassed.toString()),
      "FAILED: ", RExt.mapToFixedLength(2, numFailed.toString()), "] ",
      "[TIME: ", RExt.mapToFixedLength(4, groupTimeDiff.toString()), "ms]"
    ]);

    console.groupCollapsed(lineDesc);
    results.map(msg => console.log(msg));
    console.groupEnd();

    return true;
  };

  // (String, () => either FAILED, SUCCESS) => String
  const testCase = (desc, fn) => RExt.Maybe(true)
    .map(any => Date.now())
    .ifPresent(time => RExt.Either.tryIt(fn)
      .biMap(
        error => "[FAILED] " + error.stack,
        any => "[PASSED]")
      .fold(RExt.Maybe, RExt.Maybe)
      .map(result => result + " " + desc + " [TIME: " + (Date.now() - time) + "ms]")
      .fold(R.identity, R.identity));

  // Default test data set
  //
  const testGameModel = cwtGame.createGame({
    width: 10,
    height: 10,
    day: 0,
    turnOwner: 0,
    units: [
      { type: "UNTA", x: 8, y: 8 }
    ],
    unitTypes: {
      UNTA: { moveType: "MVTA" },
      UNTD: {
        minRange: 1,
        maxRange: 1,
        mainWeaponDamage: { "UNTD": 10, "UNTI": 20 },
        secondaryWeaponDamage: { "UNTD": 10 }
      },
      UNTI: {
        minRange: 2,
        maxRange: 3,
        mainWeaponDamage: { "UNTD": 30, "UNTI": 30 }
      }
    },
    properties: [
      { type: "PRTA", x: 9, y: 10, owner: 0 },
      { type: "PRTA", x: 10, y: 10, owner: 1 },
      { type: "PRTA", x: 11, y: 10, owner: 1 },
      { type: "PRTA", x: 12, y: 10, owner: 1 },
      { type: "PRTA", x: 13, y: 10, owner: 1 }
    ],
    propertyTypes: {
      PRTA: { funds: 1000, builds: ["UNTA"] },
      PRTB: {}
    },
    moveTypes: {
      MVTA: { costs: { TITA: 2, "*": 1 } }
    },
    weatherTypes: {
      WSUN: {}
    }
  }).fold(assertNeverCalled, R.identity);

  const propertyTurnOwner = R.lensPath(["turn", "owner"]);
  const propertyTurnDay = R.lensPath(["turn", "day"]);
  const lensUnitStats = R.lensPath(["actables"]);

  const getTestModel = R.partial(R.identity, [testGameModel]);

  const eitherFold = R.invoker(2, "fold");

  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------
  //
  //               CWT GAME SPECIFICATION
  //
  //               VERSION 0.36
  //
  // TODO: 0.37 - COMMANDERS
  //   ADD ANDY HP HEAL MECHANIC
  //   ADD RANDOM SEED FOR ATTACK
  //
  // -------------------------------------------------------------------------------------
  // -------------------------------------------------------------------------------------


  testSuite("creating game", () => ([
    testCase("declines illegal weather types", assertNeverCalled),
    testCase("declines illegal property types", assertNeverCalled),
    testCase("declines illegal unit types", assertNeverCalled),
    testCase("declines illegal move types", assertNeverCalled),
    testCase("declines illegal limits", assertNeverCalled),
    testCase("declines illegal actables", assertNeverCalled),
    testCase("declines illegal weathers", assertNeverCalled),
    testCase("declines illegal units", assertNeverCalled),
    testCase("declines illegal properties", assertNeverCalled),
    testCase("declines illegal players", assertNeverCalled),
    testCase("declines illegal turn", assertNeverCalled),
    testCase("declines illegal config", assertNeverCalled),
    testCase("declines illegal tile types", assertNeverCalled),
    testCase("declines illegal map", assertNeverCalled),
    testCase("declines illegal fog", assertNeverCalled),
    testCase("creates valid model", assertNeverCalled)
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
        R.over(RExt.nestedPath(["properties"]), R.map(R.evolve({ owner: R.always(-1) }))),
        R.set(RExt.nestedPath(["properties", 0, "owner"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "type"]), "PRTA"),
        R.set(RExt.nestedPath(["properties", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["properties", 1, "type"]), "PRTA"),
        R.set(RExt.nestedPath(["propertyTypes", "PRTA", "funds"]), 1000),
        R.set(RExt.nestedPath(["players", 1, "gold"]), 0),
        R.set(RExt.nestedPath(["turn", "owner"]), 0),
        cwtGame.nextTurn,
        R.map(R.view(RExt.nestedPath(["players", 1, "gold"]))),
        eitherFold(assertNeverCalled, assertEquals(2000)))),

    testCase("updates fog according to the objects of the new turn owner", assertNeverCalled)
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
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.set(RExt.nestedPath(["units", 0, "x"]), 1),
        R.set(RExt.nestedPath(["units", 0, "y"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "x"]), 2),
        R.set(RExt.nestedPath(["properties", 0, "y"]), 2),
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
        R.set(RExt.nestedPath(["actables", 0]), false),
        R.curry(cwtGame.captureProperty)(0, 0),
        eitherFold(assertStartsWith("IAE-UCA"), assertNeverCalled)
      )),

    testCase("game declines call when capturer and property are in the same team",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.set(RExt.nestedPath(["units", 0, "x"]), 1),
        R.set(RExt.nestedPath(["units", 0, "y"]), 1),
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["properties", 0, "x"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "y"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "owner"]), 1),
        R.set(RExt.nestedPath(["players", 0, "team"]), 1),
        R.set(RExt.nestedPath(["players", 1, "team"]), 1),
        R.curry(cwtGame.captureProperty)(0, 0),
        eitherFold(assertStartsWith("IAE-DTE"), assertNeverCalled)
      )),

    testCase("a capture lowers the capture points of the property",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 0, "x"]), 1),
        R.set(RExt.nestedPath(["units", 0, "y"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "x"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "y"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "points"]), 20),
        R.set(RExt.nestedPath(["properties", 0, "owner"]), 1),
        R.curry(cwtGame.captureProperty)(0, 0),
        R.map(R.view(RExt.nestedPath(["properties", 0, "points"]))),
        eitherFold(assertNeverCalled, assertEquals(10))
      )),

    testCase("the capture value is hp relative",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 49),
        R.set(RExt.nestedPath(["units", 0, "x"]), 1),
        R.set(RExt.nestedPath(["units", 0, "y"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "x"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "y"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "points"]), 20),
        R.set(RExt.nestedPath(["properties", 0, "owner"]), 1),
        R.curry(cwtGame.captureProperty)(0, 0),
        R.map(R.view(RExt.nestedPath(["properties", 0, "points"]))),
        eitherFold(assertNeverCalled, assertEquals(15))
      )),

    testCase("a capture changes the owner of the property if points fall down to zero",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 0, "x"]), 1),
        R.set(RExt.nestedPath(["units", 0, "y"]), 1),
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["properties", 0, "x"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "y"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "points"]), 10),
        R.set(RExt.nestedPath(["properties", 0, "owner"]), 1),
        R.curry(cwtGame.captureProperty)(0, 0),
        R.map(R.view(RExt.nestedPath(["properties", 0]))),
        eitherFold(assertNeverCalled, R.allPass([
          R.propSatisfies(assertEquals(20), "points"),
          R.propSatisfies(assertEquals(0), "owner")
        ]))
      )),

    testCase("a capture changes the type of the property if changes type is given",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 0, "x"]), 1),
        R.set(RExt.nestedPath(["units", 0, "y"]), 1),
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["properties", 0, "x"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "y"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "points"]), 10),
        R.set(RExt.nestedPath(["properties", 0, "owner"]), 1),
        R.curry(cwtGame.captureProperty)(0, 0),
        R.map(R.view(RExt.nestedPath(["properties", 0]))),
        eitherFold(assertNeverCalled, R.pipe(
          R.tap(R.propSatisfies(assertEquals(20), "points")),
          R.tap(R.propSatisfies(assertEquals(0), "owner"))))
      )),

    testCase("property changes its type when capture_change_to is given",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.set(RExt.nestedPath(["units", 0, "x"]), 1),
        R.set(RExt.nestedPath(["units", 0, "y"]), 1),
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["properties", 0, "x"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "y"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "owner"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "points"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "type"]), "PRTA"),
        R.set(RExt.nestedPath(["propertyTypes", "PRTA", "capture_change_to"]), "PRTB"),
        R.set(RExt.nestedPath(["players", 0, "team"]), 1),
        R.set(RExt.nestedPath(["players", 1, "team"]), 2),
        R.curry(cwtGame.captureProperty)(0, 0),
        R.map(R.view(RExt.nestedPath(["properties", 0, "type"]))),
        eitherFold(assertNeverCalled, assertEquals("PRTB"))
      )),

    testCase("changing owner leads into a loss of the previous owner when capture_loose_after_captured is enabled",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.set(RExt.nestedPath(["units", 0, "x"]), 1),
        R.set(RExt.nestedPath(["units", 0, "y"]), 1),
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["properties", 0, "x"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "y"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "owner"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "points"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "type"]), "PRTA"),
        R.set(RExt.nestedPath(["propertyTypes", "PRTA", "capture_loose_after_captured"]), true),
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
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.set(RExt.nestedPath(["units", 0, "x"]), 1),
        R.set(RExt.nestedPath(["units", 0, "y"]), 1),
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["properties", 0, "x"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "y"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "owner"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "points"]), 1),
        R.set(RExt.nestedPath(["players", 0, "team"]), 1),
        R.set(RExt.nestedPath(["players", 1, "team"]), 2),
        R.set(RExt.nestedPath(["limits", "minimumProperties"]), 5),
        R.curry(cwtGame.captureProperty)(0, 0),
        eitherFold(assertNeverCalled, R.where({
          properties: R.pipe(R.reduce((a, b) => b.owner == 1 ? a + 1 : a, 0), assertEquals(0)),
          players: R.pipe(R.nth(1), R.prop("team"), assertEquals(-1))
        }))
      )),

    testCase("updates fog when property is captured", assertNeverCalled)
  ]));

  testSuite("fire rocket", () => ([

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
        R.set(RExt.nestedPath(["properties", 0, "x"]), 0),
        R.set(RExt.nestedPath(["properties", 0, "y"]), 0),
        R.set(RExt.nestedPath(["propertyTypes", "PRTA", "rocket_range"]), 0),
        R.set(RExt.nestedPath(["unitTypes", "UNTA", "canFireRockets"]), true),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.curry(cwtGame.fireRocket)(0, 0, 2, 0),
        eitherFold(assertStartsWith("iae:ipt"), assertNeverCalled)
      )),

    testCase("when firer doesnt able to fire a rocket silo then the call will be declined",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["properties", 0, "x"]), 0),
        R.set(RExt.nestedPath(["properties", 0, "y"]), 0),
        R.set(RExt.nestedPath(["propertyTypes", "PRTA", "rocket_range"]), 1),
        R.set(RExt.nestedPath(["unitTypes", "UNTA", "canFireRockets"]), false),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.curry(cwtGame.fireRocket)(0, 0, 2, 0),
        eitherFold(assertStartsWith("iae:iut"), assertNeverCalled)
      )),

    testCase("when firer isnt on the rocket silo then the call will be declined",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["properties", 0, "x"]), 0),
        R.set(RExt.nestedPath(["properties", 0, "y"]), 0),
        R.set(RExt.nestedPath(["propertyTypes", "PRTA", "rocket_range"]), 1),
        R.set(RExt.nestedPath(["unitTypes", "UNTA", "canFireRockets"]), true),
        R.set(RExt.nestedPath(["units", 0, "x"]), 1),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.curry(cwtGame.fireRocket)(0, 0, 2, 0),
        eitherFold(assertStartsWith("iae:spe"), assertNeverCalled)
      )),

    testCase("damages all units in range at the target position",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["properties", 0, "x"]), 0),
        R.set(RExt.nestedPath(["properties", 0, "y"]), 0),
        R.set(RExt.nestedPath(["properties", 0, "owner"]), -1),
        R.set(RExt.nestedPath(["propertyTypes", "PRTA", "rocket_range"]), 3),
        R.set(RExt.nestedPath(["unitTypes", "UNTA", "canFireRockets"]), true),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 1, "x"]), 4),
        R.set(RExt.nestedPath(["units", 1, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 2, "x"]), 5),
        R.set(RExt.nestedPath(["units", 2, "y"]), 0),
        R.set(RExt.nestedPath(["units", 2, "owner"]), 1),
        R.set(RExt.nestedPath(["units", 3, "x"]), 6),
        R.set(RExt.nestedPath(["units", 3, "y"]), 0),
        R.set(RExt.nestedPath(["units", 3, "owner"]), 2),
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
        R.set(RExt.nestedPath(["properties", 0, "x"]), 0),
        R.set(RExt.nestedPath(["properties", 0, "y"]), 0),
        R.set(RExt.nestedPath(["properties", 0, "owner"]), -1),
        R.set(RExt.nestedPath(["propertyTypes", "PRTA", "rocket_range"]), 1),
        R.set(RExt.nestedPath(["unitTypes", "UNTA", "canFireRockets"]), true),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.curry(cwtGame.fireRocket)(0, 0, 2, 0),
        R.map(R.view(RExt.nestedPath(["units", 0, "hp"]))),
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
        R.set(RExt.nestedPath(["limits", "leftTurnTime"]), 100),
        R.curry(cwtGame.elapseTime)(50),
        R.map(R.view(RExt.nestedPath(["limits", "leftTurnTime"]))),
        eitherFold(assertNeverCalled, assertEquals(50))
      )),

    testCase("decreases the left game time in the limit object",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["limits", "leftGameTime"]), 100),
        R.curry(cwtGame.elapseTime)(50),
        R.map(R.view(RExt.nestedPath(["limits", "leftGameTime"]))),
        eitherFold(assertNeverCalled, assertEquals(50))
      )),

    testCase("increases turn owner when leftTurnTime falls down to zero",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["limits", "leftTurnTime"]), 100),
        R.set(RExt.nestedPath(["turn", "owner"]), 0),
        R.curry(cwtGame.elapseTime)(100),
        R.map(R.view(RExt.nestedPath(["turn", "owner"]))),
        eitherFold(assertNeverCalled, assertEquals(1))
      )),

    testCase("deactivates all players when game timit falls dawn to zero",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["limits", "leftGameTime"]), 100),
        R.curry(cwtGame.elapseTime)(100),
        R.map(R.view(RExt.nestedPath(["players"]))),
        R.map(R.reduce((a, b) => b.team > -1 ? a + 1 : a, 0)),
        eitherFold(assertNeverCalled, assertEquals(0))
      ))
  ]));

  testSuite("yield game", () => ([

    testCase("decilines when a player is already disabled",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["players", 0, "team"]), -1),
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
        R.map(R.view(RExt.nestedPath(["players", 0, "team"]))),
        eitherFold(assertNeverCalled, assertEquals(-1))
      ))
  ]));

  testSuite("produce unit", () => ([

    testCase("declined when factory does not belongs to the turn owner",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["properties", 0, "owner"]), 1),
        R.set(RExt.nestedPath(["players", 0, "gold"]), 99999),
        R.curry(cwtGame.produceUnit)(0, "UNTA"),
        eitherFold(assertStartsWith("iae:nto"), assertNeverCalled))),

    testCase("declined when factory id is invalid (roob)",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["players", 0, "gold"]), 99999),
        R.curry(cwtGame.produceUnit)(-1, "UNTA"),
        eitherFold(assertStartsWith("iae:ipi"), assertNeverCalled))),

    testCase("declined when factory id is invalid (loob)",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["players", 0, "gold"]), 99999),
        R.curry(cwtGame.produceUnit)(-1, "UNTA"),
        eitherFold(assertStartsWith("iae:ipi"), assertNeverCalled))),

    testCase("declined when unit type is invalid",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["players", 0, "gold"]), 99999),
        R.curry(cwtGame.produceUnit)(0, "UNKN"),
        eitherFold(assertStartsWith("iae:utn"), assertNeverCalled))),

    testCase("declined when player has too much units",
      R.pipe(
        getTestModel,
        R.over(
          RExt.nestedPath(["units"]),
          R.map(R.evolve({ owner: R.always(0) }))),
        R.set(RExt.nestedPath(["players", 0, "gold"]), 99999),
        R.curry(cwtGame.produceUnit)(0, "UNTA"),
        eitherFold(assertStartsWith("iae:nfs"), assertNeverCalled))),

    testCase("declined when player has not enough gold",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["players", 0, "gold"]), 0),
        R.set(RExt.nestedPath(["unitTypes", "UNTA", "costs"]), 1),
        R.curry(cwtGame.produceUnit)(0, "UNTA"),
        eitherFold(assertStartsWith("iae:isf"), assertNeverCalled))),

    testCase("declined when factory is occuppied by an unit",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["players", 0, "gold"]), 99999),
        R.set(RExt.nestedPath(["units", 0, "x"]), 1),
        R.set(RExt.nestedPath(["units", 0, "y"]), 1),
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["properties", 0, "x"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "y"]), 1),
        R.curry(cwtGame.produceUnit)(0, "UNTA"),
        eitherFold(assertStartsWith("iae:tio"), assertNeverCalled))),

    testCase("declined when factory cannot build the given unit type",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["players", 0, "gold"]), 1),
        R.set(RExt.nestedPath(["unitTypes", "UNTA", "costs"]), 1),
        R.over(RExt.nestedPath(["propertyTypes", "PRTA", "builds"]), R.without(["UNTA"])),
        R.curry(cwtGame.produceUnit)(0, "UNTA"),
        eitherFold(assertStartsWith("iae:cbt"), assertNeverCalled))),

    testCase("subtracts the unit costs from the factory owners gold",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["players", 0, "gold"]), 1),
        R.set(RExt.nestedPath(["unitTypes", "UNTA", "costs"]), 1),
        R.curry(cwtGame.produceUnit)(0, "UNTA"),
        eitherFold(
          assertNeverCalled,
          R.pipe(R.view(RExt.nestedPath(["players", 0, "gold"])), assertEquals(0))))),

    testCase("creates a new unit on the factory",
      R.pipe(
        getTestModel,
        R.over(
          RExt.nestedPath(["units"]),
          R.map(R.evolve({ owner: R.always(-1) }))),
        R.set(RExt.nestedPath(["players", 0, "gold"]), 99999),
        R.set(RExt.nestedPath(["unitTypes", "UNTA", "costs"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "x"]), 0),
        R.set(RExt.nestedPath(["properties", 0, "y"]), 0),
        R.curry(cwtGame.produceUnit)(0, "UNTA"),
        eitherFold(assertNeverCalled, R.pipe(
          R.view(RExt.nestedPath(["units", 0])),
          unit => "{" + unit.x + "," + unit.y + "}",
          assertEquals("{0,0}"))))),

    testCase("created new unit cannot act in the active turn",
      R.pipe(
        getTestModel,
        R.over(
          RExt.nestedPath(["units"]),
          R.map(R.evolve({ owner: R.always(-1) }))),
        R.set(RExt.nestedPath(["players", 0, "gold"]), 99999),
        R.set(RExt.nestedPath(["unitTypes", "UNTA", "costs"]), 1),
        R.curry(cwtGame.produceUnit)(0, "UNTA"),
        eitherFold(assertNeverCalled, R.pipe(
          R.view(RExt.nestedPath(["actables", 0])),
          assertEquals(false))))),
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
        R.map(R.view(RExt.nestedPath(["units", 0, "owner"]))),
        eitherFold(assertNeverCalled, assertEquals(-1)))),

    testCase("player does looses game when he/she has at least one units left an noUnitsLeftMeansLoose is enabled",
      R.pipe(
        getTestModel,
        R.over(
          RExt.nestedPath(["units"]),
          R.map(R.evolve({ owner: R.always(-1) }))),
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 0),
        R.set(RExt.nestedPath(["cfg", "noUnitsLeftMeansLoose"]), true),
        R.curry(cwtGame.destroyUnit)(0),
        R.map(R.view(RExt.nestedPath(["players", 0, "team"]))),
        eitherFold(assertNeverCalled, assertEquals(1)))),

    testCase("player looses game when he/she has no units left an noUnitsLeftMeansLoose is enabled",
      R.pipe(
        getTestModel,
        R.over(
          RExt.nestedPath(["units"]),
          R.map(R.evolve({ owner: R.always(-1) }))),
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["cfg", "noUnitsLeftMeansLoose"]), true),
        R.curry(cwtGame.destroyUnit)(0),
        R.map(R.view(RExt.nestedPath(["players", 0, "team"]))),
        eitherFold(assertNeverCalled, assertEquals(-1)))),

    testCase("updates fog", assertNeverCalled)
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

    testCase("declined when defender id is invalid (roob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.attackUnit)(0, 50),
        eitherFold(assertStartsWith("iae:iui:def"), assertNeverCalled))),

    testCase("declined when defender id is invalid (loob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.attackUnit)(0, -1),
        eitherFold(assertStartsWith("iae:iui:def"), assertNeverCalled))),

    testCase("declined when attacker cannot act",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["actables", 0]), false),
        R.curry(cwtGame.attackUnit)(0, 0),
        eitherFold(assertStartsWith("iae:uca"), assertNeverCalled))),

    testCase("attack lowers defenders health",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 0, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["units", 1, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.curry(cwtGame.attackUnit)(0, 1),
        R.map(R.view(RExt.nestedPath(["units", 1, "hp"]))),
        eitherFold(assertNeverCalled, assertNotEquals(99)))),

    testCase("defender lowers attackers health when he/she survives and is direct and standing on a neighbour tile",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 0, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["units", 1, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.curry(cwtGame.attackUnit)(0, 1),
        R.map(R.view(RExt.nestedPath(["units", 0, "hp"]))),
        eitherFold(assertNeverCalled, assertNotEquals(99)))),

    testCase("defender does not lowers attackers health when he/she dies",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 0, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["units", 1, "hp"]), 1),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.curry(cwtGame.attackUnit)(0, 1),
        R.map(R.view(RExt.nestedPath(["units", 0, "hp"]))),
        eitherFold(assertNeverCalled, assertEquals(99)))),

    testCase("defender does not lowers attackers health when he/she does not standing on a neighbour tile",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 0, "type"]), "UNTI"),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["units", 1, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 1, "x"]), 3),
        R.set(RExt.nestedPath(["units", 1, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.curry(cwtGame.attackUnit)(0, 1),
        R.map(R.view(RExt.nestedPath(["units", 0, "hp"]))),
        eitherFold(assertNeverCalled, assertEquals(99)))),

    testCase("defender does not lowers attackers health when he/she is indirect",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 0, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["units", 1, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTI"),
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.curry(cwtGame.attackUnit)(0, 1),
        R.map(R.view(RExt.nestedPath(["units", 0, "hp"]))),
        eitherFold(assertNeverCalled, assertEquals(99)))),

    testCase("attackers damage is relative to it's hp",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 0, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["units", 1, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTI"),
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.curry(cwtGame.attackUnit)(0, 1),
        R.map(R.view(RExt.nestedPath(["units", 0, "hp"]))),
        eitherFold(assertNeverCalled, assertEquals(84)))),

    testCase("defenders couter attack damage is relative to it's hp",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 49),
        R.set(RExt.nestedPath(["units", 0, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["units", 1, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "mainWeaponDamage", "UNTD"]), 50),
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.curry(cwtGame.attackUnit)(0, 1),
        R.map(R.view(RExt.nestedPath(["units", 0, "hp"]))),
        eitherFold(assertNeverCalled, assertEquals(74)))),

    testCase("attackers damage is relative to defenders tile defence",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 49),
        R.set(RExt.nestedPath(["units", 0, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["units", 1, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "mainWeaponDamage", "UNTD"]), 50),
        R.set(RExt.nestedPath(["tileTypes", "TITA", "defence"]), 5),
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.curry(cwtGame.attackUnit)(0, 1),
        R.map(R.view(RExt.nestedPath(["units", 1, "hp"]))),
        eitherFold(assertNeverCalled, assertEquals(74)))),

    testCase("attackers damage is relative to defenders property defence when tile is occuppied by a property",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 49),
        R.set(RExt.nestedPath(["units", 0, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["units", 1, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["properties", 0, "x"]), 1),
        R.set(RExt.nestedPath(["properties", 0, "y"]), 0),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "mainWeaponDamage", "UNTD"]), 50),
        R.set(RExt.nestedPath(["tileTypes", "TITA", "defence"]), 5),
        R.set(RExt.nestedPath(["propertyTypes", "PRTA", "defence"]), 2),
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.curry(cwtGame.attackUnit)(0, 1),
        R.map(R.view(RExt.nestedPath(["units", 1, "hp"]))),
        eitherFold(assertNeverCalled, assertEquals(89)))),

    testCase("defenders couter attack damage is relative to attackers tile defence",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 49),
        R.set(RExt.nestedPath(["units", 0, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["units", 1, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 0),
        R.set(RExt.nestedPath(["map", "tiles", 0, 0]), "TITB"),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "mainWeaponDamage", "UNTD"]), 50),
        R.set(RExt.nestedPath(["tileTypes", "TITB", "defence"]), 5),
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.curry(cwtGame.attackUnit)(0, 1),
        R.map(R.view(RExt.nestedPath(["units", 0, "hp"]))),
        eitherFold(assertNeverCalled, assertEquals(74)))),

    testCase("defenders couter attack damage is relative to attackers property defence when tile is occuppied by a property",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 49),
        R.set(RExt.nestedPath(["units", 0, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["units", 1, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["properties", 0, "x"]), 0),
        R.set(RExt.nestedPath(["properties", 0, "y"]), 0),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "mainWeaponDamage", "UNTD"]), 50),
        R.set(RExt.nestedPath(["tileTypes", "TITA", "defence"]), 0),
        R.set(RExt.nestedPath(["propertyTypes", "PRTA", "defence"]), 2),
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.curry(cwtGame.attackUnit)(0, 1),
        R.map(R.view(RExt.nestedPath(["units", 1, "hp"]))),
        eitherFold(assertNeverCalled, assertEquals(79)))),

    testCase("attacker uses main weapon if given and ammo is greater zero",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 49),
        R.set(RExt.nestedPath(["units", 0, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 0, "ammo"]), 1),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["units", 1, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "mainWeaponDamage", "UNTD"]), 50),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "secondaryWeaponDamage", "UNTD"]), 10),
        R.curry(cwtGame.attackUnit)(0, 1),
        R.map(R.view(RExt.nestedPath(["units", 1, "health"]))),
        eitherFold(assertNeverCalled, assertEquals(49)))),

    testCase("attacker uses secondary weapon if exists and ammo is zero",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 49),
        R.set(RExt.nestedPath(["units", 0, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 0, "ammo"]), 0),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["units", 1, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "mainWeaponDamage", "UNTD"]), 50),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "secondaryWeaponDamage", "UNTD"]), 10),
        R.curry(cwtGame.attackUnit)(0, 1),
        R.map(R.view(RExt.nestedPath(["units", 1, "health"]))),
        eitherFold(assertNeverCalled, assertEquals(89)))),

    testCase("primary weapon attacks does uses ammo",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 49),
        R.set(RExt.nestedPath(["units", 0, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 0, "ammo"]), 1),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["units", 1, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.curry(cwtGame.attackUnit)(0, 1),
        R.map(R.view(RExt.nestedPath(["units", 0, "ammo"]))),
        eitherFold(assertNeverCalled, assertEquals(0)))),

    testCase("secondary weapon attacks does not uses ammo",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 49),
        R.set(RExt.nestedPath(["units", 0, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 0, "ammo"]), 1),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["units", 1, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.dissocPath(RExt.nestedPath(["unitTypes", "UNTD", "mainWeaponDamage", "UNTD"])),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "secondaryWeaponDamage", "UNTD"]), 10),
        R.curry(cwtGame.attackUnit)(0, 1),
        R.map(R.view(RExt.nestedPath(["units", 0, "ammo"]))),
        eitherFold(assertNeverCalled, assertEquals(1)))),

    testCase("attackers owner power value increases by damage dealt",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 49),
        R.set(RExt.nestedPath(["units", 0, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 0, "ammo"]), 1),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["units", 1, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "costs"]), 2000),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "mainWeaponDamage", "UNTD"]), 50),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "secondaryWeaponDamage", "UNTD"]), 10),
        R.set(RExt.nestedPath(["players", 0, "power"]), 0),
        R.curry(cwtGame.attackUnit)(0, 1),
        R.map(R.view(RExt.nestedPath(["players", 0, "power"]))),
        eitherFold(assertNeverCalled, assertThat(R.gte(R.__, 500))))),

    testCase("attackers owner power value increases by damage received from counter",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 49),
        R.set(RExt.nestedPath(["units", 0, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 0, "ammo"]), 1),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["units", 1, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "costs"]), 2000),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "mainWeaponDamage", "UNTD"]), 50),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "secondaryWeaponDamage", "UNTD"]), 10),
        R.set(RExt.nestedPath(["players", 0, "power"]), 0),
        R.curry(cwtGame.attackUnit)(0, 1),
        R.map(R.view(RExt.nestedPath(["players", 0, "power"]))),
        eitherFold(assertNeverCalled, assertThat(R.gte(R.__, 1000))))),

    testCase("defenders owner power value increases by damage received ",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 49),
        R.set(RExt.nestedPath(["units", 0, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 0, "ammo"]), 1),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["units", 1, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "costs"]), 2000),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "mainWeaponDamage", "UNTD"]), 50),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "secondaryWeaponDamage", "UNTD"]), 10),
        R.set(RExt.nestedPath(["players", 0, "power"]), 0),
        R.curry(cwtGame.attackUnit)(0, 1),
        R.map(R.view(RExt.nestedPath(["players", 0, "power"]))),
        eitherFold(assertNeverCalled, assertThat(R.gte(R.__, 1000))))),

    testCase("defenders owner power value increases by damage dealt from counter",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["units", 0, "hp"]), 49),
        R.set(RExt.nestedPath(["units", 0, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 0),
        R.set(RExt.nestedPath(["units", 0, "ammo"]), 1),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["units", 1, "hp"]), 99),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 0),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTD"),
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "costs"]), 2000),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "mainWeaponDamage", "UNTD"]), 50),
        R.set(RExt.nestedPath(["unitTypes", "UNTD", "secondaryWeaponDamage", "UNTD"]), 10),
        R.set(RExt.nestedPath(["players", 0, "power"]), 0),
        R.curry(cwtGame.attackUnit)(0, 1),
        R.map(R.view(RExt.nestedPath(["players", 0, "power"]))),
        eitherFold(assertNeverCalled, assertThat(R.gte(R.__, 1500))))),

    testCase("updates fog when counter attack kills attacker and fog is enabled", assertNeverCalled),
    testCase("does not updates fog when counter attack kills attacker and fog is disabled", assertNeverCalled)
  ]));

  testSuite("activate power", () => ([

    testCase("declined when the player is is invalid (loob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.activatePower)(-1),
        eitherFold(assertStartsWith("iae:ipl"), assertNeverCalled))),

    testCase("declined when the player is is invalid (roob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.activatePower)(4),
        eitherFold(assertStartsWith("iae:ipl"), assertNeverCalled))),

    testCase("declined when the player is is invalid (deactivated)",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["players", 0, "team"]), -1),
        R.curry(cwtGame.activatePower)(0),
        eitherFold(assertStartsWith("iae:ipl"), assertNeverCalled))),

    testCase("declined when the player has already an activated power",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["players", 0, "activePowerLevel"]), 2),
        R.curry(cwtGame.activatePower)(0),
        eitherFold(assertStartsWith("ise:paa"), assertNeverCalled))),

    testCase("declined when the player has not enough power to activate", assertNeverCalled),

    testCase("set the power level of the player to POWER",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["players", 0, "activePowerLevel"]), 1),
        R.curry(cwtGame.activatePower)(0),
        R.map(R.view(RExt.nestedPath(["players", 0, "activePowerLevel"]))),
        eitherFold(assertNeverCalled, assertEquals(2)))),

    testCase("sets the power value of the player to zero",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["players", 0, "activePowerLevel"]), 1),
        R.set(RExt.nestedPath(["players", 0, "power"]), 1000),
        R.curry(cwtGame.activatePower)(0),
        R.map(R.view(RExt.nestedPath(["players", 0, "power"]))),
        eitherFold(assertNeverCalled, assertEquals(0))))
  ]));

  testSuite("activate super power", () => ([

    testCase("declined when the player is is invalid (loob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.activateSuperPower)(-1),
        eitherFold(assertStartsWith("iae:ipl"), assertNeverCalled))),

    testCase("declined when the player is is invalid (roob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.activateSuperPower)(4),
        eitherFold(assertStartsWith("iae:ipl"), assertNeverCalled))),

    testCase("declined when the player is is invalid (deactivated)",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["players", 0, "team"]), -1),
        R.curry(cwtGame.activateSuperPower)(0),
        eitherFold(assertStartsWith("iae:ipl"), assertNeverCalled))),

    testCase("declined when the player has already an activated power",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["players", 0, "activePowerLevel"]), 2),
        R.curry(cwtGame.activateSuperPower)(0),
        eitherFold(assertStartsWith("ise:paa"), assertNeverCalled))),

    testCase("declined when the player has not enough power to activate", assertNeverCalled),

    testCase("set the power level of the player to POWER",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["players", 0, "activePowerLevel"]), 1),
        R.curry(cwtGame.activateSuperPower)(0),
        R.map(R.view(RExt.nestedPath(["players", 0, "activePowerLevel"]))),
        eitherFold(assertNeverCalled, assertEquals(3)))),

    testCase("sets the power value of the player to zero",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["players", 0, "activePowerLevel"]), 1),
        R.set(RExt.nestedPath(["players", 0, "power"]), 1000),
        R.curry(cwtGame.activateSuperPower)(0),
        R.map(R.view(RExt.nestedPath(["players", 0, "power"]))),
        eitherFold(assertNeverCalled, assertEquals(0))))
  ]));

  testSuite("resupply neightbours", () => ([

    testCase("declines when supplier id is invalid (loob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.unloadUnit)(-1),
        eitherFold(assertStartsWith("iae:iui"), assertNeverCalled))),

    testCase("declines when supplier id is invalid (roob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.unloadUnit)(50),
        eitherFold(assertStartsWith("iae:iui"), assertNeverCalled))),

    testCase("declines when supplier cannot act",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["actables", 0]), false),
        R.curry(cwtGame.unloadUnit)(0),
        eitherFold(assertStartsWith("iae:uca"), assertNeverCalled))),

    testCase("declines when no target is surrouding the supplier",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "x"]), 5),
        R.set(RExt.nestedPath(["units", 0, "y"]), 5),
        R.curry(cwtGame.unloadUnit)(0),
        eitherFold(assertStartsWith("iae:nis"), assertNeverCalled))),

    testCase("refills fuel in all own units in range",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "x"]), 5),
        R.set(RExt.nestedPath(["units", 0, "y"]), 5),
        R.set(RExt.nestedPath(["units", 1, "x"]), 6),
        R.set(RExt.nestedPath(["units", 1, "y"]), 5),
        R.set(RExt.nestedPath(["units", 1, "fuel"]), 0),
        R.set(RExt.nestedPath(["units", 2, "x"]), 4),
        R.set(RExt.nestedPath(["units", 2, "y"]), 5),
        R.set(RExt.nestedPath(["units", 2, "fuel"]), 20),
        R.set(RExt.nestedPath(["unitTypes", "UNTA", "maxFuel"]), 35),
        R.curry(cwtGame.unloadUnit)(0),
        R.map(model => {
          return [
            R.view(RExt.nestedPath(["units", 1, "fuel"]))(model),
            R.view(RExt.nestedPath(["units", 2, "fuel"]))(model)
          ];
        }),
        eitherFold(assertNeverCalled, assertEquals([35, 35])))),

    testCase("refills ammo in all own units in range",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "x"]), 5),
        R.set(RExt.nestedPath(["units", 0, "y"]), 5),
        R.set(RExt.nestedPath(["units", 1, "x"]), 6),
        R.set(RExt.nestedPath(["units", 1, "y"]), 5),
        R.set(RExt.nestedPath(["units", 1, "ammo"]), 1),
        R.set(RExt.nestedPath(["units", 2, "x"]), 4),
        R.set(RExt.nestedPath(["units", 2, "y"]), 5),
        R.set(RExt.nestedPath(["units", 2, "ammo"]), 0),
        R.set(RExt.nestedPath(["unitTypes", "UNTA", "maxAmmo"]), 5),
        R.curry(cwtGame.unloadUnit)(0),
        R.map(model => {
          return [
            R.view(RExt.nestedPath(["units", 1, "ammo"]))(model),
            R.view(RExt.nestedPath(["units", 2, "ammo"]))(model)
          ];
        }),
        eitherFold(assertNeverCalled, assertEquals([5, 5])))),

    testCase("ignores allied units",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "x"]), 5),
        R.set(RExt.nestedPath(["units", 0, "y"]), 5),
        R.set(RExt.nestedPath(["units", 1, "x"]), 6),
        R.set(RExt.nestedPath(["units", 1, "y"]), 5),
        R.set(RExt.nestedPath(["units", 1, "ammo"]), 1),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["players", 0, "team"]), 1),
        R.set(RExt.nestedPath(["players", 1, "team"]), 1),
        R.set(RExt.nestedPath(["unitTypes", "UNTA", "maxAmmo"]), 5),
        R.curry(cwtGame.unloadUnit)(0),
        R.map(R.view(RExt.nestedPath(["units", 1, "ammo"]))),
        eitherFold(assertNeverCalled, assertEquals(1)))),

    testCase("ignores enemy units",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "x"]), 5),
        R.set(RExt.nestedPath(["units", 0, "y"]), 5),
        R.set(RExt.nestedPath(["units", 1, "x"]), 6),
        R.set(RExt.nestedPath(["units", 1, "y"]), 5),
        R.set(RExt.nestedPath(["units", 1, "ammo"]), 1),
        R.set(RExt.nestedPath(["units", 1, "owner"]), 1),
        R.set(RExt.nestedPath(["players", 0, "team"]), 1),
        R.set(RExt.nestedPath(["players", 1, "team"]), 2),
        R.set(RExt.nestedPath(["unitTypes", "UNTA", "maxAmmo"]), 5),
        R.curry(cwtGame.unloadUnit)(0),
        R.map(R.view(RExt.nestedPath(["units", 1, "ammo"]))),
        eitherFold(assertNeverCalled, assertEquals(1))))
  ]));

  testSuite("unload unit", () => ([

    testCase("declines when load id is invalid (loob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.unloadUnit)(-1, 0, 0),
        eitherFold(assertStartsWith("iae:iui:lod"), assertNeverCalled))),

    testCase("declines when load id is invalid (roob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.unloadUnit)(50, 0, 0),
        eitherFold(assertStartsWith("iae:iui:lod"), assertNeverCalled))),

    testCase("declines when transporter id is invalid (loob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.unloadUnit)(0, -1, 0),
        eitherFold(assertStartsWith("iae:iui:trp"), assertNeverCalled))),

    testCase("declines when transporter id is invalid (roob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.unloadUnit)(0, 50, 0),
        eitherFold(assertStartsWith("iae:iui:trp"), assertNeverCalled))),

    testCase("declines when direction is invalid (loob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.unloadUnit)(0, 1, 4),
        eitherFold(assertStartsWith("iae:idv"), assertNeverCalled))),

    testCase("declines when direction is invalid (roob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.unloadUnit)(0, 1, -1),
        eitherFold(assertStartsWith("iae:idv"), assertNeverCalled))),

    testCase("declines when load is not loaded by transporter",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "loadedIn"]), 2),
        R.set(RExt.nestedPath(["units", 1, "loadedIn"]), -2),
        R.curry(cwtGame.unloadUnit)(0, 1, 1),
        eitherFold(assertStartsWith("iae:nal"), assertNeverCalled))),

    testCase("does nothing when the tile in target direction is not empty",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "loadedIn"]), 1),
        R.set(RExt.nestedPath(["units", 1, "loadedIn"]), -2),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 1),
        R.curry(cwtGame.unloadUnit)(0, 1, 1),
        R.map(R.view(RExt.nestedPath(["units", 0, "loadedIn"]))),
        eitherFold(assertNeverCalled, assertEquals(1)))),

    testCase("removes loaded in when target direction is empty",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "loadedIn"]), 1),
        R.set(RExt.nestedPath(["units", 1, "loadedIn"]), -2),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 1),
        R.curry(cwtGame.unloadUnit)(0, 1, 1),
        eitherFold(assertNeverCalled, assertEquals(-1)))),

    testCase("sets position when target direction is empty",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "loadedIn"]), 1),
        R.set(RExt.nestedPath(["units", 1, "loadedIn"]), -2),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 1),
        R.curry(cwtGame.unloadUnit)(0, 1, 1),
        R.map(R.view(RExt.nestedPath(["units", 0]))),
        R.map(unit => "{" + unit.x + "," + unit.y + "}"),
        eitherFold(assertNeverCalled, assertEquals("{2,1}")))),

    testCase("sets load into wait mode when target direction is empty",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "loadedIn"]), 1),
        R.set(RExt.nestedPath(["units", 1, "loadedIn"]), -2),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 1),
        R.curry(cwtGame.unloadUnit)(0, 1, 1),
        R.map(R.view(RExt.nestedPath(["actables", 0]))),
        eitherFold(assertNeverCalled, assertEquals(false)))),

    testCase("sets transporter into wait mode when target direction is empty",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "loadedIn"]), 1),
        R.set(RExt.nestedPath(["units", 1, "loadedIn"]), -2),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 1),
        R.map(R.view(RExt.nestedPath(["actables", 1]))),
        eitherFold(assertNeverCalled, assertEquals(false)))),

    testCase("sets transporter into wait mode when target direction is not empty",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "loadedIn"]), 1),
        R.set(RExt.nestedPath(["units", 1, "loadedIn"]), -2),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 1),
        R.set(RExt.nestedPath(["units", 2, "x"]), 2),
        R.set(RExt.nestedPath(["units", 2, "y"]), 1),
        R.curry(cwtGame.unloadUnit)(0, 1, 1),
        R.map(R.view(RExt.nestedPath(["actables", 1]))),
        eitherFold(assertNeverCalled, assertEquals(false)))),

    testCase("declines when the transporter cannot act",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "loadedIn"]), 1),
        R.set(RExt.nestedPath(["units", 1, "loadedIn"]), -2),
        R.set(RExt.nestedPath(["actables", 1]), false),
        R.curry(cwtGame.unloadUnit)(0, 1, 0),
        eitherFold(assertStartsWith("iae:uca"), assertNeverCalled)))
  ]));

  testSuite("load unit", () => ([

    testCase("declines when load id is invalid (loob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.loadUnit)(-1, 0),
        eitherFold(assertStartsWith("iae:iui:lod"), assertNeverCalled))),

    testCase("declines when load id is invalid (roob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.loadUnit)(50, 0),
        eitherFold(assertStartsWith("iae:iui:lod"), assertNeverCalled))),

    testCase("declines when transporter id is invalid (loob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.loadUnit)(0, -1),
        eitherFold(assertStartsWith("iae:iui:trp"), assertNeverCalled))),

    testCase("declines when transporter id is invalid (roob)",
      R.pipe(
        getTestModel,
        R.curry(cwtGame.loadUnit)(0, 50),
        eitherFold(assertStartsWith("iae:iui:trp"), assertNeverCalled))),

    testCase("declines when load id is already loaded",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "loadedIn"]), 1),
        R.set(RExt.nestedPath(["units", 1, "loadedIn"]), -2),
        R.curry(cwtGame.loadUnit)(0, 1),
        eitherFold(assertStartsWith("iae:arl"), assertNeverCalled))),

    testCase("declines when transporter cannot load unit",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 1),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 1),
        R.set(RExt.nestedPath(["units", 1, "loadedIn"]), -1),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTA"),
        R.set(RExt.nestedPath(["units", "UNTA", "loadable"]), ["UNTB"]),
        R.set(RExt.nestedPath(["units", "UNTA", "maxLoadCount"]), 2),
        R.curry(cwtGame.loadUnit)(0, 1),
        R.view(RExt.nestedPath(["units", 0, "loadedIn"])),
        eitherFold(assertStartsWith("iae:clu"), assertNeverCalled))),

    testCase("declines when transporter has no room left",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 1, "loadedIn"]), -3),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTA"),
        R.set(RExt.nestedPath(["units", "UNTA", "loadable"]), ["UNTA"]),
        R.set(RExt.nestedPath(["units", "UNTA", "maxLoadCount"]), 2),
        R.curry(cwtGame.loadUnit)(0, 1),
        eitherFold(assertStartsWith("iae:mlr"), assertNeverCalled))),

    testCase("declines when the load cannot act",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["actables", 0]), false),
        R.set(RExt.nestedPath(["units", 1, "loadedIn"]), -1),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTA"),
        R.set(RExt.nestedPath(["units", "UNTA", "loadable"]), ["UNTA"]),
        R.set(RExt.nestedPath(["units", "UNTA", "maxLoadCount"]), 2),
        R.curry(cwtGame.loadUnit)(0, 1),
        eitherFold(assertStartsWith("iae:uca"), assertNeverCalled))),

    testCase("load looses its position",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 1),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 1),
        R.set(RExt.nestedPath(["units", 1, "loadedIn"]), -1),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTA"),
        R.set(RExt.nestedPath(["units", "UNTA", "loadable"]), ["UNTA"]),
        R.set(RExt.nestedPath(["units", "UNTA", "maxLoadCount"]), 2),
        R.curry(cwtGame.loadUnit)(0, 1),
        R.view(RExt.nestedPath(["units", 0])),
        R.map(unit => "{" + unit.x + "," + unit.y + "}"),
        eitherFold(assertNeverCalled, assertEquals("{-1,-1}")))),

    testCase("load is loaded in transporter",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 1),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 1),
        R.set(RExt.nestedPath(["units", 1, "loadedIn"]), -1),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTA"),
        R.set(RExt.nestedPath(["units", "UNTA", "loadable"]), ["UNTA"]),
        R.set(RExt.nestedPath(["units", "UNTA", "maxLoadCount"]), 2),
        R.curry(cwtGame.loadUnit)(0, 1),
        R.view(RExt.nestedPath(["units", 0, "loadedIn"])),
        eitherFold(assertNeverCalled, assertEquals(-1)))),

    testCase("transporters load count increases",
      R.pipe(
        getTestModel,
        R.set(RExt.nestedPath(["units", 0, "x"]), 0),
        R.set(RExt.nestedPath(["units", 0, "y"]), 1),
        R.set(RExt.nestedPath(["units", 1, "x"]), 1),
        R.set(RExt.nestedPath(["units", 1, "y"]), 1),
        R.set(RExt.nestedPath(["units", 1, "loadedIn"]), -1),
        R.set(RExt.nestedPath(["units", 1, "type"]), "UNTA"),
        R.set(RExt.nestedPath(["units", "UNTA", "loadable"]), ["UNTA"]),
        R.set(RExt.nestedPath(["units", "UNTA", "maxLoadCount"]), 2),
        R.curry(cwtGame.loadUnit)(0, 1),
        R.view(RExt.nestedPath(["units", 1, "loadedIn"])),
        eitherFold(assertNeverCalled, assertEquals(-2))))
  ]));

  testSuite("get actables objects", () => ([
    testCase("returns all actable units of the turn owner", 
      R.pipe(
        getTestModel,
        R.over(RExt.nestedPath(["actables"]), R.map(R.always(false))),
        R.set(RExt.nestedPath(["actables", 0]), true),
        R.set(RExt.nestedPath(["actables", 1]), true),
        cwtGame.getActableObjects,
        R.filter(R.where({ type: R.equals("unit") })),
        R.pipe(R.length, assertEquals(2)))),

    testCase("returns all actable properties of the turn owner", 
      R.pipe(
        getTestModel,
        R.over(RExt.nestedPath(["actables"]), R.map(R.always(false))),
        R.over(RExt.nestedPath(["properties"]), R.evolve({ owner: R.always(-1) })),
        R.set(RExt.nestedPath(["properties", 0, "owner"]), 0),
        R.set(RExt.nestedPath(["properties", 1, "owner"]), 0),
        cwtGame.getActableObjects,
        R.filter(R.where({ type: R.equals("property") })),
        R.pipe(R.length, assertEquals(2)))),

    testCase("contains the object-less map actions", 
      R.pipe(
        getTestModel,
        cwtGame.getActableObjects,
        R.filter(R.where({ type: R.equals("map") })),
        R.pipe(R.length, assertEquals(1)))),
  ]));

  testSuite("get position actions", () => ([
    testCase("shows wait when unit is selected", assertNeverCalled),
    testCase("shows fire rocket when unit is selected and position contains a silo", assertNeverCalled),
    testCase("shows capture when unit is selected, can capture and position contains an enemy property", assertNeverCalled),
    testCase("shows capture when unit is selected, can capture and position contains an neutral property", assertNeverCalled),
    testCase("shows no capture when unit is selected, can capture and position contains an allied property", assertNeverCalled),
    testCase("shows produce unit when nothing is selcted and position contains an own factory", assertNeverCalled),
    testCase("shows destroy unit when unit is selcted and position contains nothing special", assertNeverCalled),
    testCase("shows attack unit when unit is selcted, it moved, is direct and target in sight", assertNeverCalled),
    testCase("shows attack unit when unit is selcted, it does not moved, is indirect and target in sight", assertNeverCalled),
    testCase("shows no attack unit when unit is selcted, it moved, is indirect and target in sight", assertNeverCalled),
    testCase("shows activate power when nothing is selcted and player has enough power", assertNeverCalled),
    testCase("shows activate super power when nothing is selcted and player has enough power", assertNeverCalled),
    testCase("shows resupply neightbours when unit is selected, unit can resupply and targets are nearby", assertNeverCalled),
    testCase("shows no resupply neightbours when unit is selected, unit can resupply and no targets are nearby", assertNeverCalled),
    testCase("shows unload unit when unit is selected, has loads and target has empty or hidden fields nearby", assertNeverCalled),
    testCase("shows no unload unit when unit is selected, has loads and target has no empty or hidden field nearby", assertNeverCalled),
    testCase("shows load unit when unit is selected, own transporter is at the target and transporter can load unit", assertNeverCalled),
    testCase("shows yield game when nothing is selected", assertNeverCalled),
    testCase("shows nextTurn when nothing is selected", assertNeverCalled)]));

  testSuite("get unit move map", () => ([
    testCase("recognizes move range", assertNeverCalled),
    testCase("recognizes left fuel", assertNeverCalled),
    testCase("recognizes movable fields that are visible and occuppied by enemy units as non-movable", assertNeverCalled),
    testCase("recognizes movable fields that are visible and occuppied by allied units as movable", assertNeverCalled),
    testCase("recognizes movable fields that are visible and occuppied by own units as movable", assertNeverCalled),
    testCase("recognizes movable fields that are not visible and occuppied allied units as movable", assertNeverCalled),
    testCase("recognizes movable fields that are not visible and occuppied enemy units as movable", assertNeverCalled),
    testCase("returned data contains move map", assertNeverCalled),
    testCase("returned data contains move range", assertNeverCalled),
    testCase("returned move range is minimum type.moveRange, unit.fuel", assertNeverCalled)
  ]));

  testSuite("get unit attack map", () => ([
    testCase("recognizes move range of direct units", assertNeverCalled),
    testCase("recognizes left fuel of direct units", assertNeverCalled),
    testCase("ignores move range of indirect units", assertNeverCalled),
    testCase("returned data contains attack map", assertNeverCalled)
  ]));

  testSuite("moving", () => ([
    testCase("declines when move path is illegal", assertNeverCalled),
    testCase("declines when costs of move path exceeds move range", assertNeverCalled),
    testCase("declines when costs of move path exceeds fuel", assertNeverCalled),
    testCase("declines when move path is blocked by an enemy unit", assertNeverCalled),
    testCase("can move through own units", assertNeverCalled),
    testCase("own unit as move target is accepted because handled by action itself", assertNeverCalled),
    testCase("updates fog when moving from a to b", assertNeverCalled),
    testCase("falls down to wait action when move path is blocked", assertNeverCalled)
  ]));

})(window.cwtTest || (window.cwtTest = {}));