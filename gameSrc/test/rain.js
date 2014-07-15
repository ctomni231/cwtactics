
//
//rain.js

//A simple class that does the rain demo in JS

//@author = Carr, Crecen
//@version = 04.30.14

//First attempt at creating the rain weather for JavaScript
cwt.Gameflow.addState({
  id: "RAIN",
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
	this.MAX = 8;

	//Keeps track of the cap
	this.cap = 50;
	//Keeps track of the frequency of a raindrop
	this.FREQUENCY = 1;

	//The type of raindrop to draw
	this.type = [];
	//The x-axis position of the raindrop
	this.posx = [];
	//The y-axis position of the raindrop
	this.posy = [];

	//Holds the graphics for a simple raindrop (cache)
	//Totally hard coded all the values here
	this.ball = document.createElement('canvas');
	this.ball.width = 10;
	this.ball.height = 10;

	var ctx = this.ball.getContext('2d');
	ctx.strokeStyle = "rgba(255,255,255,0.3)";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(4,10);
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

	this.store += delta;
	while(this.store > this.MAX){
		//Particle creation (totally fixed up to take as little memory as possible)
		for(var i = 0; i < this.type.length+1; i++){
			//This one liner prevents massive amount of particles
			if(i == this.cap)
				break;
			if(parseInt(Math.random()*this.FREQUENCY) == 0){
				if(i == this.type.length){
					this.type.push(parseInt(Math.random()*2));
					this.posx.push(((Math.random()*cwt.Screen.width+100/10)*10)-200);
					this.posy.push(-10);
					break;
				}
				if(this.type[i] == -1){
					this.type[i] = parseInt(Math.random()*2);
					this.posx[i] = ((Math.random()*cwt.Screen.width+100/10)*10)-200;
					this.posy[i] = -10;
					break;
				}

			}
		}
	
		//Rain particle updates
		for(var i = 0; i < this.type.length; i++){
			if(this.type[i] == -1)
				continue;

			this.posx[i] += 1;
			this.posy[i] += 4;

			//Destroy particles
			if(this.posy[i] > cwt.Screen.height+10)
				this.type[i] = -1;
		}
		this.store -= this.MAX;
	}
  },

  render: function () {
    var ctx = cwt.Screen.layerUI.getContext();

	//Tests the speed of each particle for debug mode
	if (cwt.DEBUG) {
      this.time = (new Date()).getTime();
    }

	ctx.fillStyle = "black";
    ctx.fillRect( 0, 0, cwt.Screen.width, cwt.Screen.height );

	//Render particles
	for(var i = 0; i < this.type.length; i++){
		if(this.type[i] == -1)
			continue;

		ctx.drawImage(this.ball, this.posx[i], this.posy[i], 10+5*this.type[i], 10+5*this.type[i]);
	}

	//Finishes the testing of speed for snow particles
	if (cwt.DEBUG) {
      console.log("Quick render of rain... needed "+((new Date()).getTime()-this.time)+"ms");
    }
  }
});