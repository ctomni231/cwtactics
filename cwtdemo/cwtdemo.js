import { input, state, loop, view } from "./engine/screenstate.js"
import * as jslix from "./engine/js/jslix.js"

export const name = "CWTDEMO";

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

// Move snake path highlight
let selunitid = -1;
let mpath = [];

// Terrain items
// Map tracking as a list of arrays should make it easy to work with
let mapid = []
let mapx = []
let mapy = []
let maptc = []
// The small drip holder
let mapmv = []
// The big drip holder
let mapmv2 = []

// Unit items
let select = 0;
let unitid = []
let unitx = [];
let unity = [];
let unitsel = [];
let unitmv = [];

export function init(){

  // Create the map
  for(let i=0;i<mapsizey;i++){
    for(let j=0;j<mapsizex;j++){
      if (i==0 || j==0 || i==mapsizey-1 || j==mapsizex-1){
        createTerrain(1, j, i, 0);
      }else{
        createTerrain(1, j, i, 1);
      }
    }
  }

  // Create a few units
  createUnit(2, 0, 0, 3);
  createUnit(3, 6, 6, 5);
  createUnit(4, 10, 5, 2);

  //This is the move shader
  jslix.addCut(0,0,16,16);
  jslix.addImage("image/unitmove.png")
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
        if(input.MOUSEX > mapposx+(17*i) &&
           input.MOUSEX < mapposx+17+(17*i) &&
           input.MOUSEY > mapposy+17+(17*j) &&
           input.MOUSEY < mapposy+(17*2)+(17*j)){

            // Set the cursor
            userx = i;
            usery = j;
            break;
        }
      }
    }
  }

  // This is for keyboard controls
  else if(mtrig == 1){
    if (input.RIGHT && userx < mapsizex-1)
      userx += 1;
    else if(input.LEFT && userx > 0)
      userx -= 1;
    else if (input.DOWN && usery < mapsizey-1)
      usery += 1;
    else if(input.UP && usery > 0)
      usery -= 1;
  }

  // Let's move a unit around the map
  if(atrig == 1){
    for(let i=0; i<unitid.length; i++){
      if(select == 0 && unitsel[i] == 0 && unitx[i] == userx && unity[i] == usery){
        unitsel[i] = 1;
        selunitid = i;
        // When a unit gets selected, it's on like Donkey Kong
        showUnitMove(i, unitx[i], unity[i]);
        select = 1;
      }else if(input.CANCEL){
        unitsel[i] = 0;
        selunitid = 0;
        clearUnitMove();
        select = 0;
      }else if(unitsel[i] == 1){
        let place = 1;
        for(let j=0;j<unitid.length;j++){
          if(unitx[j] == userx && unity[j] == usery){
            place = 0;
            break;
          }
        }
        if(place == 1){
          unitx[i] = userx;
          unity[i] = usery;
          unitsel[i] = 0;
          selunitid = 0;
          select = 0;
          clearUnitMove();
        }
      }
    }
  }

  // If there is a selection, we automatically show the move path
  if(select == 1){
    // Let's also show the path
    makeUnitPath(userx, usery);
  }
}

export function render(canvas, ctx){

  // This should draw the terrain
  for(let i=0;i<mapid.length;i++){

    ctx.drawImage(jslix.getImg(mapid[i]), mapposx+(17*mapx[i]), mapposy+(17*mapy[i]));
    if(maptc[i] == 0){
      ctx.fillStyle = 'black';
      ctx.fillRect(mapposx+(mapx[i]*17), mapposy+17+(mapy[i]*17), 16, 16);
    }
    if(mapmv[i]>0)
      ctx.drawImage(jslix.getImg(0), mapposx+(17*mapx[i]), mapposy+17+(17*mapy[i]));
  }

  // Draw the units
  for(let i=0; i<unitid.length; i++){
    ctx.drawImage(jslix.getImg(unitid[i]), mapposx+(17*unitx[i])-8, mapposy+(17*unity[i])+8);
  }

  if (select == 0)
    ctx.strokeStyle = 'red';
  else if (select == 1){

    // Let's throw the move logic in here
    if(mpath.length > 0){
      ctx.strokeStyle = 'black';
      for(let i=0; i<mpath.length; i++){
        ctx.beginPath();
        ctx.rect(mapposx+(mapx[mpath[i]]*17)-1, mapposy+17+(mapy[mpath[i]]*17)-2, 18, 18)
        ctx.stroke();
      }
    }

    ctx.strokeStyle = 'blue';
  }

  ctx.beginPath();
  ctx.rect(mapposx+(userx*17)-1, mapposy+17+(usery*17)-2, 18, 18)
  ctx.stroke();

  //for(let i=0;i<mapid.length;i++){
  //  ctx.fillText(mapmv[i], mapposx+(17*mapx[i]), mapposy+(17*mapy[i])+(17*1.5));
  //}
}

