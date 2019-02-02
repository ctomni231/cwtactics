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
      col2: [ "Avg Time", "performance.gameloop.averageDuration" ],
      col3: [ "Last Time", "performance.gameloop.lastDuration" ]
    },
    row6: {
      col1: [ "-- Update --", "" ],
    },
    row7: {
      col1: [ "Unstable", "performance.screen_update.unstable" ],
      col2: [ "Avg Time", "performance.screen_update.averageDuration" ],
      col3: [ "Last Time", "performance.screen_update.lastDuration" ]
    },
    row9: {
      col1: [ "-- Render --", "" ],
    },
    row10: {
      col1: [ "Unstable", "performance.screen_render.unstable" ],
      col2: [ "Avg Time", "performance.screen_render.averageDuration" ],
      col3: [ "Last Time", "performance.screen_render.lastDuration" ]
    }
  }
}

export const MAP_INFO = {
  name: "Map",
  data: {
    row1: {
      col1: [ "Width", "map.width" ],
      col2: [ "Height", "map.height" ]
    }
  }
}
