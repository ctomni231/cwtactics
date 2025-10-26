import { input, state, loop, view } from "../engine/screenstate.js"
import * as jlib from "../engine/js/jsonlib.js"

/*
 * Custom Wars Tactics - Map Library
 *
 * The map library takes data from JSON files and turns them into cards
 * for consumption by other classes. This class is dynamic and can load
 * up information on the fly
 */

export const name = "CWTMAPLIB"

const prefix = "./data/"
const loadlist = "loadlist.json"
const url = prefix+loadlist;

// This gets the json map data
export const cwtmapjson = {
  load: 0,

  game: [],
  color: {},
  text: {},

  sect: {}
}

// This gets the map data and organizes it
export const cwtmap = {
  tracking: {},
  dfltracking: {},

  type: [""],
  file: [""],
  mod: [[]],
  auth: [[]],

  folders: [[]],
  tags: [[]],
  rules: [[]],

  width: [0],
  height: [0],
  player: [0],

  typemap: [[]],
  map: [[]],

  props: [[]],
  units: [[]],

  text: {}
}

// This gets the terrain data and organizes it
export const cwtterrain = {
  tracking: {},
  dfltracking: {},

  file: [""],
  code: [""],
  mod: [[]],
  auth: [[]],

  color: [""],
  stars: [0],
  vision: [[]],
  step: [0],
  hide: [[]],

  movecost: [{}],

  text: {}
}

// This gets the unit data and organizes it
export const cwtunit = {
  tracking: {},
  dfltracking: {},

  file: [""],
  code: [""],
  mod: [[]],
  auth: [[]],

  core: [""],
  hitpoints: [{}],
  build: [{}],
  move: [{}],
  vision: [{}],
  fuel: [{}],
  material: [0],
  starvalue: [0],

  weapons: [[]],
  abilities: [[]],
  tags: [[]],
  damage: [{}],
  load: [{}],

  text: {}
}

// This holds the terrain pack
export const cwtpack = {
}

// These are the map parts
export const cwtmapparts = {
  sectname: ["MAPS", "TERR", "UNIT"],
  loadname: ["map", "terrain", "unit"],
  foldname: ["maps/", "terrain/", "units/"],
  varname: [cwtmap, cwtterrain, cwtunit]
}

// -------------------------
// BASE FUNCTIONS
// -------------------------

export function init(){
  jlib.addFile(url);
}

export function update(){
  loadList();

  // Load data for everything in the map parts (easy to extend too)
  for (let i=0; i<cwtmapparts.sectname.length; i++)
    loadData(i);
}

export function render(canvas, ctx){
}

// -------------------------
// CHECK DATA READY
// -------------------------

// This checks if all the maps have been loaded into the system
export function isAllMapDataReady(){
  return (cwtmapjson.mapdone == 1);
}

// This checks if all the terrain have been loaded into the system
export function isAllTerrainDataReady(){
  return (cwtmapjson.terrdone == 1);
}

// This checks if all the unit have been loaded into the system
export function isAllUnitDataReady(){
  return (cwtmapjson.unitdone == 1);
}

// -------------------------
// LOADING FUNCTIONs
// -------------------------

// INIT - Loads up all the data in the loadlist file
function loadList() {

  // Load up the load list information
  if (cwtmapjson.load == 0){

    // Once the file is ready
    if (jlib.isReady(0)){
      cwtmapjson.load = jlib.getFile(0)

      // Put the game abbreviation information in here
      cwtmapjson.game = cwtmapjson.load.game;
      cwtmapjson.color = cwtmapjson.load.color;
      cwtmapjson.text = cwtmapjson.load.text;

      console.log("CWTLIB LOAD", cwtmapjson.game, cwtmapjson.color, cwtmapjson.text)

      // Let's make a dictionary out of the cwtmapparts
      for (let i=0; i<cwtmapparts.sectname.length; i++)
        loadSection(i)
    }
  }
}

// A simple function to load in many types of sections
function loadSection(ind){

  // Everything is going to be in one dictionary now
  let sectname = cwtmapparts.sectname[ind]
  let loadname = cwtmapparts.loadname[ind]

  // Create a new dictionary section
  let tmpdict = {
    temp: 0,
    file: [],
    data: [],
    ready: [],
    done: 0
  }

  // Create the new section for consumption
  cwtmapjson.sect[sectname] = tmpdict
  cwtmapjson.sect[sectname].file = cwtmapjson.load[loadname];
  if (cwtmapjson.sect[sectname].file === undefined)
    cwtmapjson.sect[sectname].file = []
}

