var keyboardInput = {
  bind() {
    document.onkeydown = (event) => {
      this.keyHandler.pressKey("KB_" + event.keyCode);
      return false;
    };

    document.onkeyup = (event) => {
      this.keyHandler.releaseKey("KB_" + event.keyCode);
      return false;
    };
  },

  unbind() {
    document.onkeydown = null;
    document.onkeyup = null;
  }
};

// TODO use html event handler

cwt.produceKeyboardBackend = function(keyHandler) {
  return Object.assign(Object.create(keyboardInput), {
    keyHandler
  });
};