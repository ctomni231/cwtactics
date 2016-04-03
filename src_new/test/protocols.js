class Protocol {

  constructor(specs) {
    if (!(this instanceof Protocol)) {
      return new Protocol(specs);
    }
    this.specs = specs;
    this._checkSpecs();
  }

  _checkSpecs() {
    Maps.forEachProperty(this.specs, (key, values) => {

      if (values.length < 2 || values.length % 2 !== 0) {
        throw new Error(
          "[" + key + "] IllegalSpecs, " +
          "need format [signature, description, testDescription, testCase] " +
          "while ', testDescription, testCase' is optional or can be repeated n times as pair"
        );
      }

      Require.isString(values[0]);
      Require.isString(values[1]);

      for (var i = 2; i < values.length; i += 2) {
        Require.isString(values[i]);
        Require.isFunction(values[i + 1]);
      }
    });
  }

  static implements(object, protocol, testCase) {
    Require.isSomething(object, "IllegalArguments: no valid object to test");
    Require.isTrue(protocol instanceof Protocol, "IllegalArguments: no valid protocol");

    Maps.forEachProperty(protocol.specs, (key, values) => {
      const signature = values[0];
      const description = values[1];

      Require.isFunction(object[key], "MissingProtocolAPI Name: " + signature + " Desc:" + description);

      const testSpec = (key, specName, specTest) => {
        testCase(key + " - " + specName, (assert) => specTest(assert, object));
      };

      if (values.length > 2) {
        for (var i = 2; i < values.length; i += 2) {
          testSpec(key, values[i], values[i + 1]);
        }
      }
    });
  }
}
