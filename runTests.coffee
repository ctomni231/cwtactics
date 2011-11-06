files = []
fs = require("fs")

# Prepare neko globals
#
# This configuration is used by the github structure, so all modules has 
# $PROJECT_DIR/src as base directory
#
global.NEKO_SYS_LOGGER = ( msg ) -> 
  console.log msg

global.NEKO_SYS_JSLOADER = ( path ) -> 
  require "./js_src/#{path}"
  
global.NEKO_SYS_COFFEELOADER = ( path ) -> 
  require "./js_src/#{path}"

global.NEKO_SYS_JSONLOADER = ( path ) ->
  return JSON.parse( fs.readFileSync "#{path}.json",'utf8' ) 

global.NEKO_SYS_SLEEP = () -> return

console.log process.cwd()

require "nekoJS/core"

# push custom files here

if files.length is 0
  # generate file list from dir
  files = fs.readdirSync "test"
  
require "./js_test/#{file}" for file in files