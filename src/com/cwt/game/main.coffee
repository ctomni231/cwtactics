#
# This file is the start module of cwt. If this file will parsed and 
# interpreted, the whole engine will started.
#
neko.define "cwtMain", ( require, exports ) ->
  
  nekoSys = require("nekoSys")
  
  # run tester
  nekoSys.includeCoffee("test.coffee")
  
  