cwt.ConsoleLogger = {

  info: function (msg) {
    console.warn(msg);
  },

  warn: function (msg) {
    console.warn(msg);
  },

  error: function (error) {
    console.error(error);
  }
};

cwt.NullLogger = {

  info: function () {},

  warn: function () {},

  error: function () {}
};
