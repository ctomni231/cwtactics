import { input, state, loop, view } from "./engine/screenstate.js"
// import * as jslix from "./engine/js/jslix.js"

/*
 * Custom Wars Tactics - Tile Map Engine
 */

export const name = "CWTMAP"

// Let's define all the constants of this engine under one function
export const cwtmap = {

  // In case we ever need different map types ;P
  boxmap: true,
  color: [],

  // The literal state of the map for controlling actions
  state: 0,
  confirm: 0,

  // These keep track of user actions
  mactive: 1,
  action: false,
  atrig: 0,
  mtrig: 0,

  // These keep track of user position
  userx: 0,
  usery: 0,
  pastx: 0,
  pasty: 0,
  keyblade: 0,

  // Move snake path highlight
  mpath: [],

  // These hold the measurements for the starting map sizes
  boxPixels: 24,
  hexPixels: 16,
  boxVerts: [],
  hexVerts: [],
  boxSize: [],
  hexSize: [],

  // These are the internal map functions
  posx: 0,
  posy: 0,
  sizex: 0,
  sizey: 0,

  // These are the terrain elements of the map
  tid: [],
  tx: [],
  ty: [],
  tc: [],
  mv: [],
  mv2: [],
  atk: [],
  sl: []
}

// Let's define all the unit elements of the units
export const cwtunit = {
  seluid: -1,

  uid: [],
  color: [],
  ux: [],
  uy: [],
  sel: [],
  mv: [],

  // These are for unit specific values
  hp: [],
  at: [],
  or: [],
  ir: []
}

export function init(){

  // Holds the box map variables
  cwtmap.boxVerts = getPolyVerts(1, cwtmap.boxPixels, false)
  cwtmap.boxSize = getPolySize(cwtmap.boxVerts)

  // Holds the hex map variables
  cwtmap.hexVerts = getPolyVerts(6, cwtmap.hexPixels, false)
  cwtmap.hexSize = getPolySize(cwtmap.hexVerts)

  // Holds the various colors used in the map
  cwtmap.color.push('#B6FF00') // Plain color
  cwtmap.color.push('#007F7F') // Move color
  cwtmap.color.push('red') // Attack Color
  cwtmap.color.push('gray') // Null color

  // Holds the various player colors in the map
  cwtunit.color.push('red');
  cwtunit.color.push('blue');
  cwtunit.color.push('yellow');
  cwtunit.color.push('green');
  cwtunit.color.push('purple');
}

export function update(){

  // This handles the action presses
  cwtmap.mactive = input.MOUSE;

  if (input.CANCEL || input.ACTION) {
    cwtmap.action = true
    cwtmap.atrig += 1;
  }else if (input.LEFT || input.RIGHT || input.UP || input.DOWN) {
    cwtmap.action = true
    cwtmap.mtrig += 1;
  }else if(cwtmap.action){
    cwtmap.action = false
    cwtmap.atrig = 0;
    cwtmap.mtrig = 0;
  }

  // Cursor is handled in its own function
  mapCursor()

  // State controller makes sure actions are contained
  if (cwtmap.state == 0)
    restState()
  else if (cwtmap.state == 1)
    moveState()

}

export function render(canvas, ctx){

  // If the map has a size, then show it
  if (cwtmap.tid.length > 0){

    // Draw the map
    drawMap(ctx, cwtmap.mv);

    // Draw the units
    drawUnit(ctx);

    // Draw the path
    if (cwtunit.seluid >= 0)
      drawPath(ctx);

    // Draw the silo range
    drawSilo(ctx);

    // Draw the cursor
    drawCursor(ctx);

    // Draw the text
    // drawTileText(ctx, cwtmap.sl);

    // Draw a temporary dot
    drawDotTemp(ctx);

    // Just to see a number
    //ctx.fillText(input.TOUCH, 100, 10);
    //ctx.fillText(cwtunit.seluid, 100, 20);
    //ctx.fillText(cwtmap.confirm, 100, 30);

  }

}

// ----------------------------
// MAP CREATION FUNCTIONS
// ----------------------------

// This function set the map position
export function setMapPosition(posx, posy){
  cwtmap.posx = posx;
  cwtmap.posy = posy;
}

// The basic Create Map function for creating a normal map
export function createMap(sizex, sizey, data=[], defid=0, deftc=1){

  // Make sure the map size values are valid values
  cwtmap.sizex = (sizex > 0) ? sizex : 0;
  cwtmap.sizey = (sizey > 0) ? sizey : 0;

  // Create a temporary storage for data
  let tmpdata = []

  // Create the map to the specifications
  for(let i=0; i<cwtmap.sizey; i++){
    for(let j=0; j<cwtmap.sizex; j++){
      // We will stack the default values in a temp variable
      tmpdata = [defid, deftc] // You can also push variable on later
      if ((i*cwtmap.sizex)+(j%cwtmap.sizex) < data.length){

        // Pull all the tmpdata you can from the data
        for(let k=0; k<data.length; k++)
          tmpdata[k] = data[k]

          // Breaks out if we don't have enough data
          if (k+1 == tmpdata.length)
            break;
      }

      // Create the terrain
      createTerrain(tmpdata[0], j, i, tmpdata[1]);
    }
  }
}

// This creates a map with a NULL border around it (for testing)
export function createNullBorderMap(sizex, sizey, defid=0){

  // Make sure the map size values are valid values
  cwtmap.sizex = (sizex > 0) ? sizex : 0;
  cwtmap.sizey = (sizey > 0) ? sizey : 0;

  // Create the map to the specifications
  for(let i=0; i<cwtmap.sizey; i++){
    for(let j=0; j<cwtmap.sizex; j++){
      if (i==0 || j==0 || i==cwtmap.sizey-1 || j==cwtmap.sizex-1)
        createTerrain(defid, j, i, 0);
      else
        createTerrain(defid, j, i, 1);
    }
  }
}

// This function clears out the map
export function clearMap(){
  cwtmap.sizex = 0;
  cwtmap.sizey = 0;
  cwtmap.tid = [];
  cwtmap.tx = [];
  cwtmap.ty = [];
  cwtmap.tc = [];
  cwtmap.mv = [];
  cwtmap.mv2 = [];
  cwtmap.atk = [];
}

// -----------------------------
// CREATION FUNCTIONS
// -----------------------------

// This function creates terrain within the map
export function createTerrain(id, px, py, tc){
  cwtmap.tid.push(id);
  cwtmap.tx.push(px);
  cwtmap.ty.push(py);
  cwtmap.tc.push(tc);

  cwtmap.mv.push(0);
  cwtmap.mv2.push(0);
  cwtmap.atk.push(0);
  cwtmap.sl.push(0);
}

