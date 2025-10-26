import { input, state, loop, view } from "../engine/screenstate.js"
import * as jlib from "../engine/js/jsonlib.js"

/*
 * Custom Wars Tactics - Map Library
 */

 // We are going to make the text uin terrain organized the same best of Way
 // Then we are going to turn these data blocks into cards for use in the map

export const name = "CWTMAPLIBRARY"

const prefix = "./data/"
const url = prefix+"loadlist.json";

const mapfolder = "maps/"
const terrfolder = "terrain/"
const unitfolder = "units/"

// This gets the json map data
export const cwtmapjson = {
  load: 0,

  game: [],

  tmpmdata: 0,
  mapfile: [],
  mapdata: [],
  mapready: [],
  mapdone: 0,

  tmptdata: 0,
  terrfile: [],
  terrdata: [],
  terready: [],
  terrdone: 0,

  tmpudata: 0,
  unitfile: [],
  unitdata: [],
  unitready: [],
  unitdone: 0
}

// This gets the map data and organizes it
export const cwtmap = {

  tracking: {},
  modtracking: {},

  file: [],
  mod: [],
  auth: [],

  folders: [],
  tags: [],
  rules: [],

  width: [],
  height: [],
  player: [],

  typeMap: [],
  terrMap: [],
  data: [],

  props: [],
  units: [],

  text: {}
}

// This gets the terrain data and organizes it
export const cwtterrain = {

  tracking: {},
  modtracking: {},

  file: [],
  code: [],
  mod: [],
  auth: [],

  color: [],
  stars: [],
  vision: [],
  step: [],
  hide: [],

  movecost: [],

  text: {}
}

// This gets the terrain data and organizes it
export const cwtunit = {

  tracking: {},
  modtracking: {},

  file: [],
  code: [],
  mod: [],
  auth: [],

  core: [],
  hitpoints: [],
  build: [],
  move: [],
  vision: [],
  fuel: [],
  material: [],
  starvalue: [],

  weapons: [],
  ability: [],
  tags: [],
  damage: [],
  load: [],

  text: {}
}

// This holds the terrain pack
export const cwtpack = {
  terrdata: [],
  terrdatadict: {},

  terrtext: [],
  terrtextdict: {}
}

export function init(){
  jlib.addFile(url);
}

export function update(){
  loadList();
  loadMapData();
  loadTerrainData();
  loadUnitData();

  // Just to see if it eventually loads in the map file
  getStoredMapData("wrench_island.json");
}

export function render(canvas, ctx){
}

// -------------------------
// MAP FUNCTIONALITY
// --------------------------

// This checks if all the maps have been loaded into the system
export function isAllMapDataReady(){
  return (cwtmapjson.mapdone == 1);
}

// Gets a map according to the ID or the filename
export function getMapData(ind) {

   // Once the map files are loaded, send them out
  if (isAllMapDataReady()) {

    // This covers if you want to get the information by a filename
    if ( typeof ind === 'string' || ind instanceof String )
      ind = (isNaN(ind) ? cwtmapjson.mapfile.indexOf(ind) : parseInt(ind));

    // This pulls out the map data completely
    if (cwtmapjson.mapdata.length > ind)
      return cwtmapjson.mapdata[ind];
  }

  console.log("CWT - MAP LIBRARY: Error Loading Map")
  return "{}"
}

// Gets the amount of data in the map list
export function getMapDataLength() {
  return isAllMapDataReady() ? cwtmapjson.mapdata.length : 0;
}

// This stores a temporary map in the system until cleared out
export function getStoredMapData(ind=0) {

  if (isAllMapDataReady()) {
    if (cwtmapjson.tmpmdata == 0){
      cwtmapjson.tmpmdata = getMapData(ind);
      console.log("CWT - MAP LIBRARY: TMPDATA", ind, cwtmapjson.tmpmdata)
    }
  }

  return cwtmapjson.tmpmdata
}

// This resets a temporary map in the system so it can be used again
export function clearStoredMapData() {
  cwtmapjson.tmpmdata = 0
}

// -------------------------
// TERRAIN FUNCTIONALITY
// --------------------------

// This checks if all the terrain have been loaded into the system
export function isAllTerrainDataReady(){
  return (cwtmapjson.terrdone == 1);
}

