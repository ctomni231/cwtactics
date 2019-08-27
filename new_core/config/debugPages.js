export const DEBUG_PAGES = [
	
	{
	  name: "Map",
	  data: {
	    row1: {
	      col1: [ "map size", "" ],
	      col2: [ "width", "map.width" ],
	      col3: [ "height", "map.height" ]
	    },
	    row2: {
	      col1: [ "cursor", "" ],
	      col2: [ "x", "cursor.x" ],
	      col3: [ "y", "cursor.y" ]
	    },
	    row3: {
	      col1: [ "screen shift", "" ],
	      col2: [ "X", "screen.x" ],
	      col3: [ "Y", "screen.y" ]
	    },
	    row4: {
	      col1: [ "screen size", "" ],
	      col2: [ "width", "screen.width" ],
	      col3: [ "height", "screen.height" ]
			},
			row5: {
				col2: [ "unit", "cursor.selected.unit.typeId"]
			}
		}
	},
	{
	  name: "Performance",
	  data: {
	    row1: {
	      col1: [ "FPS", "performance.gameloop.fps" ]
	    },
	    row2: {
	      col1: [ "update game", ""],
	      col2: [ "average", "performance.gameloop.averageDuration" ],
	      col3: [ "last", "performance.gameloop.lastDuration" ]
	    },
	    row3: {
	      col1: [ "update screen", ""],
	      col2: [ "average", "performance.screen_update.averageDuration" ],
	      col3: [ "last", "performance.screen_update.lastDuration" ]
	    },
	    row4: {
	      col1: [ "render", ""],
	      col2: [ "average", "performance.screen_render.averageDuration" ],
	      col3: [ "last", "performance.screen_render.lastDuration" ]
	    }
	  }
	},
	
	{
	  name: "Input",
	  data: {
	    row1: {
	      col1: [ "ACTION", "input.ACTION" ],
	      col2: [ "CANCEL", "input.CANCEL" ]
	    },
	    row2: {
	      col1: [ "LEFT", "input.LEFT" ],
	      col2: [ "RIGHT", "input.RIGHT" ]
	    },
	    row3: {
	      col1: [ "UP", "input.UP" ],
	      col2: [ "DOWN", "input.DOWN" ]
	    },
	    row4: {
	      col1: [ "DEBUG_A", "input.DEBUG_A" ],
	      col2: [ "DEBUG_B", "input.DEBUG_B" ]
	    }
	  }
	}
]