// This will load data depending on the option selected
function loadData(ind) {

  // Everything is going to be in one dictionary now
  let sectname = cwtmapparts.sectname[ind]
  let loadname = cwtmapparts.loadname[ind]
  let folder = cwtmapparts.foldname[ind]

  // Load in the data if we haven't started filling in anything yet
  if (cwtmapjson.load != 0){

    // Hopefully, there will be no errors once the files are loaded
    if (cwtmapjson.sect[sectname].done == 0){

      // If there is no data in the system, then forget the whole thing
      if (cwtmapjson.sect[sectname].file.length == 0){
        console.log("CWT - MAP LIB: No "+loadname+"(s) in '"+loadlist+"' available")
        cwtmapjson.sect[sectname].done = 1
      }

      // As long as there is data not ready, we try to fill it
      else if (cwtmapjson.sect[sectname].ready.includes(0)){

        // Makes sure we are readying up all the files
        for (let i=0; i<cwtmapjson.sect[sectname].ready.length; i++) {
          if (cwtmapjson.sect[sectname].ready[i] == 0){
            if (jlib.isReady(prefix+folder+cwtmapjson.sect[sectname].file[i])) {
              cwtmapjson.sect[sectname].data[i] = jlib.getFile(prefix+folder+cwtmapjson.sect[sectname].file[i])
              cwtmapjson.sect[sectname].ready[i] = 1
            }
          }
        }
      }

      // If the ready is empty, let's start pulling in all the map data
      else if (cwtmapjson.sect[sectname].ready.length == 0){
        // This is where we should rapidfire load all the maps available
        for (let i=0; i<cwtmapjson.sect[sectname].file.length; i++) {
          jlib.addFile(prefix+folder+cwtmapjson.sect[sectname].file[i])
          console.log(prefix+folder+cwtmapjson.sect[sectname].file[i])
          cwtmapjson.sect[sectname].data.push("{}")
          cwtmapjson.sect[sectname].ready.push(0)
        }
      }

      // If every map is ready, then we are finished here
      else {
        console.log("CWT - MAP LIB: All "+cwtmapjson.sect[sectname].data.length+" "+loadname+"(s) loaded successfully!")
        cwtmapjson.sect[sectname].done = 1;

        // Organizes the map data right away
        organizeData(ind)
      }
    }
  }
}

function organizeData(ind) {

  // Everything is going to be in one dictionary now
  let sectname = cwtmapparts.sectname[ind]
  let varname = cwtmapparts.varname[ind]

  // Just in case we don't want to do this right away
  if (cwtmapjson.sect[sectname].done == 1){

    // Let's go through each file and parse out the data
    for (let i=0; i<cwtmapjson.sect[sectname].file.length; i++) {

      // This simplifies the part data
      let tmpdata = cwtmapjson.sect[sectname].data[i]
      let filedata = cwtmapjson.sect[sectname].file[i]

      // Tracks where we are in the mod
      let modtrack = 0

      // We should pull data from what we know, and use it to fill in things
      for (let item in varname) {

        if (item == 'text') {

          if (tmpdata[item] !== undefined)
              varname[item][filedata] = tmpdata[item]

        } else if (!item.includes('track')) {

          if (item == 'type')
            modtrack = varname[item].length

          // We will get and place the default values
          if (Object.keys(varname["tracking"]).length === 0){
            varname.dfltracking[item] = (varname[item].length > 0) ? varname[item][0] : undefined;
            varname[item] = []
            modtrack = 0
          }

          // There are mods where we have to check for data
          for (let mod in tmpdata){
            // Then we will take these items and organize them
            if (mod != 'text' || Object.keys(tmpdata).length === 1){
              if (item == 'file'){
                varname[item].push(filedata)
              } else if (item == 'code') {
                varname[item].push(
                  (filedata.includes('.')) ?
                  filedata.slice(0, filedata.lastIndexOf('.')) : filedata
                )
              }
              // The double check for "mod != text" is so it doesn't land in mod
              else if (item == 'mod' && mod != 'text') {
                let modlist = [mod]
                if (typeof varname.dfltracking[item] == typeof tmpdata[mod][item])
                  modlist = modlist.concat(tmpdata[mod][item])
                varname[item].push(modlist)
              } else {
                varname[item].push(
                  (typeof varname.dfltracking[item] == typeof tmpdata[mod][item]) ?
                  tmpdata[mod][item] : varname.dfltracking[item]
                )
              }
            }
          }
        }
      }

      varname.tracking[filedata] = modtrack
      console.log("MLIB ODATA", sectname, filedata, tmpdata, varname)
    }
  }

  console.log("MLIB FINAL", sectname, varname)
}

// -----------------------
// OTHER FUNCTIONS
// -----------------------

// Code by Simon Willison
function addLoadEvent(func) {
  let oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
    if (oldonload) {
      oldonload();
    }
      func();
    }
  }
}//*/
