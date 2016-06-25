const INTERVAL_LOOP_TIME = 50;

// (Int, () -> ?) -> nothing
cwt.manualLoop = (timeout, handler) => {
  var timeLeft = timeout;
  return (time) => {
    timeLeft -= time;
    if (timeLeft <= 0) {
      timeLeft = timeout;
      handler();
    }
    return cwt.nothing();
  };
};

const animationFrameFactory = loop => requestAnimationFrame(loop);

const setIntervalFactory = loop => setTimeout(loop, INTERVAL_LOOP_TIME);

cwt.produceGameloop = function(loopAction) {
  var nextLoop = !!this.requestAnimationFrame ? animationFrameFactory : setIntervalFactory;
  var lastTime = 0;

  return {

    start() {
      const loop = () => {
        if (lastTime === -1) {
          return;
        }

        var now = Date.now();
        loopAction(now - lastTime);
        lastTime = now;
        nextLoop(loop);
      };

      lastTime = Date.now();
      nextLoop(loop);
    },

    stop() {
      lastTime = -1;
    }
  };
};
