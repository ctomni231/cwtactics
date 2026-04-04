import { input, state, loop, view } from "../engine/screenstate.js"
import * as jlib from "../engine/js/jsonlib.js"

/*
 * Custom Wars Tactics - Map Library
 *
 * The map library takes data from JSON files and turns them into cards
 * for consumption by other classes. This class is dynamic and can load
 * up information on the fly
 */

 // TODO
 // Need to add the loadlist "color" and "text" to complete this thing

 // DONE
 // Need to allow text to organize filter by language and mod
 // We should test if the language ordering works
 // Need to add code to the text

export const name = "CWTMAPLIB"

const prefix = "./data/"
const loadlist = "loadlist.json"
const url = prefix+loadlist;
var datadone = 0;

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
  code: [""],
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

  type: [""],
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

  type: [""],
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

// This holds the packs
export const cwtpack = {
  // There should be 4 groups (data, text, loaddata, loadtext)
  data: [],
  datadict: {},
  text: [],
  textdict: {}
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

  // For testing how specific things work in the data
  testData()
}

export function render(canvas, ctx){
}

// -------------------------
// PACK FUNCTIONS
// -------------------------

// Creates all the code packs with the code and mod parameters
export function createDataPack(key, modadd=[], modsub=[], codeadd=[], codesub=[]) {

  // Let's make sure we have a valid index first
  let index = checkIndex(key)

  if (index >= 0 && index < cwtmapparts.sectname.length) {
    let varname = cwtmapparts.varname[index]

    // Let's make a key from all the information we have
    let tmpkey = ""+cwtmapparts.sectname[index]
    let tmpattr = [modadd, codeadd, modsub, codesub]
    let tmpsym = ["+", "*", "-", "_"]

    for (let i=0; i<tmpattr.length; i++){
      for (let j=0; j<tmpattr[i].length; j++)
        tmpkey += " "+tmpsym[i]+""+tmpattr[i][j]
    }

    // We always start fresh in the system
    let tmpdict = {
      arr: [],
      dict: {}
    }
    if (cwtpack.datadict[tmpkey] === undefined){
      cwtpack.datadict[tmpkey] = cwtpack.data.length
      cwtpack.data.push(tmpdict)
    } else
      cwtpack.data[cwtpack.datadict[tmpkey]] = tmpdict

    // Check each code and mod to see what should be added in
    for (let i=0; i<varname.type.length; i++){
      for (let j=0; j<varname.mod[i].length; j++) {
        if (modadd.length == 0 && codeadd.length == 0)
          createDataCard(key, i, j, tmpkey, modsub, codesub)
        else if (modadd.length == 0 || codeadd.length == 0) {
          if (modadd.includes(varname.mod[i][j]) || codeadd.includes(varname.code[i]))
            createDataCard(key, i, j, tmpkey, modsub, codesub)
        } else if (modadd.includes(varname.mod[i][j]) && codeadd.includes(varname.code[i]))
          createDataCard(key, i, j, tmpkey, modsub, codesub)
      }
    }

    // Then alter the default stuff
    if (modadd.length > 0){
      let tmpindex = cwtpack.datadict[tmpkey]
      let revmod = modadd.reverse()
      // I have to use the dictionary items to determine the order of the singletons
      for (let i=0; i<revmod.length; i++) {
        for (let item in cwtpack.data[tmpindex].dict){
          if (item.includes(" ")){
            let tmpsplit = item.split(" ")
            if (tmpsplit.length === 2){
              if(tmpsplit[0] === revmod[i])
                cwtpack.data[tmpindex].dict[tmpsplit[1]] = cwtpack.data[tmpindex].dict[item]
            }
          }
        }
      }
    }
  }
}

// THis works with the Data Pack to make the cards
function createDataCard(key, ind, mod, tmpkey, modsub, codesub) {
  let index = checkIndex(key)
  let tmpindex = cwtpack.datadict[tmpkey]

  if (index >= 0 && index < cwtmapparts.sectname.length) {
    let varname = cwtmapparts.varname[index]
    if (!(modsub.includes(varname.mod[ind][mod]) || codesub.includes(varname.code[ind]))) {
      // I have to figure out how to handle packs in this version
      // It is probably going to be similar to cwtmapjson.sect functionality

      // We are probably going to have to create the tempdict in here
      // Maybe a text key for finding specific groups (stil undecided)
      // -> This is turning the above into a string key like
      // -> "MAPS INFT +CWT *INFT -CWT _INFT"
      // Two pieces per group (data and dict) and possibly (key)

      // Trying to figure out where to insert the tmpdict once created
      let tmpind = cwtpack.data[tmpindex].arr.length
      cwtpack.data[tmpindex].arr.push(createDataDict(key, ind, mod))

      // Make quick defaults to reduce mistakes
      let code = varname.code[ind]
      let modcode = [varname.mod[ind][mod],varname.code[ind]].join(" ")

      // If it doesn't exist in the dictionary, put it in there
      if (cwtpack.data[tmpindex].dict[code] === undefined)
        cwtpack.data[tmpindex].dict[code] = tmpind;
      if (cwtpack.data[tmpindex].dict[modcode] === undefined)
        cwtpack.data[tmpindex].dict[modcode] = tmpind;
    }
  }
}