// Gets a terrain according to the ID or the filename
export function getTerrainData(ind) {

  // Once the terrain files are loaded, send them out
  if (isAllTerrainDataReady()) {

    // This covers if you want to get the information by a filename
    if ( typeof ind === 'string' || ind instanceof String )
      ind = (isNaN(ind) ? cwtmapjson.terrfile.indexOf(ind) : parseInt(ind));

    // This pulls out the terrain data completely
    if (cwtmapjson.terrdata.length > ind)
      return cwtmapjson.terrdata[ind];
  }

  console.log("CWT - MAP LIBRARY: Error Loading Terrain")
  return "{}"
}

// This stores a temporary terrain in the system until cleared out
export function getStoredTerrainData(ind=0) {

  if (isAllTerrainDataReady()) {
    if (cwtmapjson.tmptdata == 0){
      cwtmapjson.tmptdata = getTerrainData(ind);
      console.log("CWT - MAP LIBRARY: TMPDATA", ind, cwtmapjson.tmptdata)
    }
  }

  return cwtmapjson.tmptdata
}

// This resets a temporary map in the system so it can be used again
export function clearStoredTerrainData() {
  cwtmapjson.tmptdata = 0
}

// -------------------------
// UNIT FUNCTIONALITY
// --------------------------

// This checks if all the unit have been loaded into the system
export function isAllUnitDataReady(){
  return (cwtmapjson.unitdone == 1);
}

// Gets a unit according to the ID or the filename
export function getUnitData(ind) {

   // Once the unit files are loaded, send them out
  if (isAllUnitDataReady()) {

    // This covers if you want to get the information by a filename
    if ( typeof ind === 'string' || ind instanceof String )
      ind = (isNaN(ind) ? cwtmapjson.unitfile.indexOf(ind) : parseInt(ind));

    // This pulls out the unit data completely
    if (cwtmapjson.unitdata.length > ind)
      return cwtmapjson.unitdata[ind];
  }

  console.log("CWT - MAP LIBRARY: Error Loading Unit")
  return "{}"
}

// Gets the amount of data in the unit list
export function getUnitDataLength() {
  return isAllUnitDataReady() ? cwtmapjson.unitdata.length : 0;
}

// This stores a temporary unit in the system until cleared out
export function getStoredUnitData(ind=0) {

  if (isAllUnitDataReady()) {
    if (cwtmapjson.tmpudata == 0){
      cwtmapjson.tmpudata = getUnitData(ind);
      console.log("CWT - MAP LIBRARY: TMPDATA", ind, cwtmapjson.tmpudata)
    }
  }

  return cwtmapjson.tmpudata
}

// This resets a temporary unit in the system so it can be used again
export function clearStoredUnitData() {
  cwtmapjson.tmpudata = 0
}

// ----------------------
// LOADING FUNCTIONS
// ----------------------

function loadList() {

  // Load up the load list information
  if (cwtmapjson.load == 0){

    // Once the file is ready
    if (jlib.isReady(0)){
      cwtmapjson.load = jlib.getFile(0)
      // console.log(cwtmapjson.load);

      // Put the game abbreviation information in here
      cwtmapjson.game = cwtmapjson.load.game;
      // console.log(cwtmapjson.game);

      // Put the map file list here
      cwtmapjson.mapfile = cwtmapjson.load["map"];
      if (cwtmapjson.mapfile === undefined)
        cwtmapjson.mapfile = []
      // console.log(cwtmapjson.mapfile);

      // Put the terrain file list here
      cwtmapjson.terrfile = cwtmapjson.load["terrain"];
      if (cwtmapjson.terrfile === undefined)
        cwtmapjson.terrfile = []

      // Put the unit file list here
      cwtmapjson.unitfile = cwtmapjson.load["unit"];
      if (cwtmapjson.unitfile === undefined)
        cwtmapjson.unitfile = []
    }
  }
}