// This function creates units within the map
export function createUnit(id, px, py, hp, mv, at, or, ir){
  cwtunit.uid.push(id);
  cwtunit.ux.push(px);
  cwtunit.uy.push(py);
  cwtunit.mv.push(mv);

  cwtunit.hp.push(hp);
  cwtunit.at.push(at);
  cwtunit.or.push(or);
  cwtunit.ir.push(ir);

  cwtunit.sel.push(0);
}

// -----------------------------
// PRIVATE FUNCTIONS
// -----------------------------

// -----------------------------
// MAP FUNCTIONS
// -----------------------------

function showMove(rng, x, y){

  // Convert the coordinates into a tile index
  let ind = (y*cwtmap.sizex)+(x%cwtmap.sizex)

  // Project ripple is a go
  let tmpind = -1;
  let trigger = []
  let conveyor = []

  // The space we are on has the biggest number
  cwtmap.mv[ind] = rng+1;
  cwtmap.mv2[ind] = cwtmap.tid.length;
  trigger.push(ind)

  // Because terrain cost can be zero, going for a different approach
  while(trigger.length > 0){
    for(let i=0; i<trigger.length; i++){

      // WEST TILE
      tmpind = validMoveW(trigger[i], 1);
      if(tmpind >= 0)
        conveyor.push(tmpind)

      // EAST TILE
      tmpind = validMoveE(trigger[i], 1);
      if(tmpind >= 0)
        conveyor.push(tmpind)

      // If the map has a square tile set
      if (cwtmap.boxmap){

        // NORTH TILE
        tmpind = validMoveN(trigger[i], 1);
        if(tmpind >= 0)
          conveyor.push(tmpind)

        // SOUTH TILE
        tmpind = validMoveS(trigger[i], 1);
        if(tmpind >= 0)
          conveyor.push(tmpind)

      }

      // If the map has a hexagon tile set
      else {

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
    }

    // Then we transfer the unique values
    let s = new Set(conveyor)
    trigger = [...s]
    conveyor = []
  }
}

function clearMove(){
  for (let i=0; i<cwtmap.tid.length; i++){
    cwtmap.mv[i] = 0;
    cwtmap.mv2[i] = 0;
  }
}

function showRange(maprn, x, y, or=1, ir=0, paint=false){

  // Make sure the maprn has the correct amount of items
  if (maprn.length != cwtmap.tid.length){
    maprn = []
    for(let i=0; i<cwtmap.tid.length; i++)
      maprn.push(0);
  }

  // We only clear out field if paint is false
  else if (!paint){
    for(let i=0; i<cwtmap.tid.length; i++)
      maprn[i] = 0;
  }

  // Convert the coordinates into an index
  let ind = (y*cwtmap.sizex)+(x%cwtmap.sizex)

  // Project ripple is a go
  let tmpind = -1;
  let trigger = []
  let conveyor = []

  // The space we are on has the biggest number
  maprn[ind] = or+1;
  trigger.push(ind)

  // Because terrain cost can be zero, going for a different approach
  for(let m=0; m<=or; m++){
    for(let i=0; i<trigger.length; i++){
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

      // If the map has a square tile set
      if (cwtmap.boxmap){

        // NORTH TILE
        tmpind = validMoveN(trigger[i], 0);
        if(tmpind >= 0){
          if(maprn[tmpind] == 0)
            maprn[tmpind] = maprn[trigger[i]]-1
          conveyor.push(tmpind)
        }

        // SOUTH TILE
        tmpind = validMoveS(trigger[i], 0);
        if(tmpind >= 0){
          if(maprn[tmpind] == 0)
            maprn[tmpind] = maprn[trigger[i]]-1
          conveyor.push(tmpind)
        }
      }

      // If the map has a hexagon tile set
      else {

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
      }

      // If you are in the inner range, negate yourself
      if(m <= ir)
        maprn[trigger[i]] = -1
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
  for(let i=0; i<cwtmap.tid.length; i++)
    maprn.push(0)
  return maprn
}

// -----------------------------
// MAP PATH FUNCTIONS
// -----------------------------

// This whole damn thing was redone with the plan on the sheet
// This function allows the cursor to direct the path
function makeUnitPath(uind, x, y){

  // Each time we make a whole new path
  let npath = []

  // Tracks whether we found the tile
  let notile = 1

  // This is what we are trying to get to
  let ind = (y*cwtmap.sizex)+(x%cwtmap.sizex)

  // If the path is empty, then we fill it with the first value and move on
  if (cwtmap.mpath.length == 0){
    showUnitPath(x, y, 2);
    return;
  }

  // Make sure the path doesn't double back on itself
  let s = new Set(cwtmap.mpath)
  let tpath = [...s]
  if(tpath.length != cwtmap.mpath.length){
    cwtmap.mpath = []
    return;
  }

  // If we have a pre-existing path, we are going to have to check it
  for (let i=0; i<cwtmap.mpath.length; i++){

    // Push in a new tile
    npath.push(cwtmap.mpath[i])

    // If the tile matches the destination, halt!
    if (cwtmap.mpath[i] == ind){
      notile = 0;
      break;
    }
  }

  // If we still haven't found the tile, we need to find the tile
  if (notile == 1){

    // This is just to prevent an infinite loop
    for(let i=0; i<cwtmap.tid.length; i++){

      let pind = npath[npath.length-1]

      if(cwtmap.mv[pind] == 0){
        cwtmap.mpath = []
        return;
      }

      if (cwtmap.boxmap){
        if(y < cwtmap.ty[pind])
          npath.push(((cwtmap.ty[pind]-1)*cwtmap.sizex)+(cwtmap.tx[pind]%cwtmap.sizex))
        else if(y > cwtmap.ty[pind])
          npath.push(((cwtmap.ty[pind]+1)*cwtmap.sizex)+(cwtmap.tx[pind]%cwtmap.sizex))
        else if(x < cwtmap.tx[pind])
          npath.push((cwtmap.ty[pind]*cwtmap.sizex)+((cwtmap.tx[pind]-1)%cwtmap.sizex))
        else if(x > cwtmap.tx[pind])
          npath.push((cwtmap.ty[pind]*cwtmap.sizex)+((cwtmap.tx[pind]+1)%cwtmap.sizex))
        else
          break;
      }else{
        if(y < cwtmap.ty[pind]){
          if(cwtmap.ty[pind]%2==0 && x < cwtmap.tx[pind])
            npath.push(((cwtmap.ty[pind]-1)*cwtmap.sizex)+((cwtmap.tx[pind]-1)%cwtmap.sizex))
          else if (cwtmap.ty[pind]%2==1 && x > cwtmap.tx[pind])
            npath.push(((cwtmap.ty[pind]-1)*cwtmap.sizex)+((cwtmap.tx[pind]+1)%cwtmap.sizex))
          else
            npath.push(((cwtmap.ty[pind]-1)*cwtmap.sizex)+(cwtmap.tx[pind]%cwtmap.sizex))
        }else if(y > cwtmap.ty[pind]){
          if(cwtmap.ty[pind]%2==0 && x < cwtmap.tx[pind])
            npath.push(((cwtmap.ty[pind]+1)*cwtmap.sizex)+((cwtmap.tx[pind]-1)%cwtmap.sizex))
          else if (cwtmap.ty[pind]%2==1 && x > cwtmap.tx[pind])
            npath.push(((cwtmap.ty[pind]+1)*cwtmap.sizex)+((cwtmap.tx[pind]+1)%cwtmap.sizex))
          else
            npath.push(((cwtmap.ty[pind]+1)*cwtmap.sizex)+(cwtmap.tx[pind]%cwtmap.sizex))
        }else if(x < cwtmap.tx[pind])
          npath.push((cwtmap.ty[pind]*cwtmap.sizex)+((cwtmap.tx[pind]-1)%cwtmap.sizex))
        else if(x > cwtmap.tx[pind])
          npath.push((cwtmap.ty[pind]*cwtmap.sizex)+((cwtmap.tx[pind]+1)%cwtmap.sizex))
        else
          break;
      }

    }

    // Let's see if the npath is valid
    if(npath.length > 0){
      let mlen = 0;
      for (let i=1; i<npath.length; i++){
        mlen += cwtmap.tc[npath[i]]
      }

      // Make sure the path is terrain legal
      if (mlen > cwtunit.mv[cwtunit.seluid]){
        cwtmap.mpath = []
        return;
      }
    }
  }

  // Final thing we do is make the new path (npath) the move path (mpath)
  cwtmap.mpath = npath;
}

// This function finds the "shortest" path it can
function showUnitPath(x, y, opt=0){

  // A unit must be selected for this to function
  if (cwtunit.seluid >= 0){

    // Clear out the original stats
    let conveyor = []
    let tmpind = -1;
    let bestind = -1;
    let bestscr = -1;

    // Always start off one way
    let switchblade = 0;

    // An option to clear out the original path
    if(opt == 0)
      cwtmap.mpath = [];

    // Convert the coordinates into
    let ind = (y*cwtmap.sizex)+(x%cwtmap.sizex)
    cwtmap.mpath.push(ind);

    // Only do this if we are sitting on a valid tile
    if(cwtmap.mv[ind] > 0){
      for (let i=0; i<cwtmap.tid.length; i++){

        // Do the Valid Move stuff Here
        if (cwtmap.boxmap){

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
        }else if (switchblade <= 0){

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
          if(tmpind >= 0)
            conveyor.push(tmpind)

          // NORTHWEST
          tmpind = validMoveNW(ind, 2);
          if(tmpind >= 0){
            conveyor.push(tmpind)
            switchblade = 1
          }

        } else {

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
          if(tmpind >= 0)
            conveyor.push(tmpind)

          // SOUTHEAST
          tmpind = validMoveSE(ind, 2);
          if(tmpind >= 0){
            conveyor.push(tmpind)
            switchblade = -1
          }
        }

        // Make sure we aren't on top of the unit
        if(cwtunit.ux[cwtunit.seluid] == cwtmap.tx[ind] && cwtunit.uy[cwtunit.seluid] == cwtmap.ty[ind])
          break;

        // Leave if we are in the highest number in the path
        else if(conveyor.length == 0)
          break;

        // Let's first just get the path if it is straight forward
        else if(conveyor.length < 3)
          ind = (cwtmap.mv[conveyor[1]] > cwtmap.mv[conveyor[0]]) ? conveyor[1] : conveyor[0];

        // Finds the best possible direction to go in the list of directions
        else{
          bestind = -1;
          bestscr = -1;
          let tmpscr = 0;

          for(let j=0; j<conveyor.length; j++){
            tmpscr = 0;

            // Factor in the small drip
            if (cwtmap.mv[conveyor[j]] > cwtmap.mv[ind])
              tmpscr += 100;
            // Factor in the large drip
            if (cwtmap.mv2[conveyor[j]] > cwtmap.mv2[ind])
              tmpscr += (cwtmap.mv2[conveyor[j]] > cwtmap.mv2[ind])
            // See which one is the best by score
            if(tmpscr > bestscr){
              bestind = conveyor[j];
              bestscr = tmpscr;
            }
          }
          // Store it as the best direction
          ind = bestind;
        }

        // Push it onto the path
        cwtmap.mpath.push(ind)
        conveyor = []
      }

      // This makes it so the path draws from the unit outwards
      if(opt == 2)
        cwtmap.mpath.reverse()
    }
  }
}

function clearPath(){
  cwtmap.mpath = []
}

// -----------------------------
// DRAWING FUNCTIONS
// -----------------------------

function drawMap(ctx){

  // A generic temporary color variable
  let intcolor = 0
  let px = 0
  let py = 0

  // Due to the outlines, have to draw the map first
  for(let i=0; i<cwtmap.tid.length; i++){

    // Depending on the map internals is what we'll use
    intcolor = 0;
    if (cwtmap.tc[i] == 0) // Null Tile
      intcolor = 3
    if (cwtmap.mv[i] > 0) // Movement
      intcolor = 1
    if (cwtmap.atk[i] > 0) // Attack
      intcolor = 2

    // Draw the actual map
    if (cwtmap.boxmap) {
      px = cwtmap.posx+(cwtmap.boxSize[0]*cwtmap.tx[i])
      py = cwtmap.posy+(cwtmap.boxSize[1]*cwtmap.ty[i])
    } else if (cwtmap.ty[i]%2==0) {
      px = cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[i])
      py = cwtmap.posy+parseInt((cwtmap.hexSize[1]*cwtmap.ty[i]*(3/4)))
      px += parseInt(cwtmap.hexSize[0]/2)
      py += parseInt(cwtmap.hexSize[1]/2)
    } else {
      px = cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[i]+parseInt(cwtmap.hexSize[0]/2))
      py = cwtmap.posy+parseInt((cwtmap.hexSize[1]*cwtmap.ty[i]*(3/4)))
      px += parseInt(cwtmap.hexSize[0]/2)
      py += parseInt(cwtmap.hexSize[1]/2)
    }
    drawPolyVerts(ctx, px, py, cwtmap.color[intcolor])
  }
}

function drawUnit(ctx, fillcolor='', strokecolor='black'){

  // A generic temporary color variable
  let tmpcolor = fillcolor
  let px = 0;
  let py = 0;
  let rd = 0;

  for(let i=0; i<cwtunit.uid.length; i++){

    if (fillcolor != "")
      tmpcolor = fillcolor;
    else if (cwtunit.color.length > 0)
      tmpcolor = cwtunit.color[0] // The eventual owner number
    ctx.fillStyle = tmpcolor
    ctx.strokeStyle = strokecolor;

    ctx.beginPath();

    if (cwtmap.boxmap) {
      px = cwtmap.posx+(cwtmap.boxSize[0]*cwtunit.ux[i])+parseInt(cwtmap.boxSize[0]/2)
      py = cwtmap.posy+(cwtmap.boxSize[1]*cwtunit.uy[i])+parseInt(cwtmap.boxSize[1]/2)
      rd = parseInt(cwtmap.boxSize[(cwtmap.boxSize[0] <= cwtmap.boxSize[1]) ? 0 : 1]/3)
    } else if (cwtunit.uy[i]%2==0) {
      px = cwtmap.posx+(cwtmap.hexSize[0]*cwtunit.ux[i])
      py = cwtmap.posy+parseInt((cwtmap.hexSize[1]*cwtunit.uy[i]*(3/4)))
      px += parseInt(cwtmap.hexSize[0]/2)
      py += parseInt(cwtmap.hexSize[1]/2)
      rd = parseInt(cwtmap.hexSize[(cwtmap.hexSize[0] <= cwtmap.hexSize[1]) ? 0 : 1]/3)
    } else {
      px = cwtmap.posx+(cwtmap.hexSize[0]*cwtunit.ux[i]+parseInt(cwtmap.hexSize[0]/2))
      py = cwtmap.posy+parseInt((cwtmap.hexSize[1]*cwtunit.uy[i]*(3/4)))
      px += parseInt(cwtmap.hexSize[0]/2)
      py += parseInt(cwtmap.hexSize[1]/2)
      rd = parseInt(cwtmap.hexSize[(cwtmap.hexSize[0] <= cwtmap.hexSize[1]) ? 0 : 1]/3)
    }

    ctx.arc(px, py, rd, 0, 2 * Math.PI);
    if (tmpcolor != "")
      ctx.fill();
    if (strokecolor != "")
      ctx.stroke();

    ctx.fillStyle = 'black';

    if (cwtmap.boxmap) {
      px = cwtmap.posx+(cwtmap.boxSize[0]*cwtunit.ux[i])+parseInt(cwtmap.boxSize[0]*3/8)
      py = cwtmap.posy+(cwtmap.boxSize[1]*cwtunit.uy[i])+parseInt(cwtmap.boxSize[1]*5/8)
    } else if (cwtunit.uy[i]%2==0) {
      px = cwtmap.posx+(cwtmap.hexSize[0]*cwtunit.ux[i])
      py = cwtmap.posy+parseInt((cwtmap.hexSize[1]*cwtunit.uy[i]*(3/4)))
      px += parseInt(cwtmap.hexSize[0]*13/32)
      py += parseInt(cwtmap.hexSize[1]*5/8)
    } else {
      px = cwtmap.posx+(cwtmap.hexSize[0]*cwtunit.ux[i]+parseInt(cwtmap.hexSize[0]/2))
      py = cwtmap.posy+parseInt((cwtmap.hexSize[1]*cwtunit.uy[i]*(3/4)))
      px += parseInt(cwtmap.hexSize[0]*13/32)
      py += parseInt(cwtmap.hexSize[1]*5/8)
    }

    ctx.fillText(i, px, py)
  }
}

function drawCursor(ctx, color='blue', width=3.0){
  ctx.lineWidth = width;
  if (cwtmap.boxmap)
    drawPolyVerts(ctx, cwtmap.posx+(cwtmap.userx*cwtmap.boxSize[0]), cwtmap.posy+(cwtmap.usery*cwtmap.boxSize[1]), '', color)
  else if (!cwtmap.boxmap && cwtmap.usery%2==0)
    drawPolyVerts(ctx, cwtmap.posx+(cwtmap.userx*cwtmap.hexSize[0])+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.usery*cwtmap.hexSize[1]*(3/4)+parseInt(cwtmap.hexSize[1]/2)), '', color)
  else if (!cwtmap.boxmap && cwtmap.usery%2==1)
    drawPolyVerts(ctx, cwtmap.posx+(cwtmap.userx*cwtmap.hexSize[0]+parseInt(cwtmap.hexSize[0])), cwtmap.posy+(cwtmap.usery*cwtmap.hexSize[1]*(3/4)+parseInt(cwtmap.hexSize[1]/2)), '', color)
  ctx.lineWidth = 1.0;
}

