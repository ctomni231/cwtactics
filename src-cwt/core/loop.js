var loopHandler = Object.freeze({

  start() {
    const loop = () => {
      if (this.lastTime === -1) {
        return;
      }

      var now = Date.now();
      this.loopAction(now - this.lastTime);
      this.lastTime = now;
      this.nextLoop(loop);
    };

    this.lastTime = Date.now();
    this.nextLoop(loop);
  },

  stop() {
    this.lastTime = -1;
  }
});

var requestAnimationFrameLoop = function(loop) {
  requestAnimationFrame(loop);
};

var setIntervalLoop = function(loop) {
  setTimeout(loop, 50);
};

cwt.produceGameloop = function(handler) {
  return Object.assign(Object.create(loopHandler), {
    loopAction: handler,
    nextLoop: !!requestAnimationFrame ? requestAnimationFrameLoop : setIntervalLoop
  });
};