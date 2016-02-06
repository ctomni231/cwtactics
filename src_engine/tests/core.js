var EXPANDER_CHAR = " ";
var TEST_IDENTIFIER_LENGTH = 100;

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

var expandStringToSize = function (str, size) {
  var neededSpaces, i;

  neededSpaces = size - str.length;
  if (neededSpaces <= 0) {
    return str;
  }

  for (i = 0; i < neededSpaces; i++) {
    str += EXPANDER_CHAR;
  }

  return str;
};

gameServices.evaluateTests = function (whenDoneCb) {
  var numOfSucceedTests, numOfFailedTests, testIdentifier;

  console.log("start tests");

  numOfFailedTests = 0;
  numOfSucceedTests = 0;

  cwt.serialExecution(function (pushJob) {
    tests.forEach(function (el) {
      pushJob(function (next) {

        testIdentifier = expandStringToSize(el.group + ":" + el.name, TEST_IDENTIFIER_LENGTH);
        try {
          el.test();
          console.info(testIdentifier + "[PASSED]");
          numOfSucceedTests++;
        } catch (e) {
          console.warn(testIdentifier + "[FAILED]");
          console.error(e);
          numOfFailedTests++;
        }

        next();
      });
    });

    pushJob(function () {
      console.log("finished tests");
      console.log("     AMOUNT: " + (numOfFailedTests + numOfSucceedTests));
      console.log("     PASSED: " + numOfSucceedTests);
      console.log("     FAILED: " + numOfFailedTests);
      whenDoneCb();
    })
  });
};
