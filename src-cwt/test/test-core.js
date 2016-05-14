// marks a group of tests
cwt.testGroup = function(name) {
  QUnit.module(name);
};

// calls the given test function with an assert object as first argument
cwt.testCase = function(name, test) {
  QUnit.test(name, test);
};