function drawPath(ctx, color='black', width=3.0){
  ctx.lineWidth = width;

  for(let i=0; i<cwtmap.mpath.length; i++){
    if (cwtmap.boxmap)
      drawPolyVerts(ctx, cwtmap.posx+(cwtmap.tx[cwtmap.mpath[i]]*cwtmap.boxSize[0]), cwtmap.posy+(cwtmap.ty[cwtmap.mpath[i]]*cwtmap.boxSize[1]), '', color)
    else if (!cwtmap.boxmap && cwtmap.ty[cwtmap.mpath[i]]%2==0)
      drawPolyVerts(ctx, cwtmap.posx+(cwtmap.tx[cwtmap.mpath[i]]*cwtmap.hexSize[0])+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.ty[cwtmap.mpath[i]]*cwtmap.hexSize[1]*(3/4)+parseInt(cwtmap.hexSize[1]/2)), '', color)
    else if (!cwtmap.boxmap && cwtmap.ty[cwtmap.mpath[i]]%2==1)
      drawPolyVerts(ctx, cwtmap.posx+(cwtmap.tx[cwtmap.mpath[i]]*cwtmap.hexSize[0]+parseInt(cwtmap.hexSize[0])), cwtmap.posy+(cwtmap.ty[cwtmap.mpath[i]]*cwtmap.hexSize[1]*(3/4)+parseInt(cwtmap.hexSize[1]/2)), '', color)
  }

  ctx.lineWidth = 1.0;
}

