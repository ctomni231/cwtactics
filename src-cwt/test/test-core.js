var before;
var after;

cwt.testGroup = function(name, desc = {}) {
  cwt.logInfo("Testing group " + name);
  before = () => {};
  after = () => {};
};

cwt.testBefore = function(fn) {
  before = fn;
};

cwt.testAfter = function(fn) {
  after = fn;
};

cwt.testCase = function(name, meta, test) {
  var data = {};

  data.assert = {

    sameContent(a, b) {
      if (a == null || b == null) {
        return false;
      }
      if (a.length !== b.length) {
        return false;
      }
      a.forEach((el, index) => {
        if (b[index] !== el) {
          return false;
        }
      });
    },

    contains(array, content) {
      var contains = false;
      array.filter(array, el => {
        if (data.assert.sameContent(el, content)) {
          contains = true;
        }
      })
    },

    equals(a, b) {
      if (a !== b) throw new Error("AssertionFailed");
    }
  };

  before(data);
  test(data);
  after(data);
};

cwt.mockedEvents = function() {
  var called = [];
  return {

    publish() {
      called.push([].slice(arguments, 0));
    },

    publishCalledAtLeastOnceWith() {
      var args = [].slice(arguments, 0);
      if (called.find(data => cwt.testArrayEq(data, args)) === undefined) {

      }
    }
  }
};