import { input, state, loop, view } from "./engine/screenstate.js"
import * as jslix from "./engine/js/jslix.js"

export const name = "CWTDEMOHEX";

// https://www.arungudelli.com/html5/html5-canvas-polygon/

// Temp variables
let polyVerts = []
let polySize = []

// Keeping track of the actions
let mactive = 1;
let action = false
let atrig = 0
let mtrig = 0

// Map size
let mapsizex = 30;
let mapsizey = 20;

// Map position
let mapposx = 50;
let mapposy = 50;

// Cursor position
let userx = 0;
let usery = 0;

// Terrain items
// Map tracking as a list of arrays should make it easy to work with
let mapid = []
let mapx = []
let mapy = []
let mapclr = ['#B6FF00']
let maptc = []
// The small drip holder
let mapmv = []
// The big drip holder
let mapmv2 = []
// Map attack
let mapatk = []
// Map silo
let mapsl = []
// Move snake path highlight
let mpath = [];
let switchblade = 0;
let keyblade = 0;

// Unit items
let select = 0;
let selunitid = -1;
let range = 9;
let unitid = []
let unitx = [];
let unity = [];
let unitsel = [];
let unitmv = [];


export function init(){

  polyVerts = getPolyVerts(6, 16, false)
  polySize = getPolySize(polyVerts)
  console.log(polyVerts, polySize)

  // Create the map
  for(let i=0;i<mapsizey;i++){
    for(let j=0;j<mapsizex;j++){
      if (i==0 || j==0 || i==mapsizey-1 || j==mapsizex-1){
        createTerrain(3, j, i, 0);
      }else{
        createTerrain(3, j, i, 1);
      }//*/
      //createTerrain(3, j, i, 1)
    }
  }

  // Create a few units
  createUnit(1, 0, 0, 3);
  createUnit(2, 6, 6, 5);
  createUnit(3, 10, 5, 2);


  // The first image is the Plain
  jslix.addImage("image/cwt_tileset/terrain(C)/CWT_PLIN.png");
  // The rest images are the units
  jslix.addCut(0,0,32,32);
  jslix.addImage("image/cwt_tileset/units/CWT_INFT.png");
  jslix.addCut(0,0,32,32);
  jslix.addImage("image/cwt_tileset/units/CWT_BIKE.png");
  jslix.addCut(0,0,32,32);
  jslix.addImage("image/cwt_tileset/units/CWT_MECH.png");
}

export function update(){

  // This handles the action presses
  mactive = input.MOUSE;

  if (input.CANCEL || input.ACTION) {
    action = true
    atrig += 1;
  }else if (input.LEFT || input.RIGHT || input.UP || input.DOWN) {
    action = true
    mtrig += 1;
  }else if(action){
    action = false
    atrig = 0;
    mtrig = 0;
  }

  // This is for mouse controls
  if(mactive){
    for(let i=0;i<mapsizex;i++){
      for(let j=0;j<mapsizey;j++){
        if(j%2==0){
          if(input.MOUSEX > mapposx-parseInt(polySize[1]/2)+(polySize[0]*i) &&
             input.MOUSEX < mapposx+parseInt(polySize[1]/2)+(polySize[0]*i) &&
             input.MOUSEY > mapposy-parseInt(polySize[1]/2)+(polySize[1]*j*(3/4)) &&
             input.MOUSEY < mapposy+parseInt(polySize[1]/2)+(polySize[1]*j*(3/4))){

              // Set the cursor
              userx = i;
              usery = j;
              break;
          }
        }else{
          if(input.MOUSEX > mapposx-parseInt(polySize[1]/2)+(polySize[0]*i+parseInt(polySize[0]/2)) &&
             input.MOUSEX < mapposx+parseInt(polySize[1]/2)+(polySize[0]*i+parseInt(polySize[0]/2)) &&
             input.MOUSEY > mapposy-parseInt(polySize[1]/2)+(polySize[1]*j*(3/4)) &&
             input.MOUSEY < mapposy+parseInt(polySize[1]/2)+(polySize[1]*j*(3/4))){

              // Set the cursor
              userx = i;
              usery = j;
              break;
          }
        }
      }
    }
  }

  // This is for keyboard controls
  else if(mtrig == 1){
    if (input.RIGHT && userx < mapsizex-1){
      if (keyblade <= 0)
        keyblade = 1
      else
        userx += 1;
    }else if(input.LEFT && userx > 0){
      if (keyblade >= 0)
        keyblade = -1
      else
        userx -= 1;
    }else if (input.DOWN && usery < mapsizey-1){
      if (keyblade == -1 && usery%2==0)
        userx -= 1;
      else if (keyblade == 1 && usery%2==1)
        userx += 1;
      usery += 1;
    }else if(input.UP && usery > 0){
      if (keyblade == -1 && usery%2==0)
        userx -= 1;
      else if (keyblade == 1 && usery%2==1)
        userx += 1;
      usery -= 1;
    }
  }

  if(atrig == 1){
    if(input.CANCEL){
      if(select == 1){
        clearUnitMove();
        select = 0
      }else if (select == 0){
        mapatk = showRange(userx, usery, 6, 2)
        //mapsl = showRange(userx, usery, 0, -1);
        select = -1
      }else{
        clearUnitMove();
        mapatk = clearRange()
        mapsl = clearRange()
        select = 0
      }
    }else{

      let empty = 1
      for(let i=0; i<unitid.length; i++){
        if(select < 1 && unitsel[i] == 0 && unitx[i] == userx && unity[i] == usery){
          unitsel[i] = 1;
          selunitid = i;
          showMove(unitmv[i], unitx[i], unity[i]);
          mapatk = clearRange();
          mapsl = clearRange();
          select = 1;
          empty = 0;
          break;
        }else if(unitsel[i] == 1){
          let place = 1;
          for(let j=0;j<unitid.length;j++){
            if(unitx[j] == userx && unity[j] == usery){
              place = 0;
              break;
            }
          }
          if (place == 1){
            unitx[i] = userx;
            unity[i] = usery;
            unitsel[i] = 0;
            selunitid = 0;
            select = 0;
            clearUnitMove();
            empty = 0;
            break;
          }
        }
      }

      if (empty){
        showMove(range, userx, usery)
      }
    }
  }

  if (select == 1){
    makeUnitPath(selunitid, userx, usery)
  }
  if(select == -1){
    mapsl = clearRange();
    mapsl = showRange(userx, usery, 5, 2);
  }
}