function drawSilo(ctx, color='white', width=3.0){

  // And the map outlines after
  for(let i=0; i<cwtmap.tid.length; i++){
    // We are testing the outline
    if (cwtmap.sl[i] > 0)
      drawOutline(ctx, cwtmap.sl, i, color, width)
  }
}

function drawOutline(ctx, maprn, ind, color='white', width=4.0){

  // Temporary variables
  let tmpind = -1;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;

  // Let's draw the borders
  ctx.beginPath();

  if (cwtmap.boxmap) {

    // NORTH
    if(cwtmap.ty[ind]-1 >= 0){
      tmpind = ((cwtmap.ty[ind]-1)*cwtmap.sizex)+(cwtmap.tx[ind]%cwtmap.sizex)
      if(maprn[tmpind] <= 0){
        ctx.moveTo(cwtmap.posx+(cwtmap.boxSize[0]*cwtmap.tx[ind])+cwtmap.boxVerts[0][0], cwtmap.posy+(cwtmap.boxSize[1]*cwtmap.ty[ind])+cwtmap.boxVerts[0][1]);
        ctx.lineTo(cwtmap.posx+(cwtmap.boxSize[0]*cwtmap.tx[ind])+cwtmap.boxVerts[1][0], cwtmap.posy+(cwtmap.boxSize[1]*cwtmap.ty[ind])+cwtmap.boxVerts[1][1]);
      }
    }

    // SOUTH
    if(cwtmap.ty[ind]+1 < cwtmap.sizey){
      tmpind = ((cwtmap.ty[ind]+1)*cwtmap.sizex)+(cwtmap.tx[ind]%cwtmap.sizex)
      if(maprn[tmpind] <= 0){
        ctx.moveTo(cwtmap.posx+(cwtmap.boxSize[0]*cwtmap.tx[ind])+cwtmap.boxVerts[2][0], cwtmap.posy+(cwtmap.boxSize[1]*cwtmap.ty[ind])+cwtmap.boxVerts[2][1]);
        ctx.lineTo(cwtmap.posx+(cwtmap.boxSize[0]*cwtmap.tx[ind])+cwtmap.boxVerts[3][0], cwtmap.posy+(cwtmap.boxSize[1]*cwtmap.ty[ind])+cwtmap.boxVerts[3][1]);
      }
    }

    // WEST
    if(cwtmap.tx[ind]-1 >= 0){
      tmpind = (cwtmap.ty[ind]*cwtmap.sizex)+((cwtmap.tx[ind]-1)%cwtmap.sizex)
      if(maprn[tmpind] <= 0){
        ctx.moveTo(cwtmap.posx+(cwtmap.boxSize[0]*cwtmap.tx[ind])+cwtmap.boxVerts[3][0], cwtmap.posy+(cwtmap.boxSize[1]*cwtmap.ty[ind])+cwtmap.boxVerts[3][1]);
        ctx.lineTo(cwtmap.posx+(cwtmap.boxSize[0]*cwtmap.tx[ind])+cwtmap.boxVerts[0][0], cwtmap.posy+(cwtmap.boxSize[1]*cwtmap.ty[ind])+cwtmap.boxVerts[0][1]);
      }
    }

    // EAST
    if(cwtmap.tx[ind]+1 < cwtmap.sizex){
      tmpind = (cwtmap.ty[ind]*cwtmap.sizex)+((cwtmap.tx[ind]+1)%cwtmap.sizex)
      if(maprn[tmpind] <= 0){
        ctx.moveTo(cwtmap.posx+(cwtmap.boxSize[0]*cwtmap.tx[ind])+cwtmap.boxVerts[1][0], cwtmap.posy+(cwtmap.boxSize[1]*cwtmap.ty[ind])+cwtmap.boxVerts[1][1]);
        ctx.lineTo(cwtmap.posx+(cwtmap.boxSize[0]*cwtmap.tx[ind])+cwtmap.boxVerts[2][0], cwtmap.posy+(cwtmap.boxSize[1]*cwtmap.ty[ind])+cwtmap.boxVerts[2][1]);
      }
    }
  }

  // ALPHA
  else if (cwtmap.ty[ind]%2==0){

    // NORTHEAST
    if(cwtmap.ty[ind]-1 >= 0){
      tmpind = ((cwtmap.ty[ind]-1)*cwtmap.sizex)+(cwtmap.tx[ind]%cwtmap.sizex)
      if(maprn[tmpind] <= 0){
        ctx.moveTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind])+cwtmap.hexVerts[2][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[2][1]+parseInt(cwtmap.hexSize[1]/2))
        ctx.lineTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind])+cwtmap.hexVerts[3][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[3][1]+parseInt(cwtmap.hexSize[1]/2))
      }
    }

    // EAST
    if(cwtmap.tx[ind]+1 < cwtmap.sizex){
      tmpind = (cwtmap.ty[ind]*cwtmap.sizex)+((cwtmap.tx[ind]+1)%cwtmap.sizex)
      if(maprn[tmpind] <= 0){
        ctx.moveTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind])+cwtmap.hexVerts[1][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[1][1]+parseInt(cwtmap.hexSize[1]/2))
        ctx.lineTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind])+cwtmap.hexVerts[2][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[2][1]+parseInt(cwtmap.hexSize[1]/2))
      }
    }

    // SOUTHEAST
    if(cwtmap.ty[ind]+1 < cwtmap.sizey){
      tmpind = ((cwtmap.ty[ind]+1)*cwtmap.sizex)+(cwtmap.tx[ind]%cwtmap.sizex)
      if(maprn[tmpind] <= 0){
        ctx.moveTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind])+cwtmap.hexVerts[0][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[0][1]+parseInt(cwtmap.hexSize[1]/2))
        ctx.lineTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind])+cwtmap.hexVerts[1][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[1][1]+parseInt(cwtmap.hexSize[1]/2))
      }
    }

    // SOUTHWEST
    if(cwtmap.tx[ind]-1 >= 0 && cwtmap.ty[ind]+1 < cwtmap.sizey){
      tmpind = ((cwtmap.ty[ind]+1)*cwtmap.sizex)+((cwtmap.tx[ind]-1)%cwtmap.sizex)
      if(maprn[tmpind] <= 0){
        ctx.moveTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind])+cwtmap.hexVerts[5][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[5][1]+parseInt(cwtmap.hexSize[1]/2))
        ctx.lineTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind])+cwtmap.hexVerts[0][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[0][1]+parseInt(cwtmap.hexSize[1]/2))
      }
    }

    // WEST
    if(cwtmap.tx[ind]-1 >= 0){
      tmpind = (cwtmap.ty[ind]*cwtmap.sizex)+((cwtmap.tx[ind]-1)%cwtmap.sizex)
      if(maprn[tmpind] <= 0){
        ctx.moveTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind])+cwtmap.hexVerts[4][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[4][1]+parseInt(cwtmap.hexSize[1]/2))
        ctx.lineTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind])+cwtmap.hexVerts[5][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[5][1]+parseInt(cwtmap.hexSize[1]/2))
      }
    }

    // NORTHWEST
    if(cwtmap.tx[ind]-1 >= 0 && cwtmap.ty[ind]-1 >= 0){
      tmpind = ((cwtmap.ty[ind]-1)*cwtmap.sizex)+((cwtmap.tx[ind]-1)%cwtmap.sizex)
      if(maprn[tmpind] <= 0){
        ctx.moveTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind])+cwtmap.hexVerts[3][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[3][1]+parseInt(cwtmap.hexSize[1]/2))
        ctx.lineTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind])+cwtmap.hexVerts[4][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[4][1]+parseInt(cwtmap.hexSize[1]/2))
      }
    }
  }

  // BETA
  else {

    // NORTHEAST
    if(cwtmap.tx[ind]+1 < cwtmap.sizex && cwtmap.ty[ind]-1 >= 0){
      tmpind = ((cwtmap.ty[ind]-1)*cwtmap.sizex)+((cwtmap.tx[ind]+1)%cwtmap.sizex)
      if(maprn[tmpind] <= 0){
        ctx.moveTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind]+parseInt(cwtmap.hexSize[0]/2))+cwtmap.hexVerts[2][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[2][1]+parseInt(cwtmap.hexSize[1]/2))
        ctx.lineTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind]+parseInt(cwtmap.hexSize[0]/2))+cwtmap.hexVerts[3][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[3][1]+parseInt(cwtmap.hexSize[1]/2))
      }
    }

    // EAST
    if(cwtmap.tx[ind]+1 < cwtmap.sizex){
      tmpind = (cwtmap.ty[ind]*cwtmap.sizex)+((cwtmap.tx[ind]+1)%cwtmap.sizex)
      if(maprn[tmpind] <= 0){
        ctx.moveTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind]+parseInt(cwtmap.hexSize[0]/2))+cwtmap.hexVerts[1][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[1][1]+parseInt(cwtmap.hexSize[1]/2))
        ctx.lineTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind]+parseInt(cwtmap.hexSize[0]/2))+cwtmap.hexVerts[2][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[2][1]+parseInt(cwtmap.hexSize[1]/2))
      }
    }

    // SOUTHEAST
    if(cwtmap.tx[ind]+1 < cwtmap.sizex && cwtmap.ty[ind]+1 < cwtmap.sizey){
      tmpind = ((cwtmap.ty[ind]+1)*cwtmap.sizex)+((cwtmap.tx[ind]+1)%cwtmap.sizex)
      if(maprn[tmpind] <= 0){
        ctx.moveTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind]+parseInt(cwtmap.hexSize[0]/2))+cwtmap.hexVerts[0][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[0][1]+parseInt(cwtmap.hexSize[1]/2))
        ctx.lineTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind]+parseInt(cwtmap.hexSize[0]/2))+cwtmap.hexVerts[1][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[1][1]+parseInt(cwtmap.hexSize[1]/2))
      }
    }

    // SOUTHEAST
    if(cwtmap.ty[ind]+1 < cwtmap.sizey){
      tmpind = ((cwtmap.ty[ind]+1)*cwtmap.sizex)+(cwtmap.tx[ind]%cwtmap.sizex)
      if(maprn[tmpind] <= 0){
        ctx.moveTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind]+parseInt(cwtmap.hexSize[0]/2))+cwtmap.hexVerts[5][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[5][1]+parseInt(cwtmap.hexSize[1]/2))
        ctx.lineTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind]+parseInt(cwtmap.hexSize[0]/2))+cwtmap.hexVerts[0][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[0][1]+parseInt(cwtmap.hexSize[1]/2))
      }
    }

    // WEST
    if(cwtmap.tx[ind]-1 >= 0){
      tmpind = (cwtmap.ty[ind]*cwtmap.sizex)+((cwtmap.tx[ind]-1)%cwtmap.sizex)
      if(maprn[tmpind] <= 0){
        ctx.moveTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind]+parseInt(cwtmap.hexSize[0]/2))+cwtmap.hexVerts[4][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[4][1]+parseInt(cwtmap.hexSize[1]/2))
        ctx.lineTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind]+parseInt(cwtmap.hexSize[0]/2))+cwtmap.hexVerts[5][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[5][1]+parseInt(cwtmap.hexSize[1]/2))
      }
    }

    // NORTHWEST
    if(cwtmap.ty[ind]-1 >= 0){
      tmpind = ((cwtmap.ty[ind]-1)*cwtmap.sizex)+(cwtmap.tx[ind]%cwtmap.sizex)
      if(maprn[tmpind] <= 0){
        ctx.moveTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind]+parseInt(cwtmap.hexSize[0]/2))+cwtmap.hexVerts[3][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[3][1]+parseInt(cwtmap.hexSize[1]/2))
        ctx.lineTo(cwtmap.posx+(cwtmap.hexSize[0]*cwtmap.tx[ind]+parseInt(cwtmap.hexSize[0]/2))+cwtmap.hexVerts[4][0]+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.hexSize[1]*cwtmap.ty[ind]*(3/4))+cwtmap.hexVerts[4][1]+parseInt(cwtmap.hexSize[1]/2))
      }
    }
  }

  // End drawing the borders
  ctx.stroke();
  ctx.lineWidth = 1.0;
}

