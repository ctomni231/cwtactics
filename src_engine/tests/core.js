var tests = [];

gameServices.asynchronTest = function (groupName, caseName, test) {
  tests.push({
    group: groupName,
    name: caseName,
    test: test
  });
};

gameServices.synchronTest = function (groupName, caseName, test) {
  tests.push({
    group: groupName,
    name: caseName,
    test: test
  });
};

gameServices.evaluateTests = function (whenDoneCb) {
  cwt.serialExecution(function (pushJob) {
    tests.forEach(function (el) {
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