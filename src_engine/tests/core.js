cwt.test.tests = [];

cwt.test.asynchronTest = function (groupName, caseName, test) {
  cwt.test.tests.push({
    group: groupName,
    name: caseName,
    test: test
  });
};

cwt.test.synchronTest = function (groupName, caseName, test) {
  cwt.test.tests.push({
    group: groupName,
    name: caseName,
    test: test
  });
};

cwt.test.evaluateTests = function (whenDoneCb) {
  cwt.serialExecution(function (pushJob) {
    cwt.test.tests.forEach(function (el) {
      pushJob(function (next) {
        console.log("executing test [" + el.group + "|" + el.name + "]");
        try {
          el.test();
          console.info("PASSED");
        } catch (e) {
          console.warn("FAILED");
        }
        next();
      });
    });

    pushJob(function () {
      whenDoneCb();
    })
  });
};

/*
var gameDict = {};

requireNonNull(gameDict.wuff);
gameDict.wuff = function (x) {
  console.log("X: " + x);
};
*/