function drawTileText(ctx, mapsl){
  ctx.fillStyle = 'black';
  for(let i=0; i<cwtmap.tid.length; i++){
    if (cwtmap.boxmap)
      ctx.fillText(mapsl[i], cwtmap.posx+(cwtmap.tx[i]*cwtmap.boxSize[0]), cwtmap.posy+(cwtmap.ty[i]*cwtmap.boxSize[1]))
    else if (!cwtmap.boxmap && cwtmap.ty[i]%2==0)
      ctx.fillText(mapsl[i], cwtmap.posx+(cwtmap.tx[i]*cwtmap.hexSize[0])+parseInt(cwtmap.hexSize[0]/2), cwtmap.posy+(cwtmap.ty[i]*cwtmap.hexSize[1]*(3/4)+parseInt(cwtmap.hexSize[1]/2)))
    else if (!cwtmap.boxmap && cwtmap.ty[i]%2==1)
      ctx.fillText(mapsl[i], cwtmap.posx+(cwtmap.tx[i]*cwtmap.hexSize[0]+parseInt(cwtmap.hexSize[0])), cwtmap.posy+(cwtmap.ty[i]*cwtmap.hexSize[1]*(3/4)+parseInt(cwtmap.hexSize[1]/2)))
  }
}

function drawPolyVerts(ctx, px, py, fillcolor='white', strokecolor='black'){
  if (fillcolor != "")
    ctx.fillStyle = fillcolor;
  ctx.strokeStyle = strokecolor;
  ctx.beginPath();

  if (cwtmap.boxmap){
    for (let i=0; i<cwtmap.boxVerts.length; i++){
      if (i>0)
        ctx.lineTo(px+cwtmap.boxVerts[i][0], py+cwtmap.boxVerts[i][1]);
      else
        ctx.moveTo(px+cwtmap.boxVerts[i][0], py+cwtmap.boxVerts[i][1]);
    }
  } else {
    for (let i=0; i<cwtmap.hexVerts.length; i++){
      if (i>0)
        ctx.lineTo(px+cwtmap.hexVerts[i][0], py+cwtmap.hexVerts[i][1]);
      else
        ctx.moveTo(px+cwtmap.hexVerts[i][0], py+cwtmap.hexVerts[i][1]);
    }
  }

  ctx.closePath();
  if (fillcolor != "")
    ctx.fill();
  if (strokecolor != "")
    ctx.stroke();
}

