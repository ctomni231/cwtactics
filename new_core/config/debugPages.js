export const MAIN_INFO = {
  name: "Performance",
  data: {
    row1: {
      col1: [ "FPS", "performance.gameloop.fps" ]
    },
    row3: {
      col1: [ "-- Tick (ms) --", "" ],
    },
    row4: {
      col1: [ "Unstable", "performance.gameloop.unstable" ],
      col2: [ "avg", "performance.gameloop.averageDuration" ],
      col3: [ "current", "performance.gameloop.lastDuration" ]
    },
    row6: {
      col1: [ "-- Update (ms) --", "" ],
    },
    row7: {
      col1: [ "Unstable", "performance.screen_update.unstable" ],
      col2: [ "avg", "performance.screen_update.averageDuration" ],
      col3: [ "current", "performance.screen_update.lastDuration" ]
    },
    row9: {
      col1: [ "-- Render (ms) --", "" ],
    },
    row10: {
      col1: [ "Unstable", "performance.screen_render.unstable" ],
      col2: [ "avg", "performance.screen_render.averageDuration" ],
      col3: [ "current", "performance.screen_render.lastDuration" ]
    }
  }
}

export const MAP_INFO = {
  name: "Map",
  data: {
    row1: {
      col1: [ "Size", "" ],
      col2: [ "width", "map.width" ],
      col3: [ "height", "map.height" ]
    },
    row2: {
      col1: [ "Cursor", "" ],
      col2: [ "mapX", "cursor.x" ],
      col3: [ "mapY", "cursor.y" ]
    },
    row3: {
      col1: [ "Screen", "" ],
      col2: [ "X", "screen.x" ],
      col3: [ "Y", "screen.y" ]
    },
    row4: {
      col1: [ "", "" ],
      col2: [ "width", "screen.width" ],
      col3: [ "height", "screen.height" ]
    }
  }
}
