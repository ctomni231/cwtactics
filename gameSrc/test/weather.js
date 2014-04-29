cwt.Gameflow.addState({
  id: "WEATHER",

  init: function () {
  },

  enter: function () {
    //cwt.Screen.layerUI.clear();
  },

  update: function (delta, lastInput) {
  },

  render: function () {
    var ctx = cwt.Screen.layerUI.getContext();
	ctx.fillStyle = "red";
    ctx.fillRect( 10,10,300,300 );
  }
});