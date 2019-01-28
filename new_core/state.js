export const state = {
  current: null,
  next: null,

  // Expanding state to include the fps counter
  fps: true
}

export const input = {
  status: {},
  mapping: {
    keyboard: {
      "ArrowRight": "RIGHT",
      "ArrowLeft": "LEFT",
      "ArrowUp": "UP",
      "ArrowDown": "DOWN",

      "Space": "ACTION",
      "ControlLeft": "CANCEL",

      "KeyN": "ACTION",
      "KeyM": "CANCEL",
    }
  }
}

export const loop = {
  delta: 0
}

export const version = "0.1 Alpha"
