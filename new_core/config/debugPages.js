export const MAIN_INFO = {
  name: "Performance",
  data: {
    row1: {
      col1: [ "FPS", "performance.gameloop.fps" ],
    },
    row2: {
      col1: [ "Loop", "" ],
      col2: [ "Avg Time", "performance.gameloop.averageDuration" ],
      col3: [ "Last Time", "performance.gameloop.lastDuration" ]
    },
    row3: {
      col1: [ "Update", "" ],
      col2: [ "Avg Time", "performance.screen_update.averageDuration" ],
      col3: [ "Last Time", "performance.screen_update.lastDuration" ]
    },
    row4: {
      col1: [ "Render", "" ],
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