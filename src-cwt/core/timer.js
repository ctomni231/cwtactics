var timeoutable = {
  tick(time) {
    this.timeLeft -= time;
    if (this.timeLeft <= 0) {
      this.timeLeft = this.timeout;
      this.handler();
    }
  }
};

cwt.produceTimer = function(timeout, handler) {
  return Object.assign(Object.create(timeoutable), {
    handler: handler,
    timeout: timeout,
    timeLeft: timeout
  });
};