/*global console, cwt*/

var EXPANDER_CHAR = " ";
var TEST_IDENTIFIER_LENGTH = 100;

var tests = [];

/**
 * Adds an asynchron test to the test map. This test can do asynchron tasks and needs
 * to call the whenDone function when all tasks are completed.
 *
 * @param {string}             groupName group of the test
 * @param {string}             caseName  name of the test
 * @param {function(whenDone)} test      test function
 */
cwt.asynchronTest = function(groupName, caseName, test) {
  tests.push({
    group: groupName,
    name: caseName,
    test: test
  });
};

/**
 * Adds a synchron test to the test map. This test cannot do asynchron tasks,
 * else it wont be recognized correctly by the test manager.
 *
 * @param {string}   groupName group of the test
 * @param {string}   caseName  name of the test
 * @param {function} test      test function
 */
cwt.test_synchron = function(groupName, caseName, test) {
  tests.push({
    group: groupName,
    name: caseName,
    test: test
  });
};

var expandStringToSize = function(str, size) {
  var neededSpaces, i;

  neededSpaces = size - str.length;
  if (neededSpaces <= 0) {
    return str;
  }

  for (i = 0; i < neededSpaces; i += 1) {
    str += EXPANDER_CHAR;
  }

  return str;
};

cwt.evaluateTests = function(whenDoneCb) {
  var numOfSucceedTests, numOfFailedTests, testIdentifier;

  console.log("start tests");

  numOfFailedTests = 0;
  numOfSucceedTests = 0;

  cwt.serialExecution(function(pushJob) {
    tests.forEach(function(el) {
      pushJob(function(next) {

        testIdentifier = expandStringToSize(el.group + ":" + el.name, TEST_IDENTIFIER_LENGTH);
        try {
          el.test();
          console.info(testIdentifier + "[PASSED]");
          numOfSucceedTests += 1;
        } catch (e) {
          console.warn(testIdentifier + "[FAILED]");
          console.error(e.stack || e);
          numOfFailedTests += 1;
        }

        next();
      });
    });

    pushJob(function() {
      console.log("finished tests");
      console.log("     AMOUNT: " + (numOfFailedTests + numOfSucceedTests));
      console.log("     PASSED: " + numOfSucceedTests);
      console.log("     FAILED: " + numOfFailedTests);
      whenDoneCb();
    });
  });
};