// -----------------------------
// POLYGON FUNCTIONS
// -----------------------------

// Gets the multiple x and y axis points of a polygon shape
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
  // If not one of those, we make a normal box shape instead
  else {
    ngon.push([0,0])
    ngon.push([radius, 0])
    ngon.push([radius, radius])
    ngon.push([0, radius])
  }

  return ngon
}

// Puts a collision box around the polygon equal to its x and y axis size
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

// --------------------------
// VALID MOVE FUNCTIONS
// --------------------------

// Deals with all the possible directions
function validMoveN(ind, opt){
  let tmpind = -1;
  if(cwtmap.ty[ind]-1 >= 0){
    tmpind = ((cwtmap.ty[ind]-1)*cwtmap.sizex)+(cwtmap.tx[ind]%cwtmap.sizex);
    return validMove(ind, tmpind, opt);
  }
  return tmpind
}

function validMoveNW(ind, opt){
  let tmpind = -1;

  // ALPHA PATH
  if(cwtmap.ty[ind]%2==0){
    if(cwtmap.tx[ind]-1 >= 0 && cwtmap.ty[ind]-1 >= 0){
      tmpind = ((cwtmap.ty[ind]-1)*cwtmap.sizex)+((cwtmap.tx[ind]-1)%cwtmap.sizex)
      return validMove(ind, tmpind, opt);
    }
  }
  // BETA PATH
  else
    return validMoveN(ind, opt);

  return tmpind
}