export function render(canvas, ctx){
  // For drawing the map
  drawMap(ctx)

  // Draw the units
  for(let i=0; i<unitid.length; i++){
    if(unity[i]%2==0)
      ctx.drawImage(jslix.getImg(unitid[i]), mapposx+(unitx[i]*polySize[0])-parseInt(polySize[0]*5/8), mapposy+(unity[i]*polySize[1]*(3/4))-(polySize[1]/2))
    else
      ctx.drawImage(jslix.getImg(unitid[i]), mapposx+(unitx[i]*polySize[0]-parseInt(polySize[0]*1/8)), mapposy+(unity[i]*polySize[1]*(3/4))-(polySize[1]/2))
  }

  // Draw the path
  ctx.lineWidth = 3.0;
  if (select == 1){
    for(let i=0; i<mpath.length; i++){
      if(mapy[mpath[i]]%2==0)
        drawPolyVerts(ctx, mapposx+(mapx[mpath[i]]*polySize[0]), mapposy+(mapy[mpath[i]]*polySize[1]*(3/4)), '', 'black')
      else
        drawPolyVerts(ctx, mapposx+(mapx[mpath[i]]*polySize[0]+parseInt(polySize[0]/2)), mapposy+(mapy[mpath[i]]*polySize[1]*(3/4)), '', 'black')
    }
  }

  // Draw the cursor
  if(usery%2==0)
    drawPolyVerts(ctx, mapposx+(userx*polySize[0]), mapposy+(usery*polySize[1]*(3/4)), '', 'blue')
  else
    drawPolyVerts(ctx, mapposx+(userx*polySize[0]+parseInt(polySize[0]/2)), mapposy+(usery*polySize[1]*(3/4)), '', 'blue')
  ctx.lineWidth = 1.0;

  // Draw the debugging text
  ctx.fillStyle = 'black';
  for(let i=0;i<mapid.length;i++){
    if(mapsl[i]>0)
      renderSilo(ctx, i, mapsl, 'gray');
    if(mapy[i]%2==0)
      ctx.fillText(mapmv2[i], mapposx+(polySize[0]*mapx[i]), mapposy+parseInt((polySize[1]*mapy[i]*(3/4))));
    else
      ctx.fillText(mapmv2[i], mapposx+(polySize[0]*mapx[i]+parseInt(polySize[0]/2)), mapposy+parseInt((polySize[1]*mapy[i]*(3/4))));
  }//*/

}

function drawMap(ctx){
  let color = "black"

  for(let i=0;i<mapid.length;i++){

    color = mapclr[0]
    if (mapmv[i] > 0)
      color = "#007F7F"
    else if (mapatk[i]>0)
      color = "red"
    else if (maptc[i]==0)
      color = "gray"

    if(mapy[i]%2==0)
      drawPolyVerts(ctx, mapposx+(polySize[0]*mapx[i]), mapposy+parseInt((polySize[1]*mapy[i]*(3/4))), color)
    else
      drawPolyVerts(ctx, mapposx+(polySize[0]*mapx[i]+parseInt(polySize[0]/2)), mapposy+parseInt((polySize[1]*mapy[i]*(3/4))), color)
  }
}