// Creates a data dictionary using the keys in dfltracking
// key => The section name [sectname] key
// ind => The index of the map part data to extract
// mod => The mod of this particular map
export function createDataDict(key, ind, mod=0){

  let tmpdict = {}
  let index = checkIndex(key)

  if (index >= 0 && index < cwtmapparts.sectname.length) {
    let varname = cwtmapparts.varname[index]
    for (let item in varname.dfltracking) {

      // This way you can look for maps straight up
      if ( typeof ind === 'string' )
        ind = (isNaN(ind) ? varname.tracking[ind] : parseInt(ind));

      // Look for a specific index
      if (ind >= 0 && ind < varname.type.length) {
        tmpdict[item] = (item == "mod" && varname[item][ind].length > 0) ?
          varname[item][ind][mod] : varname[item][ind];
      } else {
        console.log("MAPLIB WARNING: '"+ind+"' is out of bounds for '"+key+"'!");
        break
      }
    }
  } else
    console.log("MAPLIB ERROR: '"+key+"' is not a proper key!");

  return tmpdict
}

export function createTextPack(key, modadd=[], modsub=[], langadd=[], langsub=[], codeadd=[], codesub=[]){
  let tmpdict = {}

  let index = checkIndex(key)

  if (index >= 0 && index < cwtmapparts.sectname.length) {
    let varname = cwtmapparts.varname[index]

    // Let's make a key from all the information we have
    let tmpkey = ""+cwtmapparts.sectname[index]
    let tmpattr = [modadd, langadd, modsub, langsub]
    let tmpsym = ["+", "*", "-", "_"]

    for (let i=0; i<tmpattr.length; i++){
      for (let j=0; j<tmpattr[i].length; j++)
        tmpkey += " "+tmpsym[i]+""+tmpattr[i][j]
    }

    // We always start fresh in the system
    let tmpdict = {
      arr: [],
      dict: {}
    }
    if (cwtpack.textdict[tmpkey] === undefined){
      cwtpack.textdict[tmpkey] = cwtpack.text.length
      cwtpack.text.push(tmpdict)
    } else
      cwtpack.text[cwtpack.textdict[tmpkey]] = tmpdict

    // This is the current text for this item
    let tmpindex = cwtpack.textdict[tmpkey]
    let tmptext = varname.text

    // Check each thing to see what should be added in
    for (let code in tmptext){
      for (let mod in tmptext[code]){

        // While we are in the mod section, let's make a modlist
        let modlist = []

        // If the data matches, put it in the mod
        if ((modadd.length == 0 || modadd.includes(mod)) && !modsub.includes(mod))
          modlist.push(mod)

        // Then check if there is a mod array
        let modarr = tmptext[code][mod]["mod"]
        if (modarr !== undefined) {
          // If there is a mod array, we add in those values too
          for (let i=0; i<modarr.length; i++) {
            if ((modadd.length == 0 || modadd.includes(modarr[i])) && !modsub.includes(modarr[i]))
              modlist.push(modarr[i])
          }
        }

        // Now we go through the languages
        for (let lang in tmptext[code][mod]) {

          // Mod is not a proper language piece
          if (lang != 'mod'){

            // While we are in the lang section, let's make a lang list
            let langlist = []

            // If the data matches, put it in the mod
            if ((langadd.length == 0 || langadd.includes(lang)) && !langsub.includes(lang))
              langlist.push(lang)

            // Finally we will place it into the pack for processing
            for (let type in tmptext[code][mod][lang]){

              // Make sure the lang and mod are good first
              for (let i=0; i<modlist.length; i++) {
                if (langlist.includes(lang)) {

                  // Store the thing in the thing
                  let tempdict = {}
                  let tmpcode = (code.includes('.')) ? code.slice(0, code.lastIndexOf('.')) : code;

                  if ((codeadd.length == 0 || codeadd.includes(tmpcode)) && !codesub.includes(tmpcode)){
                    tempdict["code"] = tmpcode
                    tempdict["mod"] = modlist[i]
                    tempdict["lang"] = lang
                    tempdict["type"] = type
                    tempdict["data"] = tmptext[code][mod][lang][type]

                    // Trying to figure out where to insert the tmpdict once created
                    let tmpind = cwtpack.text[tmpindex].arr.length
                    cwtpack.text[tmpindex].arr.push(tempdict)

                    let codetype = [tmpcode,type].join(" ")
                    let langtype = [lang,codetype].join(" ")
                    let modtype = [modlist[i],codetype].join(" ")
                    let modlangtype = [modlist[i],lang,codetype].join(" ")

                    // If it doesn't exist in the dictionary, put it in there
                    if (cwtpack.text[tmpindex].dict[codetype] === undefined)
                      cwtpack.text[tmpindex].dict[codetype] = tmpind;
                    if (cwtpack.text[tmpindex].dict[langtype] === undefined)
                      cwtpack.text[tmpindex].dict[langtype] = tmpind;
                    if (cwtpack.text[tmpindex].dict[modtype] === undefined)
                      cwtpack.text[tmpindex].dict[modtype] = tmpind;
                    if (cwtpack.text[tmpindex].dict[modlangtype] === undefined)
                      cwtpack.text[tmpindex].dict[modlangtype] = tmpind;
                  }
                }
              }
            }
          }
        }
      }
    }

    // Then alter the default stuff for lang and mod
    if (langadd.length > 0 && modadd.length > 0){
      let tmpindex = cwtpack.textdict[tmpkey]
      let revmod = modadd.reverse()
      let revlang = langadd.reverse()
      // I have to use the dictionary items to determine the order of the singletons
      for (let i=0; i<revmod.length; i++) {
        for (let j=0; j<revlang.length; j++) {
          for (let item in cwtpack.text[tmpindex].dict){
            if (item.includes(" ")){
              let tmpsplit = item.split(" ")
              if (tmpsplit.length === 4){
                if(tmpsplit[0] === revmod[i] && tmpsplit[1] === revlang[j]){
                  let tmpjoin = [tmpsplit[2],tmpsplit[3]].join(" ")
                  cwtpack.text[tmpindex].dict[tmpjoin] = cwtpack.text[tmpindex].dict[item]
                }
              }
            }
          }
        }
      }
    }

    // or else alter the default stuff for lang
    else if (langadd.length > 0){
      let tmpindex = cwtpack.textdict[tmpkey]
      let revlang = langadd.reverse()
      // I have to use the dictionary items to determine the order of the singletons
      for (let i=0; i<revlang.length; i++) {
        for (let item in cwtpack.text[tmpindex].dict){
          if (item.includes(" ")){
            let tmpsplit = item.split(" ")
            if (tmpsplit.length === 4){
              if(tmpsplit[1] === revlang[i]){
                let tmpjoin = [tmpsplit[0],tmpsplit[2],tmpsplit[3]].join(" ")
                cwtpack.text[tmpindex].dict[tmpjoin] = cwtpack.text[tmpindex].dict[item]
                tmpjoin = [tmpsplit[2],tmpsplit[3]].join(" ")
                cwtpack.text[tmpindex].dict[tmpjoin] = cwtpack.text[tmpindex].dict[item]
              }
            }
          }
        }
      }
    }

    // or else alter the default stuff for mod
    else if (modadd.length > 0){
      let tmpindex = cwtpack.textdict[tmpkey]
      let revmod = modadd.reverse()
      // I have to use the dictionary items to determine the order of the singletons
      for (let i=0; i<revmod.length; i++) {
        for (let item in cwtpack.text[tmpindex].dict){
          if (item.includes(" ")){
            let tmpsplit = item.split(" ")
            if (tmpsplit.length === 4){
              if(tmpsplit[0] === revmod[i]){
                let tmpjoin = [tmpsplit[1],tmpsplit[2],tmpsplit[3]].join(" ")
                cwtpack.text[tmpindex].dict[tmpjoin] = cwtpack.text[tmpindex].dict[item]
                tmpjoin = [tmpsplit[2],tmpsplit[3]].join(" ")
                cwtpack.text[tmpindex].dict[tmpjoin] = cwtpack.text[tmpindex].dict[item]
              }
            }
          }
        }
      }
    }
  }
}

