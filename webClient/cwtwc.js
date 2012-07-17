var cwtwc = {

	ctx_map: null,
	
	// still todo ( --> should be loaded via mod )
	terrain: new Image(),
	terrainMap: {
		"PLAIN": [0,0,0], // x,y and overlapping
		"FOREST": [16,0,1],
		"MOUNTAIN": [32,0,1]
	},

	drawnMap: [],

	tx: 16,
	ty: 16,

	animStep: 0,

	sx:0,
	sy:0,

	// todo: get size from documentElement
	sw: 0,
	sh: 0,

	initialize: function(){
		cwtwc.ctx_map = document.getElementById("cwt_maplayer").getContext("2d");
		
		// get size
		cwtwc.sw = parseInt( document.getElementById("cwt_maplayer").width / cwtwc.tx , 10 );
		cwtwc.sh = parseInt( document.getElementById("cwt_maplayer").height / cwtwc.ty , 10 );

		for( var i=0; i<cwtwc.sw; i++ ) cwtwc.drawnMap[i] = [];
		for(var x=0; x<cwtwc.sw; x++){
			for(var y=0; y<cwtwc.sh; y++){ cwtwc.drawnMap[x][y] = true; }}


		cwtwc.terrain.src = "terrains.png";
	},

	drawScreen: function(){

		var xe,ye;
		var pix;
		var tp;
		var tx = cwtwc.tx;
		var ty = cwtwc.ty;
		var map = cwt.map._map;
		ye = cwtwc.sy+cwtwc.sh-1;
		if( ye >= cwt.map._height ) ye = cwt.map._height-1;
		for(var y=cwtwc.sy; y<=ye; y++){

			xe = cwtwc.sx+cwtwc.sw-1;
			if( xe >= cwt.map._width ) xe = cwt.map._width-1;
			for(var x=cwtwc.sx; x<=xe; x++){

				tp= map[x][y];
				pix = cwtwc.terrainMap[ tp ];

				// draw only if the type is not drawn on that position
				if(
					cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy] === true
				/*if( cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy] !== tp ||
						pix[2] === 1   ||
						( y<ye && cwtwc.terrainMap[ cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy+1] ][2] === 1 )*/
				){

					if( pix !== undefined ){
						cwtwc.ctx_map.drawImage(
							cwtwc.terrain,
							pix[0], pix[1],
							16, 32,
							(x-cwtwc.sx)*tx, (y-cwtwc.sy)*ty - ty,
							tx, ty + ty
						);
					}
					else{
						cwtwc.ctx_map.fillStyle="rgb(0,0,255)";
						cwtwc.ctx_map.fillRect( (x-cwtwc.sx)*tx, (y-cwtwc.sy)*ty, tx, ty );
					}

					// set new drawn type
					cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy] = false;
				}
			}
		}
	},

	mapShift: function( dir, dis ){
		if( dis === undefined ) dis = 1;

		var sx = cwtwc.sx,
				sy = cwtwc.sy;

		switch (dir) {
			case 0:
				cwtwc.sy -= dis;
				if( cwtwc.sy < 0 ) cwtwc.sy = 0;
				break;

			case 1:
				cwtwc.sx += dis;
				if( cwtwc.sx >= cwt.map._width-cwtwc.sw ) cwtwc.sx = cwt.map._width-cwtwc.sw-1;
				if( cwtwc.sx < 0 ) cwtwc.sx = 0; // bugfix if map width is smaller than screen width
				break;

			case 2:
				cwtwc.sy += dis;
				if( cwtwc.sy >= cwt.map._height-cwtwc.sh ) cwtwc.sy = cwt.map._height-cwtwc.sh-1;
				if( cwtwc.sy < 0 ) cwtwc.sy = 0; // bugfix if map height is smaller than screen height
				break;

			case 3:
				cwtwc.sx -= dis;
				if( cwtwc.sx < 0 ) cwtwc.sx = 0;
				break;
		}

		// rebuild draw map
		var xe,ye;
		var map = cwt.map._map;
		var shiftX = cwtwc.sx - sx;
		var shiftY = cwtwc.sy - sy;

		ye = cwtwc.sy+cwtwc.sh-1;
		if( ye >= cwt.map._height ) ye = cwt.map._height-1;
		for(var y=cwtwc.sy; y<=ye; y++){

			xe = cwtwc.sx+cwtwc.sw-1;
			if( xe >= cwt.map._width ) xe = cwt.map._width-1;
			for(var x=cwtwc.sx; x<=xe; x++){

				if( map[x][y] !== map[x-shiftX][y-shiftY] ||
						(
							cwtwc.terrainMap[ map[x][y] ] !== undefined &&
							cwtwc.terrainMap[ map[x][y] ][2] === 1
						) || (
							y<ye && cwtwc.terrainMap[ map[x][y+1] ] !== undefined
									 && cwtwc.terrainMap[ map[x][y+1] ][2] === 1
						) || (
							y<ye && cwtwc.terrainMap[ map[x-shiftX][y-shiftY+1] ] !== undefined
									 && cwtwc.terrainMap[ map[x-shiftX][y-shiftY+1] ][2] === 1
						)
					){
					cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy] = true;
				}
				else cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy] = false;
			}
		}
		// END OF - rebuild draw map

		
	}
};