function loadMapData() {

  // Load the map if we haven't started filling anything yet
  if (cwtmapjson.mapdone == 0 && cwtmapjson.load != 0){

    // If there are no maps in the system, then forget the whole thing
    if (cwtmapjson.mapfile.length == 0){
      console.log("CWT - MAP LIBRARY: No maps in 'loadlist.json' available")
      cwtmapjson.mapdone = 1;
    }

    // As long as there is a map not ready, we try to fill it
    else if (cwtmapjson.mapready.includes(0)){

      //console.log("Goes here - Map Ready", cwtmapjson.mapready)

      // Makes sure we are readying up all the files
      for (let i=0; i<cwtmapjson.mapready.length; i++) {
        if (cwtmapjson.mapready[i] == 0){

          //console.log("FILE:", cwtmapjson.mapfile[i])
          if (jlib.isReady(prefix+mapfolder+cwtmapjson.mapfile[i])) {
            cwtmapjson.mapdata[i] = jlib.getFile(prefix+mapfolder+cwtmapjson.mapfile[i])
            cwtmapjson.mapready[i] = 1
          }
        }
      }
    }

    // If the mapready is empty, let's start pulling in all the map data
    else if (cwtmapjson.mapready.length == 0){

      // This is where we should rapidfire load all the maps available
      for (let i=0; i<cwtmapjson.mapfile.length; i++) {
        jlib.addFile(prefix+mapfolder+cwtmapjson.mapfile[i])
        console.log(prefix+mapfolder+cwtmapjson.mapfile[i])
        cwtmapjson.mapdata.push("{}")
        cwtmapjson.mapready.push(0)
      }

      //console.log("Goes here - Map Ready Length", cwtmapjson.mapready)
    }

    // If every map is ready, then we are finished here
    else {
      console.log("CWT - MAP LIBRARY: All "+cwtmapjson.mapdata.length+" map(s) loaded successfully!")
      cwtmapjson.mapdone = 1;

      // Organizes the map data right away
      organizeMapData()
    }
  }
}

// When the map is done, let's organize the files
function organizeMapData(){

  let tmpfile = ""
  let tmpmod = []
  let tmpauth = []

  let tmpfolders = []
  let tmptags = []
  let tmprules = []

  let tmpwidth = 0
  let tmpheight = 0
  let tmpplayer = 0

  let tmpTypeMap = []
  let tmpTerrMap = []
  let tmpdata = []

  let tmpprops = []
  let tmpunits = []

  let tmptext = {}

  // Just in case we don't want to do this right away
  if (cwtmapjson.mapdone == 1){

    // Let's go through each map file and parse out the data
    for (let i=0; i<cwtmapjson.mapfile.length; i++) {

      // For easier tracking, we set the mapfile tracking index
      cwtmap.tracking[cwtmapjson.mapfile[i]] = cwtmap.file.length;

      // Then we fill up each individual thing - The map file name
      tmpfile = cwtmapjson.mapfile[i];
      tmptext = {}

      // The mods used
      for (let item in cwtmapjson.mapdata[i]) {

        let tmpitem = cwtmapjson.mapdata[i][item]

        if (item == "text") {

          // Get all the languages and put them in here
          for (let lang in tmpitem)
            tmptext[lang] = tmpitem[lang];
          cwtmap.text[tmpfile] = tmptext

        } else {

          // Let's deal with each piece, starting with the mod
          // And all the other applicable mods
          tmpmod.push(item)
          if (tmpitem.mod !== undefined){
            for (let j=0; j<tmpitem.mod.length; j++){
              if (!tmpmod.includes(tmpitem.mod[j]))
                tmpmod.push(tmpitem.mod[j]);
            }
          }
          cwtmap.modtracking[cwtmapjson.mapfile[i]] = tmpmod;

          // Then we deal with the author
          if (tmpitem.auth !== undefined)
            tmpauth.push(tmpitem.auth)

          // Then we deal with the folders
          if (tmpitem.folders !== undefined)
            tmpfolders.push(tmpitem.folders)

          // Then we deal with the tags
          if (tmpitem.tags !== undefined)
            tmptags.push(tmpitem.tags)

          // Then we deal with the rules
          if (tmpitem.rules !== undefined)
            tmprules.push(tmpitem.rules)

          // Then we deal with the width
          if (tmpitem.width !== undefined)
            tmpwidth = tmpitem.width

          // Then we deal with the height
          if (tmpitem.height !== undefined)
            tmpheight = tmpitem.height

          // Then we deal with the player
          if (tmpitem.player !== undefined)
            tmpplayer = tmpitem.player

          // Then we deal with the type map
          if (tmpitem.typemap !== undefined){
            tmpTypeMap.push(tmpitem.typemap)
            for (let j=0; j<tmpitem.typemap.length; j++)
              tmpTerrMap.push(tmpitem.typemap[j]["type"])
          }

          // Then we deal with the Terrain Map
          if (tmpitem.map !== undefined)
            tmpdata.push(tmpitem.map)

          // Then we deal with the Properties
          if (tmpitem.props !== undefined)
            tmpprops.push(tmpitem.props)

          // Then we deal with the Height
          if (tmpitem.units !== undefined)
            tmpunits.push(tmpitem.units)

        }

        // Let's now put stuff into the cwtmap
        for (let j=0; j<tmpmod.length; j++) {
          cwtmap.file.push(tmpfile)
          cwtmap.mod.push(tmpmod[j])
          cwtmap.auth.push(tmpauth)

          cwtmap.folders.push(tmpfolders)
          cwtmap.tags.push(tmptags)
          cwtmap.rules.push(tmprules)

          cwtmap.width.push(tmpwidth)
          cwtmap.height.push(tmpheight)
          cwtmap.player.push(tmpplayer)

          cwtmap.typeMap.push(tmpTypeMap)
          cwtmap.terrMap.push(tmpTerrMap)
          cwtmap.data.push(tmpdata)

          cwtmap.props.push(tmpprops)
          cwtmap.units.push(tmpunits)
        }

        // Then clear out all the stuff
        tmpmod = []
        tmpauth = []

        tmpfolders = []
        tmptags = []
        tmprules = []

        tmpwidth = 0
        tmpheight = 0
        tmpplayer = 0

        tmpTypeMap = []
        tmpTerrMap = []
        tmpdata = []

        tmpprops = []
        tmpunits = []
      }
    }

    console.log("CWTMAP TEST", cwtmap)
  }
}