// This gets a Data Key once it has been created
// key => The section name [sectname] key
// modcode => For "TERR" - use "PLIN" or "CWT PLIN" for specifics
export function getDataKey(key, modcode) {

  let index = key

  if ( typeof key === 'string')
    index = (isNaN(key) ? cwtpack.datadict[key] : parseInt(key));

  // If we can't find the index of the key, let's do fuzzy search
  if (index === undefined) {
    for (let item in cwtpack.datadict){
      if(item.includes(key)) {
        index = cwtpack.datadict[item]
        break
      }
    }

    if (index === undefined){
      console.log("CWTLIB - GETDATAKEY: Couldn't find the '"+key+"' group!")
      return "{}"
    }
  }

  // If we get this far, we know there is something there
  let data = undefined
  if (index >= 0 && index < cwtpack.data.length)
    data = cwtpack.data[index].dict[modcode]
  return (data === undefined) ? "{}" : cwtpack.data[index].arr[data]
}

// This gets a Data Key once it has been created
// key => The section name [sectname] key
// modcode => For "TERR" - use "PLIN name","en PLIN name","CWT PLIN name"or,"CWT en PLIN name"
export function getTextKey(key, modcode) {

  let index = key

  if ( typeof key === 'string')
    index = (isNaN(key) ? cwtpack.textdict[key] : parseInt(key));

  // If we can't find the index of the key, let's do fuzzy search
  if (index === undefined) {
    for (let item in cwtpack.textdict){
      if(item.includes(key)) {
        index = cwtpack.textdict[item]
        break
      }
    }

    if (index === undefined){
      console.log("CWTLIB - GETTEXTKEY: Couldn't find the '"+key+"' group!")
      return "{}"
    }
  }

  // If we get this far, we know there is something there
  let data = undefined
  if (index >= 0 && index < cwtpack.text.length)
    data = cwtpack.text[index].dict[modcode]
  return (data === undefined) ? "{}" : cwtpack.text[index].arr[data]
}

