// marks a group of tests
const testGroup = (name) => QUnit.module(name);

// calls the given test function with an assert object as first argument
const testCase = (name, test) => {
  QUnit.test(name, test);
};

// tests a given object against a given protocol
const testProtocol = (object, protocol) => Protocol.implements(object, protocol, testCase);