function validMoveNE(ind, opt){
  let tmpind = -1;

  // ALPHA PATH
  if(cwtmap.ty[ind]%2==0)
    return validMoveN(ind, opt);
  // BETA PATH
  else{
    if(cwtmap.tx[ind]+1 < cwtmap.sizex && cwtmap.ty[ind]-1 >= 0){
      tmpind = ((cwtmap.ty[ind]-1)*cwtmap.sizex)+((cwtmap.tx[ind]+1)%cwtmap.sizex)
      return validMove(ind, tmpind, opt);
    }
  }

  return tmpind
}

function validMoveS(ind, opt){
  let tmpind = -1;
  if(cwtmap.ty[ind]+1 < cwtmap.sizey){
    tmpind = ((cwtmap.ty[ind]+1)*cwtmap.sizex)+(cwtmap.tx[ind]%cwtmap.sizex)
    return validMove(ind, tmpind, opt);
  }
  return tmpind
}

function validMoveSW(ind, opt){
  let tmpind = -1;

  // ALPHA PATH
  if(cwtmap.ty[ind]%2==0){
    if(cwtmap.tx[ind]-1 >= 0 && cwtmap.ty[ind]+1 < cwtmap.sizey){
      tmpind = ((cwtmap.ty[ind]+1)*cwtmap.sizex)+((cwtmap.tx[ind]-1)%cwtmap.sizex)
      return validMove(ind, tmpind, opt);
    }
  }
  // BETA PATH
  else
    return validMoveS(ind, opt);

  return tmpind
}

function validMoveSE(ind, opt){
  let tmpind = -1;

  // ALPHA PATH
  if(cwtmap.ty[ind]%2==0)
    return validMoveS(ind, opt);
  // BETA PATH
  else{
    if(cwtmap.tx[ind]+1 < cwtmap.sizex && cwtmap.ty[ind]+1 < cwtmap.sizey){
      tmpind = ((cwtmap.ty[ind]+1)*cwtmap.sizex)+((cwtmap.tx[ind]+1)%cwtmap.sizex)
      return validMove(ind, tmpind, opt);
    }
  }

  return tmpind
}

function validMoveW(ind, opt){
  let tmpind = -1;
  if(cwtmap.tx[ind]-1 >= 0){
    tmpind = (cwtmap.ty[ind]*cwtmap.sizex)+((cwtmap.tx[ind]-1)%cwtmap.sizex)
    return validMove(ind, tmpind, opt);
  }
  return tmpind
}

function validMoveE(ind, opt){
  let tmpind = -1;
  if(cwtmap.tx[ind]+1 < cwtmap.sizex){
    tmpind = (cwtmap.ty[ind]*cwtmap.sizex)+((cwtmap.tx[ind]+1)%cwtmap.sizex)
    return validMove(ind, tmpind, opt);
  }
  return tmpind
}

// Deals with all the options for valid move handling
function validMove(ind, tmpind, opt){

  if(opt == 1){
    if(cwtmap.mv[tmpind] < cwtmap.mv[ind]-cwtmap.tc[tmpind]){
      cwtmap.mv[tmpind] = cwtmap.mv[ind]-cwtmap.tc[tmpind];
      cwtmap.mv2[tmpind] = cwtmap.mv2[ind]-1;
    }else
      tmpind = -1;
  }
  else if(opt == 2 && cwtmap.mv2[ind] > cwtmap.mv2[tmpind])
    tmpind = -1;

  return tmpind
}

// --------------------------
// STATE FUNCTIONS
// --------------------------

