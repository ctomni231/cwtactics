cwt.mainMenuState = {
  update(delta, input) {
    if (input.isActionPressed("ACTION")) {
      return "LOADMAP";
    }
    return null;
  }
};