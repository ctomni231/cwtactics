//
<<<<<<< Updated upstream
//weather.js

//A simple class that does the snow particle demo in JS

//@author = Carr, Crecen
//@version = 04.30.14

=======
// weather.js
//
// A simple class that does the snow particle demo in JS
//
// @author = Carr, Crecen
// @version = 04.30.14
//
>>>>>>> Stashed changes
//First attempt at creating the snow weather for JavaScript
//It turned out to be a chore to draw circles, but I think
//I figured it out...
cwt.Gameflow.addState({
  id: "WEATHER",
  last: "MAIN_MENU",

  init: function () {
    //Since the time is so low I probably don't need to track it.
    //But it seems memory intensive to pull off, there has to be
    //a less expensive way

    //Keeps track of the time
    this.time = 0;
    //Keeps track of delta time
    this.store = 0;
    //Maximum frame wait per particle
    this.MAX = 32;
    //Keeps track of the cap
    this.cap = 50;
    //Keeps track of the frequency of a snowball
    this.FREQUENCY = 2;

    //The type of snowball to draw
    this.type = [];
    //The x-axis position of the snowball
    this.posx = [];
    //The y-axis position of the snowball
    this.posy = [];

    //Holds the graphics for a simple snowball (cache)
    //Totally hard coded all the values here
    this.ball = document.createElement('canvas');
    this.ball.width = 10;
    this.ball.height = 10;

    var ctx = this.ball.getContext('2d');
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(5, 5, 2, 0, Math.PI * 2);
    ctx.stroke();
  },

  enter: function () {
    //Clears the UI layer for demo
    cwt.Screen.layerUI.clear();
  },

  update: function (delta, lastInput) {

    // action leads into main menu (Thanks BlackCat
    if (lastInput && lastInput.key === cwt.Input.TYPE_ACTION)
      cwt.Gameflow.changeState("MAIN_MENU");

    //Particle creation (totally fixed up to take as little memory as possible)
    for (var i = 0; i < this.type.length + 1; i++) {
      //This one liner prevents massive amount of particles
      if (i == this.cap)
        break;
      if (parseInt(Math.random() * this.FREQUENCY) == 1) {
        if (i == this.type.length) {
          this.type.push(parseInt(Math.random() * 3));
          this.posx.push(((Math.random() * cwt.Screen.width + 100 / 10) * 10) - 200);
          this.posy.push(-10);
          break;
        }
        if (this.type[i] == -1) {
          this.type[i] = parseInt(Math.random() * 3);
          this.posx[i] = ((Math.random() * cwt.Screen.width + 100 / 10) * 10) - 200;
          this.posy[i] = -10;
          break;
        }

      }
    }

    if (cwt.DEBUG) {
      console.log("Quick render of snow... Delta is " + delta);
    }

    var dis = parseInt((250 / 1000) * delta, 10);
    var disQuart = parseInt(dis / 4, 10) || 1;

    // this.store += delta;
    //while(this.store > this.MAX){
    //Snow particle updates
    for (var i = 0; i < this.type.length; i++) {
      if (this.type[i] == -1)
        continue;

      if (this.type[i] == 2) {
        this.posx[i] += disQuart;
      }
      this.posx[i] += disQuart;
      this.posy[i] += dis;

      //Destroy particles
      if (this.posy[i] > cwt.Screen.height + 10)
        this.type[i] = -1;
    }
    // this.store -= this.MAX;
    //}
  },

  render: function () {
    var ctx = cwt.Screen.layerUI.getContext();

    //Tests the speed of each particle for debug mode
    if (cwt.DEBUG) {
      this.time = (new Date()).getTime();
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cwt.Screen.width, cwt.Screen.height);

    //Render particles
    for (var i = 0; i < this.type.length; i++) {
      if (this.type[i] == -1)
        continue;

      ctx.drawImage(this.ball, this.posx[i], this.posy[i], 10 + 5 * this.type[i], 10 + 5 * this.type[i]);
    }

    //Finishes the testing of speed for snow particles
    if (cwt.DEBUG) {
      console.log("Quick render of snow... needed " + ((new Date()).getTime() - this.time) + "ms");
    }
  }
});