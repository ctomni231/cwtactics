export const MAIN_INFO = {
  name: "Performance",
  data: {
    row1: {
      col1: [ "FPS", "performance.gameloop.fps" ]
    },
    row3: {
      col1: [ "-- Tick --", "" ],
    },
    row4: {
      col1: [ "Unstable", "performance.gameloop.unstable" ],
      col2: [ "avg", "performance.gameloop.averageDuration" ],
      col3: [ "current", "performance.gameloop.lastDuration" ]
    },
    row6: {
      col1: [ "-- Update --", "" ],
    },
    row7: {
      col1: [ "Unstable", "performance.screen_update.unstable" ],
      col2: [ "avg", "performance.screen_update.averageDuration" ],
      col3: [ "current", "performance.screen_update.lastDuration" ]
    },
    row9: {
      col1: [ "-- Render --", "" ],
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
      col2: [ "mapX", "cursor.map.x" ],
      col3: [ "mapY", "cursor.map.y" ]
    },
    row3: {
      col1: [ "", "" ],
      col2: [ "screenX", "cursor.screen.x" ],
      col3: [ "screenY", "cursor.screen.y" ]
    }
  }
}