// Resets the Data Packs back to empty
export function clearDataPacks(){
  cwtpack.data = []
  cwtpack.datadict = {}
}

// Gets the length of type data in the list
export function getDataTypeLength(ind){
  let index = checkIndex(ind)
  if (index >= 0 && index < cwtmapparts.sectname.length) {
    let sectname = cwtmapparts.sectname[index]
    return (cwtmapjson.sect[sectname].done == 1) ? cwtmapparts.varname[ind].type.length : 0
  } else {
    console.log("MAPLIB ERROR: '"+ind+"' is not a proper key!")
    return 0
  }
}

// This checks if all data has been loaded into the system
// Also accepts specific indexes and keywords
export function isAllDataReady(ind=undefined) {

  // Sometimes you just want to see if you are good 2 go in general
  if (ind === undefined){
    for (let i=0; i<cwtmapparts.sectname.length; i++) {
      if (cwtmapjson.sect[cwtmapparts.sectname[i]] === undefined)
        return false
      else if (cwtmapjson.sect[cwtmapparts.sectname[i]].done == 0)
        return false
    }
    return true
  }

  // But if you just want to check a specific one, then do this instead
  let index = checkIndex(ind)
  if (index >= 0 && index < cwtmapparts.sectname.length) {
    let sectname = cwtmapparts.sectname[index]
    return (cwtmapjson.sect[sectname] === undefined) ? false : (cwtmapjson.sect[sectname].done == 1);
  } else {
    console.log("MAPLIB ERROR: '"+ind+"' is not a proper key!")
    return false
  }
}

// Allows many ways of checking the index
function checkIndex(ind){
  // This covers if you want to get the information by a filename
  if ( typeof ind === 'string')
    ind = (isNaN(ind) ? cwtmapparts.sectname.indexOf(ind) : parseInt(ind));

  return ind
}

// -------------------------
// LOADING FUNCTIONS
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

function testData(){
  if(datadone == 0){
    if (isAllDataReady()) {
      createDataPack("MAPS", ["AW2", "AW1", "CWT"], [], [], [])
      createDataPack("TERR", [], [], [], [])
      createDataPack("UNIT", ["AW4", "CWT"], [], [], [])
      createTextPack("MAPS", ["AW4", "AW2", "CWT"], [], ["de", "en"], [], [], [])
      createTextPack("TERR", [], [], [], [], [], [])
      createTextPack("UNIT", [], [], [], [], [], [])
      console.log("CWTLIB - DATAPACK", cwtpack)
      console.log("CWTLIB - DATAKEY", getDataKey("UNIT", "INFT"), getTextKey("TERR", "NULL name"))
      datadone = 1
    }
  }
}

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
