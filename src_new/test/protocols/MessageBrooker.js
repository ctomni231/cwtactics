const PMessageBrooker = Protocol({

  subscribe: [
    "topic: string, handler: fn()",
    "subscribes handler to be executed when a message will be pushed into the topic",

    "non null values must be accepted",
    (assert, obj) => {
      assert.expect(0);
      obj.subscribe("test", () => {});
    },

    "null as topic must be declined",
    (assert, obj) => {
      assert.throws(() => obj.subscribe(null, null));
    },

    "null as handler must be declined",
    (assert, obj) => {
      assert.throws(() => obj.subscribe("test", null));
    }
  ],

  sendMessage: [
    "topic: string, data: object",
    "pushes a message into the topic and invokes all subscribed handlers",

    "handler will be invoked when a message will be pushed in the subscribed channel",
    (assert, obj) => {
      var counter = 0;
      obj.subscribe("test", () => counter++);
      obj.sendMessage("test");
      assert.ok(counter === 1, "counter should be increased after sendMessage");
    },

    "brooker must provide given send data as first argument for the handler",
    (assert, obj) => {
      obj.subscribe("test", (arg) => assert.equal(arg, 1));
      obj.sendMessage("test", 1);
    }
  ]
});