function loadTerrainData() {

  // Load the terrain if we haven't started filling anything yet
  if (cwtmapjson.terrdone == 0 && cwtmapjson.load != 0){

    // If there are no terrain in the system, then forget the whole thing
    if (cwtmapjson.terrfile.length == 0){
      console.log("CWT - MAP LIBRARY: No terrain in 'loadlist.json' available")
      cwtmapjson.terrdone = 1;
    }

    // As long as there is a terrain not ready, we try to fill it
    else if (cwtmapjson.terready.includes(0)){

      // Makes sure we are readying up all the files
      for (let i=0; i<cwtmapjson.terready.length; i++) {
        if (cwtmapjson.terready[i] == 0){

          if (jlib.isReady(prefix+terrfolder+cwtmapjson.terrfile[i])) {
            cwtmapjson.terrdata[i] = jlib.getFile(prefix+terrfolder+cwtmapjson.terrfile[i])
            cwtmapjson.terready[i] = 1
          }
        }
      }
    }

    // If the mapready is empty, let's start pulling in all the map data
    else if (cwtmapjson.terready.length == 0){

      // This is where we should rapidfire load all the maps available
      for (let i=0; i<cwtmapjson.terrfile.length; i++) {
        jlib.addFile(prefix+terrfolder+cwtmapjson.terrfile[i])
        console.log(prefix+terrfolder+cwtmapjson.terrfile[i])
        cwtmapjson.terrdata.push("{}")
        cwtmapjson.terready.push(0)
      }
    }

    // If every map is ready, then we are finished here
    else {
      console.log("CWT - MAP LIBRARY: All "+cwtmapjson.terrdata.length+" terrain(s) loaded successfully!")
      cwtmapjson.terrdone = 1;

      // Organizes the terrain data right away
      organizeTerrainData()
    }
  }
}