function drawPolyVerts(ctx, px, py, fillcolor='white', strokecolor='black'){
  if (fillcolor != "")
    ctx.fillStyle = fillcolor;
  ctx.strokeStyle = strokecolor;
  ctx.beginPath();
  for(let i=0; i<polyVerts.length; i++){
    if(i>0)
      ctx.lineTo(px+polyVerts[i][0], py+polyVerts[i][1]);
    else
      ctx.moveTo(px+polyVerts[i][0], py+polyVerts[i][1]);
  }
  ctx.closePath();
  if (fillcolor != "")
    ctx.fill();
  ctx.stroke();
}

function renderSilo(ctx, ind, maprn, color='white', line=4){

  let tmpind = -1;
  ctx.strokeStyle = color;
  ctx.lineWidth = line;

  // Let's draw the borders
  ctx.beginPath();

  if (polyVerts.length == 6){

    // ALPHA
    if(mapy[ind]%2==0){

      // NORTHEAST
      if(mapy[ind]-1 >= 0){
        tmpind = ((mapy[ind]-1)*mapsizex)+(mapx[ind]%mapsizex)
        if(maprn[tmpind] <= 0){
          ctx.moveTo(mapposx+(polySize[0]*mapx[ind])+polyVerts[2][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[2][1])
          ctx.lineTo(mapposx+(polySize[0]*mapx[ind])+polyVerts[3][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[3][1])
        }
      }

      // EAST
      if(mapx[ind]+1 < mapsizex){
        tmpind = (mapy[ind]*mapsizex)+((mapx[ind]+1)%mapsizex)
        if(maprn[tmpind] <= 0){
          ctx.moveTo(mapposx+(polySize[0]*mapx[ind])+polyVerts[1][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[1][1])
          ctx.lineTo(mapposx+(polySize[0]*mapx[ind])+polyVerts[2][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[2][1])
        }
      }

      // SOUTHEAST
      if(mapy[ind]+1 < mapsizey){
        tmpind = ((mapy[ind]+1)*mapsizex)+(mapx[ind]%mapsizex)
        if(maprn[tmpind] <= 0){
          ctx.moveTo(mapposx+(polySize[0]*mapx[ind])+polyVerts[0][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[0][1])
          ctx.lineTo(mapposx+(polySize[0]*mapx[ind])+polyVerts[1][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[1][1])
        }
      }

      // SOUTHWEST
      if(mapx[ind]-1 >= 0 && mapy[ind]+1 < mapsizey){
        tmpind = ((mapy[ind]+1)*mapsizex)+((mapx[ind]-1)%mapsizex)
        if(maprn[tmpind] <= 0){
          ctx.moveTo(mapposx+(polySize[0]*mapx[ind])+polyVerts[5][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[5][1])
          ctx.lineTo(mapposx+(polySize[0]*mapx[ind])+polyVerts[0][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[0][1])
        }
      }

      // WEST
      if(mapx[ind]-1 >= 0){
        tmpind = (mapy[ind]*mapsizex)+((mapx[ind]-1)%mapsizex)
        if(maprn[tmpind] <= 0){
          ctx.moveTo(mapposx+(polySize[0]*mapx[ind])+polyVerts[4][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[4][1])
          ctx.lineTo(mapposx+(polySize[0]*mapx[ind])+polyVerts[5][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[5][1])
        }
      }

      // NORTHWEST
      if(mapx[ind]-1 >= 0 && mapy[ind]-1 >= 0){
        tmpind = ((mapy[ind]-1)*mapsizex)+((mapx[ind]-1)%mapsizex)
        if(maprn[tmpind] <= 0){
          ctx.moveTo(mapposx+(polySize[0]*mapx[ind])+polyVerts[3][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[3][1])
          ctx.lineTo(mapposx+(polySize[0]*mapx[ind])+polyVerts[4][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[4][1])
        }
      }
    }
    // BETA
    else{

      // NORTHEAST
      if(mapx[ind]+1 < mapsizex && mapy[ind]-1 >= 0){
        tmpind = ((mapy[ind]-1)*mapsizex)+((mapx[ind]+1)%mapsizex)
        if(maprn[tmpind] <= 0){
          ctx.moveTo(mapposx+(polySize[0]*mapx[ind]+parseInt(polySize[0]/2))+polyVerts[2][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[2][1])
          ctx.lineTo(mapposx+(polySize[0]*mapx[ind]+parseInt(polySize[0]/2))+polyVerts[3][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[3][1])
        }
      }

      // EAST
      if(mapx[ind]+1 < mapsizex){
        tmpind = (mapy[ind]*mapsizex)+((mapx[ind]+1)%mapsizex)
        if(maprn[tmpind] <= 0){
          ctx.moveTo(mapposx+(polySize[0]*mapx[ind]+parseInt(polySize[0]/2))+polyVerts[1][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[1][1])
          ctx.lineTo(mapposx+(polySize[0]*mapx[ind]+parseInt(polySize[0]/2))+polyVerts[2][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[2][1])
        }
      }

      // SOUTHEAST
      if(mapx[ind]+1 < mapsizex && mapy[ind]+1 < mapsizey){
        tmpind = ((mapy[ind]+1)*mapsizex)+((mapx[ind]+1)%mapsizex)
        if(maprn[tmpind] <= 0){
          ctx.moveTo(mapposx+(polySize[0]*mapx[ind]+parseInt(polySize[0]/2))+polyVerts[0][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[0][1])
          ctx.lineTo(mapposx+(polySize[0]*mapx[ind]+parseInt(polySize[0]/2))+polyVerts[1][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[1][1])
        }
      }

      // SOUTHEAST
      if(mapy[ind]+1 < mapsizey){
        tmpind = ((mapy[ind]+1)*mapsizex)+(mapx[ind]%mapsizex)
        if(maprn[tmpind] <= 0){
          ctx.moveTo(mapposx+(polySize[0]*mapx[ind]+parseInt(polySize[0]/2))+polyVerts[5][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[5][1])
          ctx.lineTo(mapposx+(polySize[0]*mapx[ind]+parseInt(polySize[0]/2))+polyVerts[0][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[0][1])
        }
      }

      // WEST
      if(mapx[ind]-1 >= 0){
        tmpind = (mapy[ind]*mapsizex)+((mapx[ind]-1)%mapsizex)
        if(maprn[tmpind] <= 0){
          ctx.moveTo(mapposx+(polySize[0]*mapx[ind]+parseInt(polySize[0]/2))+polyVerts[4][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[4][1])
          ctx.lineTo(mapposx+(polySize[0]*mapx[ind]+parseInt(polySize[0]/2))+polyVerts[5][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[5][1])
        }
      }

      // NORTHWEST
      if(mapy[ind]-1 >= 0){
        tmpind = ((mapy[ind]-1)*mapsizex)+(mapx[ind]%mapsizex)
        if(maprn[tmpind] <= 0){
          ctx.moveTo(mapposx+(polySize[0]*mapx[ind]+parseInt(polySize[0]/2))+polyVerts[3][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[3][1])
          ctx.lineTo(mapposx+(polySize[0]*mapx[ind]+parseInt(polySize[0]/2))+polyVerts[4][0], mapposy+(polySize[1]*mapy[ind]*(3/4))+polyVerts[4][1])
        }
      }


    }
  }

  // End drawing the borders
  ctx.stroke();
  ctx.lineWidth = 1.0;
}
// -------------------------------
// CREATION FUNCTIONS
// -------------------------------

function createTerrain(id, px, py, tc){
  mapid.push(id);
  mapx.push(px);
  mapy.push(py);
  maptc.push(tc);
  mapmv.push(0);
  mapmv2.push(0);
  mapatk.push(0);
  mapsl.push(0);
}

function createUnit(id, px, py, mv){
  unitid.push(id);
  unitx.push(px);
  unity.push(py);
  unitsel.push(0);
  unitmv.push(mv);
}

// -------------------------------
// VALID MOVE FUNCTIONS
// -------------------------------

function validMoveNW(ind, opt){
  let tmpind = -1;

  // ALPHA PATH
  if(mapy[ind]%2==0){
    if(mapx[ind]-1 >= 0 && mapy[ind]-1 >= 0){
      tmpind = ((mapy[ind]-1)*mapsizex)+((mapx[ind]-1)%mapsizex)
      if(opt == 1){
        if(mapmv[tmpind] < mapmv[ind]-maptc[tmpind]){
          mapmv[tmpind] = mapmv[ind]-maptc[tmpind];
          mapmv2[tmpind] = mapmv2[ind]-1;
        }else
          tmpind = -1;
      }else if(opt == 2 && mapmv2[ind] > mapmv2[tmpind])
        tmpind = -1;
    }
  }

  // BETA PATH
  else{
    if(mapy[ind]-1 >= 0){
      tmpind = ((mapy[ind]-1)*mapsizex)+(mapx[ind]%mapsizex)
      if(opt == 1){
        if(mapmv[tmpind] < mapmv[ind]-maptc[tmpind]){
          mapmv[tmpind] = mapmv[ind]-maptc[tmpind];
          mapmv2[tmpind] = mapmv2[ind]-1;
        }else
          tmpind = -1;
      }else if(opt == 2 && mapmv2[ind] > mapmv2[tmpind])
        tmpind = -1;
    }
  }

  return tmpind
}

function validMoveNE(ind, opt){
  let tmpind = -1;

  // ALPHA PATH
  if(mapy[ind]%2==0){
    if(mapy[ind]-1 >= 0){
      tmpind = ((mapy[ind]-1)*mapsizex)+(mapx[ind]%mapsizex)
      if(opt == 1){
        if(mapmv[tmpind] < mapmv[ind]-maptc[tmpind]){
          mapmv[tmpind] = mapmv[ind]-maptc[tmpind];
          mapmv2[tmpind] = mapmv2[ind]-1;
        }else
          tmpind = -1;
      }else if(opt == 2 && mapmv2[ind] > mapmv2[tmpind])
        tmpind = -1;
    }
  }

  // BETA PATH
  else{
    if(mapx[ind]+1 < mapsizex && mapy[ind]-1 >= 0){
      tmpind = ((mapy[ind]-1)*mapsizex)+((mapx[ind]+1)%mapsizex)
      if(opt == 1){
        if(mapmv[tmpind] < mapmv[ind]-maptc[tmpind]){
          mapmv[tmpind] = mapmv[ind]-maptc[tmpind];
          mapmv2[tmpind] = mapmv2[ind]-1;
        }else
          tmpind = -1;
      }else if(opt == 2 && mapmv2[ind] > mapmv2[tmpind])
        tmpind = -1;
    }
  }

  return tmpind
}

function validMoveSW(ind, opt){
  let tmpind = -1;

  // ALPHA PATH
  if(mapy[ind]%2==0){
    if(mapx[ind]-1 >= 0 && mapy[ind]+1 < mapsizey){
      tmpind = ((mapy[ind]+1)*mapsizex)+((mapx[ind]-1)%mapsizex)
      if(opt == 1){
        if(mapmv[tmpind] < mapmv[ind]-maptc[tmpind]){
          mapmv[tmpind] = mapmv[ind]-maptc[tmpind];
          mapmv2[tmpind] = mapmv2[ind]-1;
        }else
          tmpind = -1;
      }else if(opt == 2 && mapmv2[ind] > mapmv2[tmpind])
        tmpind = -1;
    }
  }

  // BETA PATH
  else{
    if(mapy[ind]+1 < mapsizey){
      tmpind = ((mapy[ind]+1)*mapsizex)+(mapx[ind]%mapsizex)
      if(opt == 1){
        if(mapmv[tmpind] < mapmv[ind]-maptc[tmpind]){
          mapmv[tmpind] = mapmv[ind]-maptc[tmpind];
          mapmv2[tmpind] = mapmv2[ind]-1;
        }else
          tmpind = -1;
      }else if(opt == 2 && mapmv2[ind] > mapmv2[tmpind])
        tmpind = -1;
    }
  }

  return tmpind
}

function validMoveSE(ind, opt){
  let tmpind = -1;

  // ALPHA PATH
  if(mapy[ind]%2==0){
    if(mapy[ind]+1 < mapsizey){
      tmpind = ((mapy[ind]+1)*mapsizex)+(mapx[ind]%mapsizex)
      if(opt == 1){
        if(mapmv[tmpind] < mapmv[ind]-maptc[tmpind]){
          mapmv[tmpind] = mapmv[ind]-maptc[tmpind];
          mapmv2[tmpind] = mapmv2[ind]-1;
        }else
          tmpind = -1;
      }else if(opt == 2 && mapmv2[ind] > mapmv2[tmpind])
        tmpind = -1;
    }
  }

  // BETA PATH
  else{
    if(mapx[ind]+1 < mapsizex && mapy[ind]+1 < mapsizey){
      tmpind = ((mapy[ind]+1)*mapsizex)+((mapx[ind]+1)%mapsizex)
      if(opt == 1){
        if(mapmv[tmpind] < mapmv[ind]-maptc[tmpind]){
          mapmv[tmpind] = mapmv[ind]-maptc[tmpind];
          mapmv2[tmpind] = mapmv2[ind]-1;
        }else
          tmpind = -1;
      }else if(opt == 2 && mapmv2[ind] > mapmv2[tmpind])
        tmpind = -1;
    }
  }

  return tmpind
}

function validMoveW(ind, opt){
  let tmpind = -1;
  if(mapx[ind]-1 >= 0){
    tmpind = (mapy[ind]*mapsizex)+((mapx[ind]-1)%mapsizex)
    if(opt == 1){
      if(mapmv[tmpind] < mapmv[ind]-maptc[tmpind]){
        mapmv[tmpind] = mapmv[ind]-maptc[tmpind];
        mapmv2[tmpind] = mapmv2[ind]-1;
      }else
        tmpind = -1;
    }else if(opt == 2 && mapmv2[ind] > mapmv2[tmpind])
      tmpind = -1;
  }
  return tmpind
}

function validMoveE(ind, opt){
  let tmpind = -1;
  if(mapx[ind]+1 < mapsizex){
    tmpind = (mapy[ind]*mapsizex)+((mapx[ind]+1)%mapsizex)
    if(opt == 1){
      if(mapmv[tmpind] < mapmv[ind]-maptc[tmpind]){
        mapmv[tmpind] = mapmv[ind]-maptc[tmpind];
        mapmv2[tmpind] = mapmv2[ind]-1;
      }else
        tmpind = -1;
    }else if(opt == 2 && mapmv2[ind] > mapmv2[tmpind])
      tmpind = -1;
  }
  return tmpind
}

//---------------------------------
// MAP FUNCTIONS
//---------------------------------

function showMove(rng, x, y){

  // Convert the coordinates into
  let ind = (y*mapsizex)+(x%mapsizex)

  //Project ripple is a go
  let tmpind = -1;
  let trigger = []
  let conveyor = []

  // The space we are on has the biggest number
  mapmv[ind] = rng+1 //unitmv[uind]+1; Just will be the range we want to show
  mapmv2[ind] = mapid.length;
  console.log("Map Move:", mapmv[ind]);
  trigger.push(ind)

  // Because terrain cost can be zero, going for a different approach
  let m = 0;
  while(trigger.length > 0){
    for(let i=0;i<trigger.length;i++){

      // WEST TILE
      tmpind = validMoveW(trigger[i], 1);
      if(tmpind >= 0)
        conveyor.push(tmpind)

      // EAST TILE
      tmpind = validMoveE(trigger[i], 1);
      if(tmpind >= 0)
        conveyor.push(tmpind)

      // NORTHWEST TILE
      tmpind = validMoveNW(trigger[i], 1);
      if(tmpind >= 0)
        conveyor.push(tmpind)

      // NORTHEAST TILE
      tmpind = validMoveNE(trigger[i], 1);
      if(tmpind >= 0)
        conveyor.push(tmpind)

      // SOUTHWEST TILE
      tmpind = validMoveSW(trigger[i], 1);
      if(tmpind >= 0)
        conveyor.push(tmpind)

      // SOUTHEAST TILE
      tmpind = validMoveSE(trigger[i], 1);
      if(tmpind >= 0)
        conveyor.push(tmpind)
    }

    // Print out the iteration
    console.log("Map Iteration", m)

    // Print out the conveyor
    console.log("Map Conveyor", conveyor)

    // Then we transfer the unique values
    let s = new Set(conveyor)
    trigger = [...s]
    conveyor = []

    // Print out the trigger
    console.log("Map Trigger", trigger)

    m++;
  }
}

function clearUnitMove(){
  for(let i=0; i<mapid.length;i++){
    mapmv[i] = 0;
    mapmv2[i] = 0;
  }
}

function showRange(x, y, or=1, ir=0){

  // Create a brand new field
  let maprn = []
  for(let i=0;i<mapid.length;i++)
    maprn.push(0)

  // Convert the coordinates into
  let ind = (y*mapsizex)+(x%mapsizex)

  //Project ripple is a go
  let tmpind = -1;
  let trigger = []
  let conveyor = []

  // The space we are on has the biggest number
  maprn[ind] = or+1;
  trigger.push(ind)

  // Because terrain cost can be zero, going for a different approach
  for(let m=0;m<=or;m++){
    for(let i=0;i<trigger.length;i++){

      // WEST TILE
      tmpind = validMoveW(trigger[i], 0);
      if(tmpind >= 0){
        if(maprn[tmpind] == 0)
          maprn[tmpind] = maprn[trigger[i]]-1
        conveyor.push(tmpind)
      }

      // EAST TILE
      tmpind = validMoveE(trigger[i], 0);
      if(tmpind >= 0){
        if(maprn[tmpind] == 0)
          maprn[tmpind] = maprn[trigger[i]]-1
        conveyor.push(tmpind)
      }

      // NORTHWEST TILE
      tmpind = validMoveNW(trigger[i], 0);
      if(tmpind >= 0){
        if(maprn[tmpind] == 0)
          maprn[tmpind] = maprn[trigger[i]]-1
        conveyor.push(tmpind)
      }


      // NORTHEAST TILE
      tmpind = validMoveNE(trigger[i], 0);
      if(tmpind >= 0){
        if(maprn[tmpind] == 0)
          maprn[tmpind] = maprn[trigger[i]]-1
        conveyor.push(tmpind)
      }


      // SOUTHWEST TILE
      tmpind = validMoveSW(trigger[i], 0);
      if(tmpind >= 0){
        if(maprn[tmpind] == 0)
          maprn[tmpind] = maprn[trigger[i]]-1
        conveyor.push(tmpind)
      }


      // SOUTHEAST TILE
      tmpind = validMoveSE(trigger[i], 0);
      if(tmpind >= 0){
        if(maprn[tmpind] == 0)
          maprn[tmpind] = maprn[trigger[i]]-1
        conveyor.push(tmpind)
      }

      // If you are in the inner range, negate yourself
      if(m<=ir){
        maprn[trigger[i]] = -1
      }
    }

    // Then we transfer the unique values
    let s = new Set(conveyor)
    trigger = [...s]
    conveyor = []

  }

  return maprn
}

function clearRange(){

  let maprn = []

  for(let i=0; i<mapid.length;i++){
    maprn[i] = 0
  }

  return maprn
}

// -------------------------------
// MAP PATH FUNCTIONS
// -------------------------------

// This whole damn thing needs to be redone
// Check the plan on the sheet
function makeUnitPath(uind, x, y){

  // Each time we make a whole new path
  let npath = []

  // Tracks whether we found the tile
  let notile = 1

  // This is what we are trying to get to
  let ind = (y*mapsizex)+(x%mapsizex)
  //let uind = (unity[selunitid]*mapsizex)+(unitx[selunitid]%mapsizex)

  // If the path is empty, then we fill it with the first value and move on
  if (mpath.length == 0){
    //if(mpath[mpath.length-1] != uind)
    showUnitPath(x, y, 2);
    return;
  }

  // Make sure the path doesn't double back on itself
  let s = new Set(mpath)
  let tpath = [...s]
  if(tpath.length != mpath.length){
    console.log("Path Length", mpath.length, tpath.length)
    mpath = []
    return;
  }

  // If we have a pre-existing path, we are going to have to check it
  for (let i=0; i<mpath.length; i++){

    // Push in a new tile
    npath.push(mpath[i])

    // If the tile matches the destination, halt!
    if (mpath[i] == ind){
      notile = 0;
      break;
    }
  }

  // If we still haven't found the tile, we need to find the tile
  if (notile == 1){

    // This is just to prevent an infinite loop
    for(let i=0; i<mapid.length; i++){

      let pind = npath[npath.length-1]

      if(mapmv[pind] == 0){
        mpath = []
        return;
      }

      if(y < mapy[pind]){
        if(mapy[pind]%2==0 && x < mapx[pind])
          npath.push(((mapy[pind]-1)*mapsizex)+((mapx[pind]-1)%mapsizex))
        else if (mapy[pind]%2==1 && x > mapx[pind])
          npath.push(((mapy[pind]-1)*mapsizex)+((mapx[pind]+1)%mapsizex))
        else
          npath.push(((mapy[pind]-1)*mapsizex)+(mapx[pind]%mapsizex))
      }else if(y > mapy[pind]){
        if(mapy[pind]%2==0 && x < mapx[pind])
          npath.push(((mapy[pind]+1)*mapsizex)+((mapx[pind]-1)%mapsizex))
        else if (mapy[pind]%2==1 && x > mapx[pind])
          npath.push(((mapy[pind]+1)*mapsizex)+((mapx[pind]+1)%mapsizex))
        else
          npath.push(((mapy[pind]+1)*mapsizex)+(mapx[pind]%mapsizex))
      }else if(x < mapx[pind]){
        npath.push((mapy[pind]*mapsizex)+((mapx[pind]-1)%mapsizex))
      }else if(x > mapx[pind]){
        npath.push((mapy[pind]*mapsizex)+((mapx[pind]+1)%mapsizex))
      }else{
        break;
      }
    }

    // Let's see if the npath is valid
    if(npath.length > 0){
      let mlen = 0;
      for (let i=1; i<npath.length; i++){
        mlen += maptc[npath[i]]
      }

      // Make sure the path is terrain legal
      if (mlen > unitmv[selunitid]){
        mpath = []
        return;
      }
    }
  }

  // Final thing we do is make the new path (npath) the move path (mpath)
  mpath = npath;

}

function showUnitPath(x, y, opt=0){

  // Clear out the original stats
  let conveyor = []
  let tmpind = -1;
  let bestind = -1;
  let bestscr = -1;

  // An option to clear out the original path
  if(opt == 0)
    mpath = []

  // Convert the coordinates into
  let ind = (y*mapsizex)+(x%mapsizex)
  mpath.push(ind);

  // Always start off one way
  switchblade = 0

  // Only do this if we are sitting on a valid tile
  if(mapmv[ind] > 0){

    for (let i=0; i<mapid.length; i++){

      if (switchblade <= 0){
        // NORTHEAST
        tmpind = validMoveNE(ind, 2);
        if(tmpind >= 0)
          conveyor.push(tmpind)

        // EAST
        tmpind = validMoveE(ind, 2);
        if(tmpind >= 0)
          conveyor.push(tmpind)

        // SOUTHEAST
        tmpind = validMoveSE(ind, 2);
        if(tmpind >= 0)
          conveyor.push(tmpind)

        // SOUTHWEST
        tmpind = validMoveSW(ind, 2);
        if(tmpind >= 0){
          conveyor.push(tmpind)
          switchblade = 1
        }

        // WEST
        tmpind = validMoveW(ind, 2);
        if(tmpind >= 0){
          conveyor.push(tmpind)
          //switchblade = 1
        }

        // NORTHWEST
        tmpind = validMoveNW(ind, 2);
        if(tmpind >= 0){
          conveyor.push(tmpind)
          switchblade = 1
        }

      }else{

        // SOUTHWEST
        tmpind = validMoveSW(ind, 2);
        if(tmpind >= 0)
          conveyor.push(tmpind)

        // WEST
        tmpind = validMoveW(ind, 2);
        if(tmpind >= 0)
          conveyor.push(tmpind)

        // NORTHWEST
        tmpind = validMoveNW(ind, 2);
        if(tmpind >= 0)
          conveyor.push(tmpind)

        // NORTHEAST
        tmpind = validMoveNE(ind, 2);
        if(tmpind >= 0){
          conveyor.push(tmpind)
          switchblade = -1
        }

        // EAST
        tmpind = validMoveE(ind, 2);
        if(tmpind >= 0){
          conveyor.push(tmpind)
          //switchblade = -1
        }

        // SOUTHEAST
        tmpind = validMoveSE(ind, 2);
        if(tmpind >= 0){
          conveyor.push(tmpind)
          switchblade = -1
        }
      }


      // Print out the conveyor
      console.log("Path Conveyor", conveyor)

      // Make sure we aren't on top of the unit
      if(unitx[selunitid] == mapx[ind] && unity[selunitid] == mapy[ind]){
        break;
      }

      // Leave if we are in the highest number in the path
      else if(conveyor.length == 0){
        break;
      }

      // Let's first just get the path if it is straight forward
      else if(conveyor.length < 3){
        ind = (mapmv[conveyor[1]] > mapmv[conveyor[0]]) ? conveyor[1] : conveyor[0];
      }

      else{
        bestind = -1;
        bestscr = -1;
        let tmpscr = 0;

        for(let j=0; j<conveyor.length; j++){
          tmpscr = 0;

          if (mapmv[conveyor[j]] > mapmv[ind])
            tmpscr += 100;
          if (mapmv2[conveyor[j]] > mapmv2[ind])
            tmpscr += (mapmv2[conveyor[j]] > mapmv2[ind])

          if(tmpscr > bestscr){
            bestind = conveyor[j];
            bestscr = tmpscr;
            console.log("BEST SCORE", bestscr, "-", bestind)
            console.log("CONVEYOR", conveyor)
          }
        }

        ind = bestind;
      }

      // Push it onto the path
      mpath.push(ind)
      conveyor = []
    }

    if(opt == 2)
      mpath.reverse()
  }
}


// -------------------------------
// POLYGON FUNCTIONS
// -------------------------------

function getPolyVerts(sides, radius, startX=false){

  let ngon = []

  // Deals with the line
  if (sides == 2){
    if (startX){
      ngon.push([radius,0])
      ngon.push([-radius,0])
    }else{
      ngon.push([0, radius])
      ngon.push([0, -radius])
    }
  }
  // Deals with the diamond
  else if (sides == 4){
    if (startX){
      ngon.push([radius, 0])
      ngon.push([0, -radius])
      ngon.push([-radius, 0])
      ngon.push([0, radius])
    }else{
      ngon.push([0, radius])
      ngon.push([radius, 0])
      ngon.push([0, -radius])
      ngon.push([-radius, 0])
    }
  }
  // Deals with eveything else
  else if (sides >= 3){
    var angle = ((Math.PI * 2)/sides);
    if (startX) {
      ngon.push([radius, 0])
      for (let i=1; i<sides; i++)
        ngon.push([parseInt(radius*Math.cos(angle*i)), parseInt(radius*Math.sin(angle*i))])
    }else{
      ngon.push([0, radius])
      for (let i=1; i<sides; i++)
        ngon.push([parseInt(radius*Math.sin(angle*i)), parseInt(radius*Math.cos(angle*i))])
    }
  }

  return ngon
}

function getPolySize(ngon){

  let lowx = 0
  let highx = 0
  let lowy = 0
  let highy = 0

  for(let i=0; i<ngon.length; i++){
    if(lowx > ngon[i][0])
      lowx = ngon[i][0];
    if(highx < ngon[i][0])
      highx = ngon[i][0];
    if(lowy > ngon[i][1])
      lowy = ngon[i][1];
    if(highy < ngon[i][1])
      highy = ngon[i][1];
  }

  return [highx-lowx,highy-lowy]
}