//--------------------------------
// CREATION FUNCTIONS
// -------------------------------

function createTerrain(id, px, py, tc){
  mapid.push(id);
  mapx.push(px);
  mapy.push(py);
  maptc.push(tc);
  mapmv.push(0);
  mapmv2.push(0);
}

function createUnit(id, px, py, mv){
  unitid.push(id);
  unitx.push(px);
  unity.push(py);
  unitsel.push(0);
  unitmv.push(mv);
}

//----------------------------------
// VALID MOVE FUNCTIONS
//----------------------------------

function validMoveN(ind, opt){
  let tmpind = -1;
  if(mapy[ind]-1 >= 0){
    tmpind = ((mapy[ind]-1)*mapsizex)+(mapx[ind]%mapsizex)
    if(opt == 1){
      if(mapmv[tmpind] < mapmv[ind]-maptc[tmpind]){
        mapmv[tmpind] = mapmv[ind]-maptc[tmpind];
        mapmv2[tmpind] = mapmv2[ind]-1;
      }else
        tmpind = -1;
    }
    else if(opt == 2 && mapmv2[ind] > mapmv2[tmpind])
      tmpind = -1;
  }
  return tmpind
}

function validMoveS(ind, opt){
  let tmpind = -1;
  if(mapy[ind]+1 < mapsizey){
    tmpind = ((mapy[ind]+1)*mapsizex)+(mapx[ind]%mapsizex)
    if(opt == 1){
      if(mapmv[tmpind] < mapmv[ind]-maptc[tmpind]){
        mapmv[tmpind] = mapmv[ind]-maptc[tmpind];
        mapmv2[tmpind] = mapmv2[ind]-1;
      }else
        tmpind = -1;
    }
    else if(opt == 2 && mapmv2[ind] > mapmv2[tmpind])
      tmpind = -1;
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
    }
    else if(opt == 2 && mapmv2[ind] > mapmv2[tmpind])
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
    }
    else if(opt == 2 && mapmv2[ind] > mapmv2[tmpind])
      tmpind = -1;
  }
  return tmpind
}

//---------------------------------
// MAP FUNCTIONS
//---------------------------------

function showUnitMove(uind, x, y){

  // Convert the coordinates into
  let ind = (y*mapsizex)+(x%mapsizex)
  console.log("Map ID:", ind)

  //Project ripple is a go
  let tmpind = -1;
  let trigger = []
  let conveyor = []

  // The space we are on has the biggest number
  mapmv[ind] = unitmv[uind]+1;
  mapmv2[ind] = mapid.length;
  console.log("Map Move:", mapmv[ind]);
  trigger.push(ind)

  // Because terrain cost can be zero, going for a different approach
  //for(let m=0;m<mapmv[ind];m++){
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

      // NORTH TILE
      tmpind = validMoveN(trigger[i], 1);
      if(tmpind >= 0)
        conveyor.push(tmpind)

      // SOUTH TILE
      tmpind = validMoveS(trigger[i], 1);
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

  // Clear out the snake as well
  mpath = []
}


//----------------------------------
// MAP PATH FUNCTIONS
//----------------------------------