// When the map is done, let's organize the files
function organizeTerrainData(){

  let tmpfile = ""
  let tmpcode = ""
  let tmpmod = []
  let tmpauth = []

  let tmpcolor = ""
  let tmpstars = 0
  let tmpstep = 0

  let tmpvision = []
  let tmphide = []

  let tmpmovecost = {}

  let tmptext = {}

  // Just in case we don't want to do this right away
  if (cwtmapjson.mapdone == 1){

    // Let's go through each terrain file and parse out the data
    for (let i=0; i<cwtmapjson.terrfile.length; i++) {

      // Then we fill up each individual thing - The map file name
      tmpfile = cwtmapjson.terrfile[i];
      tmpcode = (tmpfile.includes('.')) ? tmpfile.slice(0, tmpfile.lastIndexOf('.')) : tmpfile;
      tmptext = {}

      // For easier tracking, we set the terrfile tracking index
      cwtterrain.tracking[tmpcode] = cwtterrain.file.length;

      // The mods used
      for (let item in cwtmapjson.terrdata[i]) {

        let tmpitem = cwtmapjson.terrdata[i][item]

        if (item == "text") {

          // Get all the languages and put them in here
          for (let lang in tmpitem)
            tmptext[lang] = tmpitem[lang];
          cwtterrain.text[tmpfile] = tmptext

        } else {

          // Let's deal with each piece, starting with the mod
          // And all the other applicable mods
          tmpmod.push(item)
          if (tmpitem.mod !== undefined){
            for (let j=0; j<tmpitem.mod.length; j++){
              if (!tmpmod.includes(tmpitem.mod[j]))
                tmpmod.push(tmpitem.mod[j]);
            }
          }
          cwtterrain.modtracking[tmpcode] = tmpmod;

          // Then we deal with the author
          if (tmpitem.auth !== undefined)
            tmpauth.push(tmpitem.auth)

          // Then we deal with the color
          if (tmpitem.color !== undefined)
            tmpcolor = tmpitem.color

          // Then we deal with the stars
          if (tmpitem.stars !== undefined)
            tmpstars = tmpitem.stars

          // Then we deal with the vision
          if (tmpitem.vision !== undefined)
            tmpvision.push(tmpitem.vision)

          // Then we deal with the hide
          if (tmpitem.hide !== undefined)
            tmphide.push(tmpitem.hide)

          // Then we deal with the steps
          if (tmpitem.step !== undefined)
            tmpstep = tmpitem.step

          // Then we deal with the move cost
          if (tmpitem.movecost !== undefined){
            for (let terr in tmpitem.movecost)
              tmpmovecost[terr] = tmpitem.movecost[terr]
          }
        }

        // Let's now put stuff into the cwtterrain
        for (let j=0; j<tmpmod.length; j++) {
          cwtterrain.file.push(tmpfile)
          cwtterrain.code.push(tmpcode)
          cwtterrain.mod.push(tmpmod[j])
          cwtterrain.auth.push(tmpauth)

          cwtterrain.color.push(tmpcolor)
          cwtterrain.stars.push(tmpstars)
          cwtterrain.vision.push(tmpvision)
          cwtterrain.step.push(tmpstep)
          cwtterrain.hide.push(tmphide)

          cwtterrain.movecost.push(tmpmovecost)
        }

        // Then clear out all the stuff
        tmpmod = []
        tmpauth = []

        tmpcolor = ""
        tmpstars = 0
        tmpstep = 0
        tmpvision = []
        tmphide = []

        tmpmovecost = {}
      }
    }

    console.log("CWTTERRAIN TEST", cwtterrain)
  }
}

function loadUnitData() {

  // Load the unit if we haven't started filling anything yet
  if (cwtmapjson.unitdone == 0 && cwtmapjson.load != 0){

    // If there are no terrain in the system, then forget the whole thing
    if (cwtmapjson.unitfile.length == 0){
      console.log("CWT - MAP LIBRARY: No units in 'loadlist.json' available")
      cwtmapjson.unitdone = 1;
    }

    // As long as there is a unit not ready, we try to fill it
    else if (cwtmapjson.unitready.includes(0)){

      // Makes sure we are readying up all the files
      for (let i=0; i<cwtmapjson.unitready.length; i++) {
        if (cwtmapjson.unitready[i] == 0){

          if (jlib.isReady(prefix+unitfolder+cwtmapjson.unitfile[i])) {
            cwtmapjson.unitdata[i] = jlib.getFile(prefix+unitfolder+cwtmapjson.unitfile[i])
            cwtmapjson.unitready[i] = 1
          }
        }
      }
    }

    // If the mapready is empty, let's start pulling in all the map data
    else if (cwtmapjson.unitready.length == 0){

      // This is where we should rapidfire load all the maps available
      for (let i=0; i<cwtmapjson.unitfile.length; i++) {
        jlib.addFile(prefix+unitfolder+cwtmapjson.unitfile[i])
        console.log(prefix+unitfolder+cwtmapjson.unitfile[i])
        cwtmapjson.unitdata.push("{}")
        cwtmapjson.unitready.push(0)
      }
    }

    // If every map is ready, then we are finished here
    else {
      console.log("CWT - MAP LIBRARY: All "+cwtmapjson.unitdata.length+" unit(s) loaded successfully!")
      cwtmapjson.unitdone = 1;

      // Organizes the terrain data right away
      organizeUnitData()
    }
  }
}