function mapCursor(){

  // This is for mouse controls
  if (cwtmap.mactive){
    cwtmap.keyblade = 0;
    for(let i=0; i<cwtmap.sizex; i++){
      for(let j=0; j<cwtmap.sizey; j++){

        if((cwtmap.boxmap &&
          input.MOUSEX > cwtmap.posx+(cwtmap.boxSize[0]*i) &&
          input.MOUSEX < cwtmap.posx+cwtmap.boxSize[0]+(cwtmap.boxSize[0]*i) &&
          input.MOUSEY > cwtmap.posy+(cwtmap.boxSize[1]*j) &&
          input.MOUSEY < cwtmap.posy+cwtmap.boxSize[1]+(cwtmap.boxSize[1]*j)) ||
          (!cwtmap.boxmap && j%2==0 &&
          input.MOUSEX > cwtmap.posx+(cwtmap.hexSize[0]*i) &&
          input.MOUSEX < cwtmap.posx+(cwtmap.hexSize[0]*i)+cwtmap.hexSize[0] &&
          input.MOUSEY > cwtmap.posy+(cwtmap.hexSize[1]*j*(3/4)) &&
          input.MOUSEY < cwtmap.posy+(cwtmap.hexSize[1]*j*(3/4))+cwtmap.hexSize[1]) ||
          (!cwtmap.boxmap && j%2==1 &&
          input.MOUSEX > cwtmap.posx+(cwtmap.hexSize[0]*i+parseInt(cwtmap.hexSize[0]/2)) &&
          input.MOUSEX < cwtmap.posx+(cwtmap.hexSize[0]*i+parseInt(cwtmap.hexSize[0]/2)+cwtmap.hexSize[0]) &&
          input.MOUSEY > cwtmap.posy+(cwtmap.hexSize[1]*j*(3/4)) &&
          input.MOUSEY < cwtmap.posy+(cwtmap.hexSize[1]*j*(3/4))+cwtmap.hexSize[1])) {

            if (cwtmap.atrig == 1){
              // See if you are pressing the same tile multiple times
              if (cwtmap.userx == i && cwtmap.usery == j)
                cwtmap.confirm += 1
            }

            // Set the cursor
            cwtmap.userx = i;
            cwtmap.usery = j;
            break;
        }
      }
    }
  }

  // This is for keyboard controls
  else if (cwtmap.mtrig%8 == 1){

    // Handles the right movement
    if (input.RIGHT && cwtmap.userx < cwtmap.sizex-1){
      if (!cwtmap.boxmap && cwtmap.keyblade <= 0)
        cwtmap.keyblade += 1;
      else
        cwtmap.userx += 1;
    }
    // Handles the left movement
    else if(input.LEFT && cwtmap.userx > 0){
      if (!cwtmap.boxmap && cwtmap.keyblade >= 0)
        cwtmap.keyblade -= 1;
      else
        cwtmap.userx -= 1;
    }
    // Handles the down movement
    else if (input.DOWN && cwtmap.usery < cwtmap.sizey-1){
      if (!cwtmap.boxmap){
        if (cwtmap.usery%2==0 && cwtmap.userx > 0 && cwtmap.keyblade==-1)
          cwtmap.userx -= 1;
        else if (cwtmap.usery%2==1 && cwtmap.userx < cwtmap.sizex-1 && cwtmap.keyblade==1)
          cwtmap.userx += 1;
      }
      cwtmap.usery += 1;
    }
    // Handles the up movement
    else if(input.UP && cwtmap.usery > 0){
      if (!cwtmap.boxmap){
        if (cwtmap.usery%2==0 && cwtmap.userx > 0 && cwtmap.keyblade==-1)
          cwtmap.userx -= 1;
        else if (cwtmap.usery%2==1 && cwtmap.userx < cwtmap.sizex-1 && cwtmap.keyblade==1)
          cwtmap.userx += 1;
      }
      cwtmap.usery -= 1;
    }
  }

  // If the pastx and pasty change, reset the confirm
  if (cwtmap.pastx != cwtmap.userx || cwtmap.pasty != cwtmap.usery){
    cwtmap.pastx = cwtmap.userx;
    cwtmap.pasty = cwtmap.usery;
    cwtmap.confirm = 0
  }
}

function restState(){

  // Switch the map type at will (for now)
  if(cwtmap.atrig == 1){
    if (input.ACTION){
      for(let i=0; i<cwtunit.uid.length; i++){
        if(cwtunit.ux[i] == cwtmap.userx && cwtunit.uy[i] == cwtmap.usery){
          cwtunit.seluid = i;
          showMove(cwtunit.mv[i], cwtunit.ux[i], cwtunit.uy[i]);
          cwtmap.state = 1;
          break;
        }
      }
    }
    else if (input.CANCEL)
      cwtmap.boxmap = !cwtmap.boxmap;
  }

  // PASSIVE - Clear out the silo
  cwtmap.sl = clearRange()
}

function moveState(){

  // Holds a temporary index
  let tmpind = -1;

  console.log("Goes here")

  // Switch the map type at will (for now)
  if(cwtmap.atrig == 1){
    if (input.ACTION){
      let place = 1;
      for(let i=0; i<cwtunit.uid.length; i++){
        if(cwtunit.ux[i] == cwtmap.userx && cwtunit.uy[i] == cwtmap.usery){
          tmpind = (cwtmap.usery*cwtmap.sizex)+(cwtmap.userx%cwtmap.sizex)
          if (cwtmap.mv[tmpind] > 0)
            place = 0;
          break;
        }
      }
      // For actually placing the unit
      if (place == 1){
        if ((!input.TOUCH) || (input.TOUCH && cwtmap.confirm > 1)){

          // Only move the unit if it is doing it legally
          tmpind = (cwtmap.usery*cwtmap.sizex)+(cwtmap.userx%cwtmap.sizex)
          if (cwtmap.mv[tmpind] > 0){
            cwtunit.ux[cwtunit.seluid] = cwtmap.userx;
            cwtunit.uy[cwtunit.seluid] = cwtmap.usery;
          }

          cwtunit.seluid = -1;
          clearMove();
          clearPath();
          cwtmap.state = 0;
        }
      }
    }
  }

  // PASSIVE - For handling displaying an attack range of a unit
  if (cwtunit.seluid >= 0){

    // Shows the unit path
    makeUnitPath(cwtunit.seluid, cwtmap.userx, cwtmap.usery)

    // Shows attack range if over a certain value
    if (cwtmap.confirm > 3)
      cwtmap.atk = showRange(cwtmap.atk, cwtunit.ux[cwtunit.seluid], cwtunit.uy[cwtunit.seluid], cwtunit.or[cwtunit.seluid], cwtunit.ir[cwtunit.seluid])
    else
      cwtmap.atk = clearRange()

    // Silo map thing
    if (cwtunit.at[cwtunit.seluid] == 0 && cwtunit.or[cwtunit.seluid] > 1)
      cwtmap.sl = showRange(cwtmap.sl, cwtmap.userx, cwtmap.usery, cwtunit.or[cwtunit.seluid], cwtunit.ir[cwtunit.seluid])
  }

}

// --------------------------
// TEMP FUNCTIONS
// --------------------------

// Draws a temporary dot
function drawDotTemp(ctx, px=cwtmap.posx, py=cwtmap.posy, strokecolor='red'){
  ctx.strokeStyle = strokecolor;
  ctx.beginPath();
  ctx.rect(px, py, 2, 2);
  ctx.stroke();
}