// This whole damn thing needs to be redone
// Check the plan on the sheet
function makeUnitPath(x, y){

  // Each time we make a whole new path
  let npath = []

  // Tracks whether we found the tile
  let notile = 1

  // This is what we are trying to get to
  let ind = (y*mapsizex)+(x%mapsizex)
  let uind = (unity[selunitid]*mapsizex)+(unitx[selunitid]%mapsizex)

  // If the path is empty, then we fill it with the first value and move on
  if (mpath.length == 0){
    //if(mpath[mpath.length-1] != uind)
    showUnitPath(x, y, 2);
    return;
  }

  // If we are where we need to be, why are we doing Stuff
  //else if(mpath[mpath.length-1] == ind)
  //  return;

  // Make sure the first piece of the path is the unit location
  //else if (mpath[0] != uind){
  //  mpath = []
  //  return;
  //}

  // We are not doing this if the movement is invalid
  //else if(mapmv[ind] == 0){
  //  npath.push(uind)
  //  return;
  //}

  // If the path is empty, then we fill it with the first value and move on
  //else if (mpath.length == 0){
    //npath.push((unity[selunitid]*mapsizex)+(unitx[selunitid]%mapsizex))
//    showUnitPath(x, y, 0);
//    return;
//  }

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
        npath.push(((mapy[pind]-1)*mapsizex)+(mapx[pind]%mapsizex))
      }else if(y > mapy[pind]){
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

      if (mlen > unitmv[selunitid]){
        mpath = []
        return;
      }

    }
  }

  // Final thing we do is make the new path (npath) the move path (mpath)
  mpath = npath;



  /*// If the length is too large, reset it
  if(mpath.length > 0){
    let mlen = 0;
    for (let i=1; i<mpath.length; i++){
      mlen += maptc[mpath[i]]
    }
    console.log("Length", mlen)

    // Path is too long, reset it
    if (mlen > unitmv[selunitid]){
      showUnitPath(x, y, 0);
    }
  }//*/

  // If we are on the tile, I think we can just quit out
  //let mind = mpath[mpath.length-1]
  //if (mind == ind){
  //  showUnitPath(x, y, 0);
  //  return;
//  }





  // If the path is empty, let's make a new path
  //if (mpath.length == 0){
  //  mpath.push(ind)
  //}


  // If the path has items in it, let's see if we've passed that spot before

  /*// Now we check all cardinal directions to see if the cursor is there
  let pind = mpath[mpath.length-1]

  // It can't include itself
  if(mpath.includes(ind)){
    showUnitPath(x, y, 0);
  }
  // ADD IN A MOVEMENT MARKER
  else if(mapy[ind] == mapy[pind]+1 || mapy[ind] == mapy[pind]-1 || mapx[ind] == mapx[pind]+1 || mapx[ind] == mapx[pind]-1){
    mpath.push(ind);
  }
  // This is the final result
  else if (mapy[ind] != mapy[pind] && mapx[ind] != mapx[pind]){
    showUnitPath(x, y, 0);
  }

  if (mpath.length > 0){
    let mlen = 0;
    for (let i=0; i<mpath.length; i++){
      mlen += maptc[mpath[i]]
    }
    console.log("Length")
    if (mlen > unitmv[selunitid]){
      showUnitPath(x, y, 0);
    }
  }//*/


  // Validate the path
  //let mset = [...new Set(mpath)]
  //if(mpath.length != mset.length){
  //  showUnitPath(x, y, 1)
  //}else{
    //for(let i = 0; i<=mapid.length; i++){

    //}
//  }

}

function showUnitPath(x, y, opt){

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

  // Only do this if we are sitting on a valid tile
  if(mapmv[ind] > 0){

    for (let i=0; i<mapid.length; i++){

      // NORTH
      tmpind = validMoveN(ind, 2);
      if(tmpind >= 0)
        conveyor.push(tmpind)

      // EAST
      tmpind = validMoveE(ind, 2);
      if(tmpind >= 0)
        conveyor.push(tmpind)

      // SOUTH
      tmpind = validMoveS(ind, 2);
      if(tmpind >= 0)
        conveyor.push(tmpind)

      // WEST
      tmpind = validMoveW(ind, 2);
      if(tmpind >= 0)
        conveyor.push(tmpind)

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