// When the map is done, let's organize the files
function organizeUnitData(){

  let tmpfile = ""
  let tmpcode = ""
  let tmpmod = []
  let tmpauth = []

  let tmpcore = ""
  let tmpstarvalue = 0
  let tmpmaterial = 0

  let tmpweapons = []
  let tmpabilities = []
  let tmptags = []

  let tmphitpoints = {}
  let tmpbuild = {}
  let tmpmove = {}
  let tmpvision = {}
  let tmpfuel = {}
  let tmpdamage = {}
  let tmpload = {}

  let tmptext = {}

  // Just in case we don't want to do this right away
  if (cwtmapjson.mapdone == 1){

    // Let's go through each terrain file and parse out the data
    for (let i=0; i<cwtmapjson.unitfile.length; i++) {

      // Then we fill up each individual thing - The map file name
      tmpfile = cwtmapjson.unitfile[i];
      tmpcode = (tmpfile.includes('.')) ? tmpfile.slice(0, tmpfile.lastIndexOf('.')) : tmpfile;
      tmptext = {}

      // For easier tracking, we set the unitcode tracking index
      cwtunit.tracking[tmpcode] = cwtunit.file.length;

      // The mods used
      for (let item in cwtmapjson.unitdata[i]) {

        let tmpitem = cwtmapjson.unitdata[i][item]

        if (item == "text") {

          // Get all the languages and put them in here
          for (let lang in tmpitem)
            tmptext[lang] = tmpitem[lang];
          cwtunit.text[tmpfile] = tmptext

        } else {

          // Let's deal with each piece, starting with the mod
          // And all the other applicable mods
          tmpmod.push(item)
          if (tmpitem.mod !== undefined){
            for (let j=0; j<tmpitem.mod.length; j++){
              if (!tmpmod.includes(tmpitem.mod[j]))
                tmpmod.push(tmpitem.mod[j]);
            }
          }
          cwtunit.modtracking[tmpcode] = tmpmod;

          // Then we deal with the author
          if (tmpitem.auth !== undefined)
            tmpauth.push(tmpitem.auth)

          // Then we deal with the core
          if (tmpitem.core !== undefined)
            tmpcore = tmpitem.core

          // Then we deal with the starvalue
          if (tmpitem.starvalue !== undefined)
            tmpstarvalue = tmpitem.starvalue

          // Then we deal with the material
          if (tmpitem.material !== undefined)
            tmpmaterial = tmpitem.material

          // Then we deal with the weapons
          if (tmpitem.weapons !== undefined)
            tmpweapons.push(tmpitem.weapons)

          // Then we deal with the abilities
          if (tmpitem.abilities !== undefined)
            tmpabilities.push(tmpitem.abilities)

          // Then we deal with the tags
          if (tmpitem.tags !== undefined)
            tmptags.push(tmpitem.tags)

          // Then we deal with the hit points
          if (tmpitem.hitpoints !== undefined){
            for (let temp in tmpitem.hitpoints)
              tmphitpoints[temp] = tmpitem.hitpoints[temp]
          }

          // Then we deal with the build
          if (tmpitem.build !== undefined){
            for (let temp in tmpitem.build)
              tmpbuild[temp] = tmpitem.build[temp]
          }

          // Then we deal with the move
          if (tmpitem.move !== undefined){
            for (let temp in tmpitem.move)
              tmpmove[temp] = tmpitem.move[temp]
          }

          // Then we deal with the vision
          if (tmpitem.vision !== undefined){
            for (let temp in tmpitem.vision)
              tmpvision[temp] = tmpitem.vision[temp]
          }

          // Then we deal with the fuel
          if (tmpitem.fuel !== undefined){
            for (let temp in tmpitem.fuel)
              tmpfuel[temp] = tmpitem.fuel[temp]
          }

          // Then we deal with the damage
          if (tmpitem.damage !== undefined){
            for (let temp in tmpitem.damage)
              tmpdamage[temp] = tmpitem.damage[temp]
          }

          // Then we deal with the load
          if (tmpitem.load !== undefined){
            for (let temp in tmpitem.load)
              tmpload[temp] = tmpitem.load[temp]
          }
        }

        // Let's now put stuff into the cwtunit
        for (let j=0; j<tmpmod.length; j++) {
          cwtunit.file.push(tmpfile)
          cwtunit.code.push(tmpcode)
          cwtunit.mod.push(tmpmod[j])
          cwtunit.auth.push(tmpauth)

          cwtunit.core.push(tmpcore)
          cwtunit.starvalue.push(tmpstarvalue)
          cwtunit.material.push(tmpmaterial)

          cwtunit.weapons.push(tmpweapons)
          cwtunit.ability.push(tmpabilities)
          cwtunit.tags.push(tmptags)

          cwtunit.hitpoints.push(tmphitpoints)
          cwtunit.build.push(tmpbuild)
          cwtunit.move.push(tmpmove)
          cwtunit.vision.push(tmpvision)
          cwtunit.fuel.push(tmpfuel)
          cwtunit.damage.push(tmpdamage)
          cwtunit.load.push(tmpload)
        }

        // Then clear out all the stuff
        tmpmod = []
        tmpauth = []

        tmpcore = ""
        tmpstarvalue = 0
        tmpmaterial = 0

        tmpweapons = []
        tmpabilities = []
        tmptags = []

        tmphitpoints = {}
        tmpbuild = {}
        tmpmove = {}
        tmpvision = {}
        tmpfuel = {}
        tmpdamage = {}
        tmpload = {}

        tmptext = {}
      }
    }

    console.log("CWTUNIT TEST", cwtunit)
  }
}

