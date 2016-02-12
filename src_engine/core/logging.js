cwt.Logger = {

  info: function () {},

  warn: function () {},

  error: function () {}
};

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

cwt.NullLogger = cwt.Logger;
