export const state = {
  current: null,
  next: null
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