// -----------------------
// PACK FUNCTIONS
// -----------------------

// Gets the amount of code data in the terrain list
export function getTerrainCodeLength() {
  return isAllTerrainDataReady() ? cwtterrain.code.length : 0;
}

// Creates all card packs with the code and mod parameters
export function createTerrainPacks(modadd=[], codeadd=[], modsub=[], codesub=[], clear=true) {

  // Start from scratch only if you are asked to do so
  if (clear){
    cwtpack.terrdata = []
    cwtpack.terrdatadict = {}
  }

  // Get the length of how much terrain is in the object
  let terrlen = getTerrainCodeLength();

  // Create the packs in order
  for (let i=0; i<terrlen; i++) {
    if (modadd.length == 0 && codeadd.length == 0)
      createTerrainCard(i, modsub, codesub);
    else if (modadd.length == 0 || codeadd.length == 0) {
      if (modadd.includes(cwtterrain.mod[i]) || codeadd.includes(cwtterrain.code[i]))
        createTerrainCard(i, modsub, codesub);
    } else {
      if (modadd.includes(cwtterrain.mod[i]) && codeadd.includes(cwtterrain.code[i]))
        createTerrainCard(i, modsub, codesub);
    }
  }

  // Then alter the default stuff
  if (modadd.length > 0){
    let revmod = modadd.reverse()
    // I have to use the dictionary items to determine the order of the singletons
    for (let i=0; i<revmod.length; i++) {
      for (let item in cwtpack.terrdatadict){
        if (item.includes(" ")){
          let tmpsplit = item.split(" ")
          if (tmpsplit.length === 2){
            if(tmpsplit[0] === revmod[i])
              cwtpack.terrdatadict[tmpsplit[1]] = cwtpack.terrdatadict[item]
          }
          //console.log(revmod[i], item)
        }
      }
    }
  }
}

// Returns the dictionary data
export function getTerrainDict() {
  return cwtpack.terrdatadict
}

// Returns the dictionary data
export function getTerrainPackData() {
  return cwtpack.terrdata
}

// This works with create Terrain Pack to make the cards themselves
function createTerrainCard(ind, modsub, codesub){
  if (!(modsub.includes(cwtterrain.mod[ind]) || codesub.includes(cwtterrain.code[ind]))) {
    cwtpack.terrdata.push(packTerrainData(ind))

    // Make quick defaults to reduce mistakes
    let code = cwtterrain.code[ind]
    let modcode = cwtterrain.mod[ind].concat(" ", cwtterrain.code[ind])

    // If it doesn't exist in the dictionary, put it in there
    if (cwtpack.terrdatadict[code] === undefined)
      cwtpack.terrdatadict[code] = ind;
    if (cwtpack.terrdatadict[modcode] === undefined)
      cwtpack.terrdatadict[modcode] = ind;
  }
}

// This stores the terrain pack data
function packTerrainData(ind){
  let tmpdict = {}

  tmpdict["file"] = cwtterrain.file[ind]
  tmpdict["code"] = cwtterrain.code[ind]
  tmpdict["mod"] = cwtterrain.mod[ind]
  tmpdict["auth"] = cwtterrain.auth[ind]

  tmpdict["color"] = cwtterrain.color[ind]
  tmpdict["stars"] = cwtterrain.stars[ind]
  tmpdict["vision"] = cwtterrain.vision[ind]
  tmpdict["step"] = cwtterrain.step[ind]
  tmpdict["hide"] = cwtterrain.hide[ind]

  tmpdict["movecost"] = cwtterrain.movecost[ind]

  // We might have to make the text distinct as well
  // tmpdict["text"] = cwtterrain.text

  return tmpdict
}

// Everything under is work in progress

// This will attempt to use the code and the mod to get the closest pack possible
// This can now be redesigned to use the dictionary
export function getTerrainDataKey(code, mod="", strict=false) {

  // Start out with an empty pack
  let terrpack = undefined;
  let modcode = code

  // Try to dind the ID first
  if (mod === undefined || mod === "")
    terrpack = cwtpack.terrdatadict[code]
  else {
    modcode = mod.concat(" ", code)
    terrpack = cwtpack.terrdatadict[modcode]
    if (!strict && terrpack === undefined)
      terrpack = cwtpack.terrdatadict[code];
  }

  // Switch from the ID to the actual pack
  if (terrpack !== undefined)
    terrpack = cwtpack.terrdata[terrpack]

  /*// Make sure there are terrains first
  let terrlen = getTerrainCodeLength();
  let terrdata = cwtterrain

  // Let's make sure we use the work we did
  let start = (cwtterrain.tracking[code] !== undefined) ? cwtterrain.tracking[code] : 0;

  // Then iterate through and get the best match based on the parameters above
  for (let i=start; i<terrlen; i++) {

    if (terrpack === undefined || mod == terrdata.mod[i]){
      if (code == cwtterrain.code[i])
        terrpack = packTerrainData(i);
    }
  }

  // If terrpack is undefined or doesn't pass the strict test,
  // just make it an empty thing instead
  if (terrpack === undefined || (strict && mod !== terrpack["mod"]))
    terrpack = {};
  //*/

  return terrpack
}



export function packTerrainText(){

  // Let's make a default one with blank values
  cwtpack.terrtext = []

  // We'll hard code specific types for these, to keep it under control
  let terrtext = cwtterrain.text

  // Then we extract from each type of thing
  for (let code in terrtext){
    for (let mod in terrtext[code]){
      for (let lang in terrtext[code][mod]){
        for (let type in terrtext[code][mod][lang]){
          let tmpdict = {}
          let tmpcode = (code.includes('.')) ? code.slice(0, code.lastIndexOf('.')) : code;
          tmpdict["code"] = tmpcode
          tmpdict["mod"] = mod
          tmpdict["lang"] = lang
          tmpdict["type"] = type
          tmpdict["data"] = terrtext[code][mod][lang][type]

          let ind = cwtpack.terrtext.length
          cwtpack.terrtext.push(tmpdict)

          let codetype = [tmpcode,type].join(" ")
          let langtype = [lang,codetype].join(" ")
          let modtype = [mod,codetype].join(" ")
          let modlangtype = [mod,lang,codetype].join(" ")

          // If it doesn't exist in the dictionary, put it in there
          if (cwtpack.terrtextdict[codetype] === undefined)
            cwtpack.terrtextdict[codetype] = ind;
          if (cwtpack.terrtextdict[langtype] === undefined)
            cwtpack.terrtextdict[langtype] = ind;
          if (cwtpack.terrtextdict[modtype] === undefined)
            cwtpack.terrtextdict[modtype] = ind;
          if (cwtpack.terrtextdict[modlangtype] === undefined)
            cwtpack.terrtextdict[modlangtype] = ind;
        }
      }
    }
  }

}

// Returns the dictionary data
export function getTerrainTextData() {
  return cwtpack.terrtext
}

// Returns the dictionary data
export function getTerrainTextDict() {
  return cwtpack.terrtextdict
}

// This will attempt to use the code and the mod to get the closest pack possible
// This can now be redesigned to use the dictionary
export function getTerrainTextKey(code, type, lang="", mod="", strict=false) {

  // Start out with an empty pack
  let textpack = undefined;
  let codetype = [code,type].join(" ")

  // Try to find the ID first
  if (mod === undefined || mod === "") {
    if (lang === undefined || lang === "") {
      textpack = cwtpack.terrtextdict[codetype]
    } else {
      let langcode = [lang,codetype].join(" ")
      textpack = cwtpack.terrtextdict[langcode]
      if (!strict && textpack === undefined)
        textpack = cwtpack.terrtextdict[codetype];
    }
  } else {
    let modcode = mod.concat(" ", codetype)
    if (lang === undefined || lang === "") {
      textpack = cwtpack.terrtextdict[modcode]
      if (!strict && textpack === undefined)
        textpack = cwtpack.terrtextdict[codetype];
    } else {
      let langcode = [lang,modcode].join(" ")
      textpack = cwtpack.terrtextdict[langcode]
      if (!strict && textpack === undefined)
        textpack = cwtpack.terrtextdict[codetype];
    }
  }

  // Switch from the ID to the actual pack
  if (textpack !== undefined)
    textpack = cwtpack.terrtext[textpack]

  return textpack
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
